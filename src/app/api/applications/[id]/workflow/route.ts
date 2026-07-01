import { errorResponse, successResponse } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth/options";
import { connectToDB } from "@/lib/db/mongoose";
import {
    addInterviewRound,
    appendStatusChange,
    notifyStatusChangeTelegram,
    sendInterviewInviteEmail,
    sendInterviewRescheduleEmail,
    sendTemplateEmail,
    updateInterviewRound,
    updateSignIntegration,
} from "@/lib/hiring/workflow";
import { Application } from "@/schemas/Application";
import {
    EmailTemplateId,
    InterviewMode,
    InterviewOutcome,
} from "@/types/schemas";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { parseScheduledAtInput } from "@/lib/timezone";

interface Params {
    params: Promise<{ id: string }>;
}

const VALID_MODES: InterviewMode[] = [
    "google_meet",
    "zoom",
    "phone",
    "in_person",
    "other",
];

const VALID_OUTCOMES: InterviewOutcome[] = [
    "scheduled",
    "completed",
    "no_show",
    "cancelled",
    "rescheduled",
];

const VALID_TEMPLATES: EmailTemplateId[] = [
    "under_review",
    "shortlisted",
    "interview_invite",
    "interview_reschedule",
    "interview_reminder",
    "selected",
    "offer",
    "hired",
    "declined",
    "custom",
];

