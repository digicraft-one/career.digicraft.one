import { randomUUID } from "crypto";
import {
    buildEmailContent,
    EmailTemplateContext,
    getDefaultTemplateForStatus,
} from "@/lib/hiring/emailTemplates";
import { sendEmail, EMAIL_WRAPPER } from "@/lib/email/brevo";
import { sendApplicationStatusNotification } from "@/lib/telegram/telegram";
import {
    ActivityEntry,
    ActivityType,
    ApplicationStatus,
    CommunicationEntry,
    EmailTemplateId,
    InterviewMode,
    InterviewOutcome,
    InterviewRound,
    SignIntegration,
} from "@/types/schemas";
import { ApplicationDocument } from "@/schemas/Application";
import { getStatusLabel } from "@/lib/hiring/constants";

export function createActivity(
    type: ActivityType,
    by: string,
    summary: string,
    meta?: Record<string, unknown>
): ActivityEntry {
    return {
        type,
        at: new Date(),
        by,
        summary,
        meta,
    };
}

export async function sendAndLogEmail(
    app: ApplicationDocument,
    templateId: EmailTemplateId,
    ctx: EmailTemplateContext,
    sentBy: string
): Promise<{ success: boolean; communication: CommunicationEntry }> {
    const { subject, htmlContent } = buildEmailContent(templateId, ctx);
    const wrappedHtml = EMAIL_WRAPPER(htmlContent);

    const result = await sendEmail({
        to: [{ email: app.email, name: app.name }],
        subject,
        htmlContent: wrappedHtml,
    });

    const communication: CommunicationEntry = {
        id: randomUUID(),
        templateId,
        subject,
        bodyHtml: wrappedHtml,
        sentAt: new Date(),
        sentBy,
        success: !!result.success,
        errorMessage: result.success
            ? undefined
            : String(result.error ?? "Send failed"),
    };

    return { success: !!result.success, communication };
}

export function appendStatusChange(
    app: ApplicationDocument,
    newStatus: ApplicationStatus,
    changedBy: string,
    options?: {
        note?: string;
        emailSent?: boolean;
        declineReason?: string;
    }
) {
    if (app.status === newStatus) return;

    const previousStatus = app.status;
    app.status = newStatus;
    app.statusHistory.push({
        status: newStatus,
        changedAt: new Date(),
        changedBy,
        note: options?.note,
        emailSent: options?.emailSent ?? false,
        declineReason: options?.declineReason,
    });

    if (options?.declineReason) {
        app.declineReason = options.declineReason;
    }

    app.activities.push(
        createActivity(
            "status_change",
            changedBy,
            `Status changed to ${getStatusLabel(newStatus)}`,
            {
                from: previousStatus,
                to: newStatus,
                emailSent: options?.emailSent,
            }
        )
    );
}

export async function notifyStatusChangeTelegram(
    name: string,
    jobTitle: string,
    status: ApplicationStatus
) {
    try {
        await sendApplicationStatusNotification({
            name,
            jobTitle,
            status: getStatusLabel(status),
        });
    } catch (e) {
        console.error("Status telegram failed:", e);
    }
}

export async function sendStatusEmailIfRequested(
    app: ApplicationDocument,
    status: ApplicationStatus,
    sentBy: string,
    sendEmailFlag: boolean,
    extraCtx?: Partial<EmailTemplateContext>
): Promise<boolean> {
    if (!sendEmailFlag || status === "pending") return false;

    const templateId = getDefaultTemplateForStatus(status);
    if (!templateId) return false;

    const ctx: EmailTemplateContext = {
        name: app.name,
        jobTitle: app.jobTitle,
        contractUrl: app.signIntegration?.contractUrl,
        ...extraCtx,
    };

    const { success, communication } = await sendAndLogEmail(
        app,
        templateId,
        ctx,
        sentBy
    );

    app.communications.push(communication);
    app.activities.push(
        createActivity(
            "email_sent",
            sentBy,
            success
                ? `Email sent: ${communication.subject}`
                : `Email failed: ${communication.subject}`,
            { templateId, success }
        )
    );

    const lastHistory = app.statusHistory.at(-1);
    if (lastHistory) lastHistory.emailSent = success;

    return success;
}

