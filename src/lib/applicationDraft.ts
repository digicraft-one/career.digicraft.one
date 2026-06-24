const STORAGE_KEY = "digicraft_career_application_draft";

/** Fields reused across job applications (cover letter stays blank per role). */
export interface SavedApplicationDraft {
    name: string;
    email: string;
    phone: string;
    location: string;
    experience: string;
    primarySkills: string;
    secondarySkills: string;
    github: string;
    linkedin: string;
    portfolio: string;
    canJoin: string;
}

const EMPTY_DRAFT: SavedApplicationDraft = {
    name: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    primarySkills: "",
    secondarySkills: "",
    github: "",
    linkedin: "",
    portfolio: "",
    canJoin: "",
};

export function loadApplicationDraft(): SavedApplicationDraft | null {
    if (typeof window === "undefined") return null;

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw) as Partial<SavedApplicationDraft>;
        const draft = { ...EMPTY_DRAFT, ...parsed };

        const hasData = Object.values(draft).some((v) => v.trim() !== "");
        return hasData ? draft : null;
    } catch {
        return null;
    }
}

export function saveApplicationDraft(draft: SavedApplicationDraft): void {
    if (typeof window === "undefined") return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
        // Storage full or disabled — ignore
    }
}

export function clearApplicationDraft(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
}

export function toSavedDraft(data: {
    name: string;
    email: string;
    phone: string;
    location: string;
    experience: string;
    primarySkills: string;
    secondarySkills: string;
    github: string;
    linkedin: string;
    portfolio: string;
    canJoin: string;
}): SavedApplicationDraft {
    return {
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        experience: data.experience,
        primarySkills: data.primarySkills,
        secondarySkills: data.secondarySkills,
        github: data.github,
        linkedin: data.linkedin,
        portfolio: data.portfolio,
        canJoin: data.canJoin,
    };
}