export async function POST(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse("Unauthorized"), {
            status: 401,
        });

    try {
        await connectToDB();
        const { id } = await params;
        const body = await req.json();
        const adminName = session.user?.name || "Admin";

        const app = await Application.findById(id);
        if (!app)
            return NextResponse.json(errorResponse("Not found"), {
                status: 404,
            });

        const action = body.action as string;

        switch (action) {
            case "schedule_interview": {
                if (!body.scheduledAt || !body.meetingLink?.trim()) {
                    return NextResponse.json(
                        errorResponse(
                            "Interview date and meeting link are required"
                        ),
                        { status: 400 }
                    );
                }

                const mode = body.mode || "google_meet";
                if (!VALID_MODES.includes(mode)) {
                    return NextResponse.json(
                        errorResponse("Invalid interview mode"),
                        { status: 400 }
                    );
                }

                const round =
                    body.round ??
                    (app.interviews.length > 0
                        ? Math.max(...app.interviews.map((i) => i.round)) + 1
                        : 1);

                const interview = addInterviewRound(app, {
                    round,
                    label: body.label,
                    scheduledAt: parseScheduledAtInput(body.scheduledAt),
                    timezone: body.timezone || "Asia/Kolkata",
                    mode,
                    meetingLink: body.meetingLink.trim(),
                    interviewer: body.interviewer,
                    notes: body.notes,
                    createdBy: adminName,
                });

                if (body.sendInvite === true) {
                    await sendInterviewInviteEmail(app, interview, adminName);
                }

                await notifyStatusChangeTelegram(
                    app.name,
                    app.jobTitle,
                    app.status
                );
                await app.save();

                return NextResponse.json(
                    successResponse(app, "Interview scheduled")
                );
            }

            case "update_interview": {
                if (!body.interviewId) {
                    return NextResponse.json(
                        errorResponse("Interview ID required"),
                        { status: 400 }
                    );
                }

                const updates: Record<string, unknown> = {};
                if (body.round !== undefined) updates.round = body.round;
                if (body.label !== undefined) updates.label = body.label;
                if (body.scheduledAt)
                    updates.scheduledAt = parseScheduledAtInput(
                        body.scheduledAt
                    );
                if (body.timezone) updates.timezone = body.timezone;
                if (body.mode) {
                    if (!VALID_MODES.includes(body.mode)) {
                        return NextResponse.json(
                            errorResponse("Invalid interview mode"),
                            { status: 400 }
                        );
                    }
                    updates.mode = body.mode;
                }
                if (body.meetingLink !== undefined)
                    updates.meetingLink = body.meetingLink;
                if (body.interviewer !== undefined)
                    updates.interviewer = body.interviewer;
                if (body.notes !== undefined) updates.notes = body.notes;
                if (body.outcome) {
                    if (!VALID_OUTCOMES.includes(body.outcome)) {
                        return NextResponse.json(
                            errorResponse("Invalid interview outcome"),
                            { status: 400 }
                        );
                    }
                    updates.outcome = body.outcome;
                }

                const updated = updateInterviewRound(
                    app,
                    body.interviewId,
                    updates,
                    adminName
                );

                if (!updated) {
                    return NextResponse.json(
                        errorResponse("Interview not found"),
                        { status: 404 }
                    );
                }

                await app.save();
                return NextResponse.json(
                    successResponse(app, "Interview updated")
                );
            }

            case "reschedule_interview": {
                if (!body.interviewId || !body.scheduledAt) {
                    return NextResponse.json(
                        errorResponse(
                            "Interview ID and new date/time are required"
                        ),
                        { status: 400 }
                    );
                }

                const interview = app.interviews.find(
                    (i) => i.id === body.interviewId
                );
                if (!interview) {
                    return NextResponse.json(
                        errorResponse("Interview not found"),
                        { status: 404 }
                    );
                }

                const previousScheduledAt = new Date(interview.scheduledAt);
                const newScheduledAt = parseScheduledAtInput(body.scheduledAt);
                const meetingLink =
                    body.meetingLink !== undefined
                        ? String(body.meetingLink).trim()
                        : interview.meetingLink;

                if (!meetingLink) {
                    return NextResponse.json(
                        errorResponse("Meeting link is required"),
                        { status: 400 }
                    );
                }

                const timeUnchanged =
                    newScheduledAt.getTime() === previousScheduledAt.getTime();
                const linkUnchanged = meetingLink === interview.meetingLink;

                if (timeUnchanged && linkUnchanged) {
                    return NextResponse.json(
                        errorResponse("No changes to save"),
                        { status: 400 }
                    );
                }

                const updated = updateInterviewRound(
                    app,
                    body.interviewId,
                    {
                        scheduledAt: newScheduledAt,
                        meetingLink,
                        outcome: "scheduled",
                    },
                    adminName
                );

                if (!updated) {
                    return NextResponse.json(
                        errorResponse("Interview not found"),
                        { status: 404 }
                    );
                }

                if (body.sendNotify !== false) {
                    await sendInterviewRescheduleEmail(
                        app,
                        updated,
                        adminName,
                        previousScheduledAt
                    );
                }

                await app.save();
                return NextResponse.json(
                    successResponse(
                        app,
                        body.sendNotify !== false
                            ? "Interview rescheduled & candidate notified"
                            : "Interview rescheduled"
                    )
                );
            }

            case "send_interview_invite": {
                if (!body.interviewId) {
                    return NextResponse.json(
                        errorResponse("Interview ID required"),
                        { status: 400 }
                    );
                }

                const interview = app.interviews.find(
                    (i) => i.id === body.interviewId
                );
                if (!interview) {
                    return NextResponse.json(
                        errorResponse("Interview not found"),
                        { status: 404 }
                    );
                }

                await sendInterviewInviteEmail(app, interview, adminName);
                await app.save();

                return NextResponse.json(
                    successResponse(app, "Interview invite sent")
                );
            }

            case "send_email": {
                const templateId = body.templateId as EmailTemplateId;
                if (!templateId || !VALID_TEMPLATES.includes(templateId)) {
                    return NextResponse.json(
                        errorResponse("Invalid email template"),
                        { status: 400 }
                    );
                }

                if (
                    templateId === "custom" &&
                    !body.customBody?.trim()
                ) {
                    return NextResponse.json(
                        errorResponse("Custom email body is required"),
                        { status: 400 }
                    );
                }

                const interview = body.interviewId
                    ? app.interviews.find((i) => i.id === body.interviewId)
                    : app.interviews.at(-1);

                await sendTemplateEmail(app, templateId, adminName, {
                    customSubject: body.customSubject,
                    customBody: body.customBody,
                    contractUrl:
                        body.contractUrl || app.signIntegration?.contractUrl,
                    meetingLink: interview?.meetingLink,
                    scheduledAt: interview?.scheduledAt,
                    timezone: interview?.timezone,
                    interviewer: interview?.interviewer,
                });

                await app.save();
                return NextResponse.json(successResponse(app, "Email sent"));
            }

            case "link_contract": {
                if (!body.contractUrl?.trim()) {
                    return NextResponse.json(
                        errorResponse("Contract URL is required"),
                        { status: 400 }
                    );
                }

                updateSignIntegration(
                    app,
                    {
                        contractUrl: body.contractUrl.trim(),
                        signHiringUserId: body.signHiringUserId,
                        signContractId: body.signContractId,
                        signPrefillUrl: body.signPrefillUrl,
                        notes: body.notes,
                    },
                    adminName
                );

                if (body.moveToOffer === true && app.status !== "offer") {
                    appendStatusChange(app, "offer", adminName);
                    await notifyStatusChangeTelegram(
                        app.name,
                        app.jobTitle,
                        app.status
                    );
                }

                await app.save();
                return NextResponse.json(
                    successResponse(app, "Contract link saved")
                );
            }

            default:
                return NextResponse.json(
                    errorResponse("Unknown action"),
                    { status: 400 }
                );
        }
    } catch (err) {
        return NextResponse.json(
            errorResponse("Workflow action failed", err as Error),
            { status: 500 }
        );
    }
}
