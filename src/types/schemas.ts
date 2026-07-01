export type EmploymentType =
    | "full-time"
    | "part-time"
    | "contract"
    | "internship";

export type ExperienceLevel = "junior" | "mid" | "senior" | "lead";

export type JobStatus = "draft" | "published" | "closed";

export type ApplicationStatus =
    | "pending"
    | "under_review"
    | "shortlisted"
    | "interview"
    | "selected"
    | "offer"
    | "hired"
    | "declined"
    | "withdrawn";

export type InterviewOutcome =
    | "scheduled"
    | "completed"
    | "no_show"
    | "cancelled"
    | "rescheduled";

export type InterviewMode =
    | "google_meet"
    | "zoom"
    | "phone"
    | "in_person"
    | "other";

export type ActivityType =
    | "application_received"
    | "status_change"
    | "note_added"
    | "email_sent"
    | "interview_scheduled"
    | "interview_updated"
    | "interview_invite_sent"
    | "sign_linked"
    | "contract_linked";

export type EmailTemplateId =
    | "under_review"
    | "shortlisted"
    | "interview_invite"
    | "interview_reschedule"
    | "interview_reminder"
    | "selected"
    | "offer"
    | "hired"
    | "declined"
    | "custom";

export interface Seo {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
}

export interface SalaryRange {
    min?: number;
    max?: number;
    currency: string;
    displayText: string;
}

export interface StatusHistoryEntry {
    status: ApplicationStatus;
    changedAt: Date;
    changedBy: string;
    note?: string;
    emailSent?: boolean;
    declineReason?: string;
}

export interface InterviewRound {
    id: string;
    round: number;
    label?: string;
    scheduledAt: Date;
    timezone: string;
    mode: InterviewMode;
    meetingLink: string;
    interviewer?: string;
    notes?: string;
    outcome: InterviewOutcome;
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
}

export interface ActivityEntry {
    type: ActivityType;
    at: Date;
    by: string;
    summary: string;
    meta?: Record<string, unknown>;
}

export interface CommunicationEntry {
    id: string;
    templateId: EmailTemplateId;
    subject: string;
    bodyHtml: string;
    sentAt: Date;
    sentBy: string;
    success: boolean;
    errorMessage?: string;
}

export interface SignIntegration {
    signHiringUserId?: string;
    signContractId?: string;
    contractUrl?: string;
    signPrefillUrl?: string;
    linkedAt?: Date;
    linkedBy?: string;
    notes?: string;
}
