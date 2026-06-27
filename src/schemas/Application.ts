import {
    ActivityEntry,
    ApplicationStatus,
    CommunicationEntry,
    ExperienceLevel,
    InterviewRound,
    SignIntegration,
    StatusHistoryEntry,
} from "@/types/schemas";
import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface ApplicationDocument extends Document {
    jobId: Types.ObjectId;
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
    createdAt: Date;
    updatedAt: Date;
}

const APPLICATION_STATUSES: ApplicationStatus[] = [
    "pending",
    "under_review",
    "shortlisted",
    "interview",
    "selected",
    "offer",
    "hired",
    "declined",
    "withdrawn",
];

const ResumeSchema = new Schema(
    {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
    },
    { _id: false }
);

const StatusHistorySchema = new Schema<StatusHistoryEntry>(
    {
        status: { type: String, enum: APPLICATION_STATUSES, required: true },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: String, default: "Admin" },
        note: { type: String },
        emailSent: { type: Boolean, default: false },
        declineReason: { type: String },
    },
    { _id: false }
);

const ActivitySchema = new Schema<ActivityEntry>(
    {
        type: { type: String, required: true },
        at: { type: Date, default: Date.now },
        by: { type: String, default: "Admin" },
        summary: { type: String, required: true },
        meta: { type: Schema.Types.Mixed },
    },
    { _id: false }
);

const CommunicationSchema = new Schema<CommunicationEntry>(
    {
        id: { type: String, required: true },
        templateId: { type: String, required: true },
        subject: { type: String, required: true },
        bodyHtml: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        sentBy: { type: String, default: "Admin" },
        success: { type: Boolean, default: true },
        errorMessage: { type: String },
    },
    { _id: false }
);

const InterviewSchema = new Schema<InterviewRound>(
    {
        id: { type: String, required: true },
        round: { type: Number, required: true },
        label: { type: String },
        scheduledAt: { type: Date, required: true },
        timezone: { type: String, default: "Asia/Kolkata" },
        mode: {
            type: String,
            enum: ["google_meet", "zoom", "phone", "in_person", "other"],
            default: "google_meet",
        },
        meetingLink: { type: String, default: "" },
        interviewer: { type: String },
        notes: { type: String },
        outcome: {
            type: String,
            enum: ["scheduled", "completed", "no_show", "cancelled", "rescheduled"],
            default: "scheduled",
        },
        createdAt: { type: Date, default: Date.now },
        createdBy: { type: String, default: "Admin" },
        updatedAt: { type: Date },
    },
    { _id: false }
);

const SignIntegrationSchema = new Schema<SignIntegration>(
    {
        signHiringUserId: { type: String },
        signContractId: { type: String },
        contractUrl: { type: String },
        signPrefillUrl: { type: String },
        linkedAt: { type: Date },
        linkedBy: { type: String },
        notes: { type: String },
    },
    { _id: false }
);

const ApplicationSchema = new Schema<ApplicationDocument>(
    {
        jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
        jobTitle: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        location: { type: String, required: true },
        experience: {
            type: String,
            enum: ["junior", "mid", "senior", "lead"],
            required: true,
        },
        primarySkills: { type: String, required: true },
        secondarySkills: { type: String, default: "" },
        github: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        portfolio: { type: String, default: "" },
        resume: { type: ResumeSchema, required: true },
        canJoin: { type: String, required: true },
        coverLetter: { type: String, required: true },
        notes: [{ type: String, default: "" }],
        status: {
            type: String,
            enum: APPLICATION_STATUSES,
            default: "pending",
        },
        statusHistory: { type: [StatusHistorySchema], default: [] },
        activities: { type: [ActivitySchema], default: [] },
        communications: { type: [CommunicationSchema], default: [] },
        interviews: { type: [InterviewSchema], default: [] },
        signIntegration: { type: SignIntegrationSchema, default: {} },
        declineReason: { type: String },
    },
    { timestamps: true }
);

export const Application: Model<ApplicationDocument> =
    models.Application ||
    model<ApplicationDocument>("Application", ApplicationSchema);

export { APPLICATION_STATUSES };
