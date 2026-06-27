import { ApplicationStatus, EmailTemplateId, InterviewMode } from "@/types/schemas";

export const PIPELINE_STATUSES: ApplicationStatus[] = [
    "pending",
    "under_review",
    "shortlisted",
    "interview",
    "selected",
    "offer",
    "hired",
];

export const TERMINAL_STATUSES: ApplicationStatus[] = ["declined", "withdrawn"];

export const ALL_APPLICATION_STATUSES: ApplicationStatus[] = [
    ...PIPELINE_STATUSES,
    ...TERMINAL_STATUSES,
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
    pending: "Pending",
    under_review: "Under review",
    shortlisted: "Shortlisted",
    interview: "Interview",
    selected: "Selected",
    offer: "Offer sent",
    hired: "Hired",
    declined: "Declined",
    withdrawn: "Withdrawn",
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    under_review: "bg-amber-100 text-amber-800",
    shortlisted: "bg-blue-100 text-blue-800",
    interview: "bg-indigo-100 text-indigo-800",
    selected: "bg-emerald-100 text-emerald-800",
    offer: "bg-purple-100 text-purple-800",
    hired: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
    withdrawn: "bg-slate-100 text-slate-700",
};

export const INTERVIEW_MODE_LABELS: Record<InterviewMode, string> = {
    google_meet: "Google Meet",
    zoom: "Zoom",
    phone: "Phone",
    in_person: "In person",
    other: "Other",
};

export const EMAIL_TEMPLATE_OPTIONS: {
    id: EmailTemplateId;
    label: string;
    description: string;
}[] = [
    {
        id: "under_review",
        label: "Under review",
        description: "Let candidate know their application is being reviewed",
    },
    {
        id: "shortlisted",
        label: "Shortlisted",
        description: "Candidate passed initial screening",
    },
    {
        id: "interview_invite",
        label: "Interview invitation",
        description: "Send date, time, and meeting link",
    },
    {
        id: "interview_reminder",
        label: "Interview reminder",
        description: "Reminder before scheduled interview",
    },
    {
        id: "selected",
        label: "Selected",
        description: "Candidate cleared interviews",
    },
    {
        id: "offer",
        label: "Offer / contract",
        description: "Send manual contract or Sign link",
    },
    {
        id: "hired",
        label: "Welcome / hired",
        description: "Onboarding welcome message",
    },
    {
        id: "declined",
        label: "Declined",
        description: "Polite rejection",
    },
    {
        id: "custom",
        label: "Custom message",
        description: "Write your own subject and body",
    },
];

export const DEFAULT_TIMEZONE = "Asia/Kolkata";

export function getStatusLabel(status: ApplicationStatus): string {
    return STATUS_LABELS[status] ?? status;
}

export function getPipelineIndex(status: ApplicationStatus): number {
    const idx = PIPELINE_STATUSES.indexOf(status);
    if (idx >= 0) return idx;
    if (status === "declined" || status === "withdrawn") return -1;
    return 0;
}