export function addInterviewRound(
    app: ApplicationDocument,
    data: {
        round: number;
        label?: string;
        scheduledAt: Date;
        timezone: string;
        mode: InterviewMode;
        meetingLink: string;
        interviewer?: string;
        notes?: string;
        createdBy: string;
    }
): InterviewRound {
    const interview: InterviewRound = {
        id: randomUUID(),
        round: data.round,
        label: data.label,
        scheduledAt: data.scheduledAt,
        timezone: data.timezone,
        mode: data.mode,
        meetingLink: data.meetingLink,
        interviewer: data.interviewer,
        notes: data.notes,
        outcome: "scheduled",
        createdAt: new Date(),
        createdBy: data.createdBy,
    };

    app.interviews.push(interview);

    if (app.status !== "interview" && app.status !== "selected" && app.status !== "offer" && app.status !== "hired") {
        appendStatusChange(app, "interview", data.createdBy);
    }

    app.activities.push(
        createActivity(
            "interview_scheduled",
            data.createdBy,
            `Interview round ${data.round} scheduled`,
            { interviewId: interview.id, scheduledAt: data.scheduledAt }
        )
    );

    return interview;
}

export function updateInterviewRound(
    app: ApplicationDocument,
    interviewId: string,
    updates: Partial<{
        round: number;
        label: string;
        scheduledAt: Date;
        timezone: string;
        mode: InterviewMode;
        meetingLink: string;
        interviewer: string;
        notes: string;
        outcome: InterviewOutcome;
    }>,
    updatedBy: string
): InterviewRound | null {
    const interview = app.interviews.find((i) => i.id === interviewId);
    if (!interview) return null;

    Object.assign(interview, updates, { updatedAt: new Date() });

    app.activities.push(
        createActivity(
            "interview_updated",
            updatedBy,
            `Interview round ${interview.round} updated`,
            { interviewId, outcome: interview.outcome }
        )
    );

    return interview;
}

export async function sendInterviewInviteEmail(
    app: ApplicationDocument,
    interview: InterviewRound,
    sentBy: string
): Promise<boolean> {
    const { success, communication } = await sendAndLogEmail(
        app,
        "interview_invite",
        {
            name: app.name,
            jobTitle: app.jobTitle,
            meetingLink: interview.meetingLink,
            scheduledAt: interview.scheduledAt,
            timezone: interview.timezone,
            interviewer: interview.interviewer,
        },
        sentBy
    );

    app.communications.push(communication);
    app.activities.push(
        createActivity(
            "interview_invite_sent",
            sentBy,
            success
                ? `Interview invite sent for round ${interview.round}`
                : `Interview invite failed for round ${interview.round}`,
            { interviewId: interview.id, success }
        )
    );

    return success;
}

export function updateSignIntegration(
    app: ApplicationDocument,
    data: Partial<SignIntegration> & { signPrefillUrl?: string },
    linkedBy: string
) {
    app.signIntegration = {
        ...app.signIntegration,
        ...data,
        linkedAt: new Date(),
        linkedBy,
    };

    const summary = data.contractUrl
        ? "Contract link saved"
        : data.signHiringUserId
          ? "Sign hiring user linked"
          : "Sign integration updated";

    app.activities.push(
        createActivity(
            data.contractUrl ? "contract_linked" : "sign_linked",
            linkedBy,
            summary,
            { ...data }
        )
    );
}

export async function sendTemplateEmail(
    app: ApplicationDocument,
    templateId: EmailTemplateId,
    sentBy: string,
    ctx?: Partial<EmailTemplateContext>
): Promise<boolean> {
    const { success, communication } = await sendAndLogEmail(
        app,
        templateId,
        {
            name: app.name,
            jobTitle: app.jobTitle,
            contractUrl: app.signIntegration?.contractUrl,
            meetingLink: app.interviews.at(-1)?.meetingLink,
            scheduledAt: app.interviews.at(-1)?.scheduledAt,
            timezone: app.interviews.at(-1)?.timezone,
            interviewer: app.interviews.at(-1)?.interviewer,
            ...ctx,
        },
        sentBy
    );

    app.communications.push(communication);
    app.activities.push(
        createActivity(
            "email_sent",
            sentBy,
            success
                ? `Email sent: ${communication.subject}`
                : `Email failed: ${communication.subject}`,
            { templateId, success }
        )
    );

    return success;
}
