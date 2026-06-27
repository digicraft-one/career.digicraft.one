import { EmailTemplateId } from "@/types/schemas";
import { format } from "date-fns";

export interface EmailTemplateContext {
    name: string;
    jobTitle: string;
    meetingLink?: string;
    scheduledAt?: Date | string;
    timezone?: string;
    interviewer?: string;
    contractUrl?: string;
    customSubject?: string;
    customBody?: string;
}

function formatInterviewDateTime(
    scheduledAt?: Date | string,
    timezone?: string
): string {
    if (!scheduledAt) return "To be confirmed";
    const date = new Date(scheduledAt);
    if (Number.isNaN(date.getTime())) return "To be confirmed";
    const formatted = format(date, "EEEE, MMMM d, yyyy 'at' h:mm a");
    return timezone ? `${formatted} (${timezone})` : formatted;
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function paragraph(text: string): string {
    return `<p style="color:#5f6368;margin:0 0 12px;">${text}</p>`;
}

function heading(text: string): string {
    return `<h2 style="color:#202124;margin:0 0 12px;">${text}</h2>`;
}

function linkButton(href: string, label: string): string {
    return `<p style="margin:20px 0;"><a href="${escapeHtml(href)}" style="display:inline-block;background:#9333ea;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">${label}</a></p>`;
}

export function buildEmailContent(
    templateId: EmailTemplateId,
    ctx: EmailTemplateContext
): { subject: string; htmlContent: string } {
    const hi = paragraph(`Hi <strong>${escapeHtml(ctx.name)}</strong>,`);
    const role = paragraph(
        `Regarding your application for <strong>${escapeHtml(ctx.jobTitle)}</strong>:`
    );
    const signOff = paragraph(
        "Best regards,<br/>DigiCraft Hiring Team"
    );

    switch (templateId) {
        case "under_review":
            return {
                subject: `Application under review – ${ctx.jobTitle} | DigiCraft Careers`,
                htmlContent:
                    heading("We're reviewing your application") +
                    hi +
                    role +
                    paragraph(
                        "Our hiring team is currently reviewing your profile. We'll reach out with an update once we've completed our initial screening."
                    ) +
                    signOff,
            };

        case "shortlisted":
            return {
                subject: `You've been shortlisted – ${ctx.jobTitle} | DigiCraft Careers`,
                htmlContent:
                    heading("Great news — you're shortlisted!") +
                    hi +
                    role +
                    paragraph(
                        "Your application impressed us and you've been shortlisted for the next round. We'll be in touch with interview details shortly."
                    ) +
                    signOff,
            };

        case "interview_invite": {
            const when = formatInterviewDateTime(
                ctx.scheduledAt,
                ctx.timezone
            );
            const meetBlock = ctx.meetingLink
                ? linkButton(ctx.meetingLink, "Join meeting")
                : "";
            const interviewerLine = ctx.interviewer
                ? paragraph(
                      `Your interviewer: <strong>${escapeHtml(ctx.interviewer)}</strong>`
                  )
                : "";

            return {
                subject: `Interview invitation – ${ctx.jobTitle} | DigiCraft Careers`,
                htmlContent:
                    heading("You're invited for an interview") +
                    hi +
                    role +
                    paragraph(
                        `We'd like to schedule an interview with you on <strong>${escapeHtml(when)}</strong>.`
                    ) +
                    interviewerLine +
                    meetBlock +
                    paragraph(
                        "Please join a few minutes early and ensure a stable internet connection. Reply to this email if you need to reschedule."
                    ) +
                    signOff,
            };
        }

        case "interview_reminder": {
            const when = formatInterviewDateTime(
                ctx.scheduledAt,
                ctx.timezone
            );
            const meetBlock = ctx.meetingLink
                ? linkButton(ctx.meetingLink, "Join meeting")
                : "";

            return {
                subject: `Interview reminder – ${ctx.jobTitle} | DigiCraft Careers`,
                htmlContent:
                    heading("Reminder: upcoming interview") +
                    hi +
                    paragraph(
                        `This is a friendly reminder about your interview for <strong>${escapeHtml(ctx.jobTitle)}</strong> on <strong>${escapeHtml(when)}</strong>.`
                    ) +
                    meetBlock +
                    signOff,
            };
        }

        case "selected":
            return {
                subject: `Congratulations — selected for ${ctx.jobTitle} | DigiCraft Careers`,
                htmlContent:
                    heading("Congratulations!") +
                    hi +
                    role +
                    paragraph(
                        "We're excited to let you know that you've been selected for this role. Our team will reach out shortly with offer and onboarding details."
                    ) +
                    signOff,
            };

        case "offer": {
            const contractBlock = ctx.contractUrl
                ? linkButton(ctx.contractUrl, "View contract / offer")
                : paragraph(
                      "Our team will share your offer documents separately. Please watch your inbox."
                  );

            return {
                subject: `Offer for ${ctx.jobTitle} | DigiCraft Careers`,
                htmlContent:
                    heading("Your offer is ready") +
                    hi +
                    role +
                    paragraph(
                        "We're pleased to extend an offer for this position. Please review the details and complete any required steps at your earliest convenience."
                    ) +
                    contractBlock +
                    paragraph(
                        "If you have questions about the offer, reply to this email and we'll be happy to help."
                    ) +
                    signOff,
            };
        }

        case "hired":
            return {
                subject: `Welcome to DigiCraft – ${ctx.jobTitle} | DigiCraft Careers`,
                htmlContent:
                    heading("Welcome aboard!") +
                    hi +
                    paragraph(
                        `We're thrilled to confirm your joining for the <strong>${escapeHtml(ctx.jobTitle)}</strong> role at DigiCraft.`
                    ) +
                    paragraph(
                        "Our team will share onboarding details, start date, and next steps with you shortly."
                    ) +
                    signOff,
            };

        case "declined":
            return {
                subject: `Update on your application – ${ctx.jobTitle} | DigiCraft Careers`,
                htmlContent:
                    heading("Thank you for your interest") +
                    hi +
                    role +
                    paragraph(
                        "After careful consideration, we've decided to move forward with other candidates for this role. We encourage you to apply for future openings that match your skills."
                    ) +
                    signOff,
            };

        case "custom":
            return {
                subject:
                    ctx.customSubject?.trim() ||
                    `Update – ${ctx.jobTitle} | DigiCraft Careers`,
                htmlContent:
                    heading("Message from DigiCraft Hiring") +
                    hi +
                    paragraph(
                        ctx.customBody?.trim() ||
                            "Thank you for your continued interest in DigiCraft."
                    ) +
                    signOff,
            };

        default:
            return {
                subject: `Update – ${ctx.jobTitle} | DigiCraft Careers`,
                htmlContent: hi + role + signOff,
            };
    }
}

export function getDefaultTemplateForStatus(
    status: string
): EmailTemplateId | null {
    const map: Record<string, EmailTemplateId> = {
        under_review: "under_review",
        shortlisted: "shortlisted",
        interview: "interview_invite",
        selected: "selected",
        offer: "offer",
        hired: "hired",
        declined: "declined",
    };
    return map[status] ?? null;
}
