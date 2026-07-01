/** DigiCraft operates in India — all user-facing times use IST. */
export const IST_TIMEZONE = "Asia/Kolkata";
export const IST_LABEL = "IST";

function toDate(date: Date | string): Date {
    return typeof date === "string" ? new Date(date) : date;
}

function isValid(date: Date): boolean {
    return !Number.isNaN(date.getTime());
}

/**
 * Format any instant in Indian Standard Time.
 */
export function formatInIST(
    date: Date | string,
    options: Intl.DateTimeFormatOptions
): string {
    const d = toDate(date);
    if (!isValid(d)) return "—";
    return new Intl.DateTimeFormat("en-IN", {
        timeZone: IST_TIMEZONE,
        ...options,
    }).format(d);
}

/** e.g. Sunday, 5 July 2026, 1:00 pm IST */
export function formatISTDateTime(date: Date | string): string {
    return (
        formatInIST(date, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }) + ` ${IST_LABEL}`
    );
}

/** e.g. 5 Jul 2026, 1:00 pm IST — for admin cards */
export function formatISTShort(date: Date | string): string {
    return (
        formatInIST(date, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }) + ` ${IST_LABEL}`
    );
}

/** e.g. 5 Jul 2026, 1:00:48 pm IST — for Telegram */
export function formatISTNow(date: Date = new Date()): string {
    return (
        formatInIST(date, {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        }) + ` ${IST_LABEL}`
    );
}

/** e.g. 5 Jul 2026, 1:00 pm */
export function formatISTCompact(date: Date | string): string {
    return formatInIST(date, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

/**
 * Parse `<input type="datetime-local">` value as IST (not browser timezone).
 * Accepts `YYYY-MM-DDTHH:mm` or full ISO with offset/Z.
 */
export function parseISTDateTimeLocal(value: string): Date {
    const trimmed = value.trim();
    if (!trimmed) throw new Error("Empty datetime");

    if (
        trimmed.endsWith("Z") ||
        /[+-]\d{2}:\d{2}$/.test(trimmed)
    ) {
        return new Date(trimmed);
    }

    const match = trimmed.match(
        /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::(\d{2}))?$/
    );
    if (!match) throw new Error("Invalid datetime format");

    const seconds = match[3] ?? "00";
    return new Date(`${match[1]}T${match[2]}:${seconds}+05:30`);
}

/** Convert stored UTC Date → value for datetime-local input in IST */
export function toISTDateTimeLocalValue(date: Date | string): string {
    const d = toDate(date);
    if (!isValid(d)) return "";

    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: IST_TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).formatToParts(d);

    const get = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((p) => p.type === type)?.value ?? "";

    return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export function parseScheduledAtInput(value: string): Date {
    if (
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value) &&
        !value.endsWith("Z") &&
        !/[+-]\d{2}:\d{2}$/.test(value)
    ) {
        return parseISTDateTimeLocal(value);
    }
    return new Date(value);
}
