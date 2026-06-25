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

function uniqueUrls(urls: Array<string | undefined | null>): string[] {
    return [...new Set(urls.filter(Boolean) as string[])];
}

export async function fetchResumeBuffer(resume: {
    url: string;
    publicId: string;
}): Promise<Buffer | null> {
    const { publicId, url } = resume;
    const candidates = uniqueUrls([
        url,
        buildResumeViewUrl(publicId),
        publicId.endsWith(".pdf")
            ? undefined
            : buildResumeViewUrl(`${publicId}.pdf`),
    ]);

    for (const candidate of candidates) {
        try {
            const res = await fetch(candidate, { cache: "no-store" });
            if (!res.ok) continue;
            return Buffer.from(await res.arrayBuffer());
        } catch {
            continue;
        }
    }

    return null;
}

export function buildContentDisposition(
    filename: string,
    inline: boolean
): string {
    const safe =
        filename.replace(/[^\w\s.-]/g, "").trim() || "Resume.pdf";
    const disposition = inline ? "inline" : "attachment";
    const encoded = encodeURIComponent(safe);
    return `${disposition}; filename="${safe}"; filename*=UTF-8''${encoded}`;
}

export function adminResumeUrl(applicationId: string, view = false): string {
    const base = `/api/applications/${applicationId}/resume`;
    return view ? `${base}?view=1` : base;
}
