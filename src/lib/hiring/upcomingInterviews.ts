import { Application } from "@/lib/types";
import { InterviewRound } from "@/types/schemas";

export interface UpcomingInterviewItem {
    applicationId: string;
    candidateName: string;
    email: string;
    phone: string;
    jobTitle: string;
    applicationStatus: Application["status"];
    interview: InterviewRound;
    scheduledAtMs: number;
}

function isUpcomingScheduled(interview: InterviewRound, nowMs: number): boolean {
    if (interview.outcome !== "scheduled") return false;
    const at = new Date(interview.scheduledAt).getTime();
    return !Number.isNaN(at) && at >= nowMs;
}

/**
 * If a candidate has multiple upcoming rounds, use the latest round number.
 */
export function pickLatestUpcomingInterview(
    interviews: InterviewRound[] | undefined,
    now: Date = new Date()
): InterviewRound | null {
    if (!interviews?.length) return null;

    const nowMs = now.getTime();
    const upcoming = interviews.filter((iv) =>
        isUpcomingScheduled(iv, nowMs)
    );
    if (!upcoming.length) return null;

    return upcoming.reduce((best, iv) => {
        if (iv.round > best.round) return iv;
        if (iv.round < best.round) return best;
        const ivMs = new Date(iv.scheduledAt).getTime();
        const bestMs = new Date(best.scheduledAt).getTime();
        return ivMs >= bestMs ? iv : best;
    });
}

export function collectUpcomingInterviews(
    applications: Application[],
    now: Date = new Date()
): UpcomingInterviewItem[] {
    const items: UpcomingInterviewItem[] = [];

    for (const app of applications) {
        const interview = pickLatestUpcomingInterview(app.interviews, now);
        if (!interview) continue;

        const scheduledAtMs = new Date(interview.scheduledAt).getTime();
        if (Number.isNaN(scheduledAtMs)) continue;

        items.push({
            applicationId: app._id,
            candidateName: app.name,
            email: app.email,
            phone: app.phone,
            jobTitle: app.jobTitle,
            applicationStatus: app.status,
            interview,
            scheduledAtMs,
        });
    }

    return items.sort((a, b) => a.scheduledAtMs - b.scheduledAtMs);
}

export function isInterviewToday(
    scheduledAtMs: number,
    now: Date = new Date()
): boolean {
    const fmt = (d: Date) =>
        new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(d);

    return fmt(new Date(scheduledAtMs)) === fmt(now);
}

export function isInterviewTomorrow(
    scheduledAtMs: number,
    now: Date = new Date()
): boolean {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return isInterviewToday(scheduledAtMs, tomorrow);
}
