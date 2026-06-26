import { Application } from "@/lib/types";

const DEFAULT_SIGN_URL = "https://sign.digicraft.one";

export function getSignBaseUrl(): string {
    return (
        process.env.NEXT_PUBLIC_SIGN_URL?.replace(/\/$/, "") ||
        DEFAULT_SIGN_URL
    );
}

function buildHiringNotes(app: Application): string {
    const lines = [
        "Imported from DigiCraft Careers",
        `Application ID: ${app._id}`,
        `Role: ${app.jobTitle}`,
        `Experience: ${app.experience}`,
        `Location: ${app.location}`,
        `Primary skills: ${app.primarySkills}`,
    ];

    if (app.secondarySkills?.trim()) {
        lines.push(`Secondary skills: ${app.secondarySkills}`);
    }
    if (app.canJoin?.trim()) {
        lines.push(`Can join: ${app.canJoin}`);
    }
    if (app.linkedin?.trim()) {
        lines.push(`LinkedIn: ${app.linkedin}`);
    }
    if (app.github?.trim()) {
        lines.push(`GitHub: ${app.github}`);
    }
    if (app.portfolio?.trim()) {
        lines.push(`Portfolio: ${app.portfolio}`);
    }

    return lines.join("\n").slice(0, 1800);
}

/** Opens DigiCraft Sign → new hiring user with applicant details pre-filled */
export function buildSignHiringUserUrl(app: Application): string {
    const params = new URLSearchParams({
        source: "career",
        applicationId: app._id,
        name: app.name,
        email: app.email,
        phone: app.phone,
        notes: buildHiringNotes(app),
    });

    if (app.location?.trim()) {
        params.set("city", app.location.trim());
    }

    return `${getSignBaseUrl()}/admin/hiring-users/new?${params.toString()}`;
}
