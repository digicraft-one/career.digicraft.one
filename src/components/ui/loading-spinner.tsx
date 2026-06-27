import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    className?: string;
    label?: string;
}

export function LoadingSpinner({ className, label }: LoadingSpinnerProps) {
    return (
        <span className="inline-flex items-center gap-2">
            <Loader2
                className={cn("h-4 w-4 animate-spin text-current", className)}
                aria-hidden
            />
            {label ? <span>{label}</span> : null}
        </span>
    );
}

interface LoadingOverlayProps {
    show: boolean;
    message?: string;
}

export function LoadingOverlay({ show, message }: LoadingOverlayProps) {
    if (!show) return null;

    return (
        <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-xl bg-white/80 backdrop-blur-[2px]"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            {message ? (
                <p className="text-sm font-medium text-slate-700">{message}</p>
            ) : null}
        </div>
    );
}

export function isLoadingAction(
    current: string | null | undefined,
    action: string | string[]
): boolean {
    if (!current) return false;
    const actions = Array.isArray(action) ? action : [action];
    return actions.some(
        (a) => current === a || current.startsWith(`${a}:`)
    );
}

export const LOADING_MESSAGES: Record<string, string> = {
    save: "Saving changes…",
    save_notify: "Saving & sending email…",
    delete: "Deleting application…",
    schedule: "Scheduling interview…",
    schedule_invite: "Scheduling & sending invite…",
    send_email: "Sending email…",
    link_contract: "Saving contract link…",
    send_interview_invite: "Sending interview invite…",
    update_interview: "Updating interview…",
};

export function getLoadingMessage(action: string | null): string {
    if (!action) return "Working…";
    const base = action.split(":")[0];
    return LOADING_MESSAGES[base] ?? LOADING_MESSAGES[action] ?? "Working…";
}
