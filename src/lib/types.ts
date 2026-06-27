import {
    ActivityEntry,
    ApplicationStatus,
    CommunicationEntry,
    EmploymentType,
    ExperienceLevel,
    InterviewRound,
    JobStatus,
    SalaryRange,
    Seo,
    SignIntegration,
    StatusHistoryEntry,
} from "@/types/schemas";

export interface Job {
    _id: string;
    title: string;
    department: string;
    location: string;
    employmentType: EmploymentType;
    experienceLevel: ExperienceLevel;
    description: string;
    responsibilities: string[];
    requirements: string[];
    niceToHave: string[];
    salaryRange: SalaryRange;
    status: JobStatus;
    seo: Seo;
    publishedAt?: string;
    applicationDeadline?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Application {
    _id: string;
    jobId: string;
    jobTitle: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    experience: ExperienceLevel;
    primarySkills: string;
    secondarySkills: string;
    github: string;
    linkedin: string;
    portfolio: string;
    resume: { url: string; publicId: string };
    canJoin: string;
    coverLetter: string;
    notes: string[];
    status: ApplicationStatus;
    statusHistory: StatusHistoryEntry[];
    activities: ActivityEntry[];
    communications: CommunicationEntry[];
    interviews: InterviewRound[];
    signIntegration: SignIntegration;
    declineReason?: string;
    createdAt: string;
    updatedAt: string;
}

export type { ApplicationStatus, EmploymentType, ExperienceLevel, JobStatus };
