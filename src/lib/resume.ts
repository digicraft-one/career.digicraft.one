import cloudinary from "@/lib/cloudinary";
import { randomUUID } from "crypto";

const RESUME_FOLDER = "digicraft-careers/resumes";

export function resumeUploadPublicId(): string {
    return `${randomUUID()}.pdf`;
}

export function resumeUploadFolder(): string {
    return RESUME_FOLDER;
}

export function sanitizeResumeFilename(applicantName: string): string {
    const base = applicantName
        .trim()
        .replace(/[^a-zA-Z0-9-_\s]+/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 60);
    return `${base || "Applicant"}-Resume.pdf`;
}

export function isPdfUpload(file: Blob, fileName?: string): boolean {
    const name = (fileName || "").toLowerCase();
    return (
        file.type === "application/pdf" ||
        file.type === "application/x-pdf" ||
        name.endsWith(".pdf")
    );
}

export function buildResumeViewUrl(publicId: string): string {
    return cloudinary.url(publicId, {
        resource_type: "raw",
        secure: true,
    });
}

export function buildResumeDownloadUrl(
    publicId: string,
    applicantName: string
): string {
    const filename = sanitizeResumeFilename(applicantName);
    return cloudinary.url(publicId, {
        resource_type: "raw",
        secure: true,
        flags: `attachment:${filename}`,
    });
}
