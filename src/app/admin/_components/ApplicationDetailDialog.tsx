"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
    ALL_APPLICATION_STATUSES,
    STATUS_COLORS,
    STATUS_LABELS,
} from "@/lib/hiring/constants";
import { Application, ApplicationStatus } from "@/lib/types";
import { EmailTemplateId, InterviewMode } from "@/types/schemas";
import { format, formatDistanceToNow } from "date-fns";
import {
    Briefcase,
    ChevronDown,
    Download,
    ExternalLink,
    Github,
    Globe,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Trash2,
    X,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import ApplicationQuickActions from "./ApplicationQuickActions";
import ApplicationTimeline from "./ApplicationTimeline";
import ExpandableText from "./ExpandableText";

const EXPERIENCE_LABELS: Record<string, string> = {
    junior: "Junior",
    mid: "Mid-level",
    senior: "Senior",
    lead: "Lead",
};

interface ApplicationDetailDialogProps {
    open: boolean;
    onClose: () => void;
    app: Application | null;
    formState: {
        status: ApplicationStatus;
        notes: string[];
        newNote: string;
        declineReason: string;
        notifyEmail: boolean;
    };
    onStatusChange: (status: ApplicationStatus) => void;
    onDeclineReasonChange: (value: string) => void;
    onNotifyEmailChange: (value: boolean) => void;
    onNewNoteChange: (value: string) => void;
    onAddNote: () => void;
    onSave: (sendEmail: boolean) => void;
    onDelete: () => void | Promise<void>;
    onScheduleInterview: (data: {
        round: number;
        scheduledAt: string;
        timezone: string;
        mode: InterviewMode;
        meetingLink: string;
        interviewer: string;
        notes: string;
        sendInvite: boolean;
    }) => Promise<void>;
    onSendInterviewInvite: (interviewId: string) => Promise<void>;
    onSendEmail: (data: {
        templateId: EmailTemplateId;
        customBody?: string;
    }) => Promise<void>;
    onSaveContract: (data: {
        contractUrl: string;
        moveToOffer: boolean;
    }) => Promise<void>;
    loading?: boolean;
}

export default function ApplicationDetailDialog({
    open,
    onClose,
    app,
    formState,
    onStatusChange,
    onDeclineReasonChange,
    onNotifyEmailChange,
    onNewNoteChange,
    onAddNote,
    onSave,
    onDelete,
    onScheduleInterview,
    onSendInterviewInvite,
    onSendEmail,
    onSaveContract,
    loading = false,
}: ApplicationDetailDialogProps) {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [activityOpen, setActivityOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) onClose();
        };
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose, loading]);

    useEffect(() => {
        if (open) {
            setDetailsOpen(false);
            setActivityOpen(false);
        }
    }, [open, app?._id]);

    if (!open || !app || typeof document === "undefined") return null;

    const emailCount = app.communications?.length ?? 0;
    const activityCount =
        (app.activities?.length ?? 0) + emailCount;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <button
                type="button"
                className="absolute inset-0 bg-black/50"
                onClick={() => {
                    if (!loading) onClose();
                }}
                aria-label="Close dialog"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="application-detail-title"
                aria-busy={loading}
                className="relative z-10 flex w-full max-w-2xl max-h-[92vh] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 shrink-0">
                    <div className="min-w-0">
                        <h2
                            id="application-detail-title"
                            className="text-lg font-semibold text-slate-900 truncate"
                        >
                            {app.name}
                        </h2>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Briefcase className="w-3.5 h-3.5 shrink-0" />
                            {app.jobTitle}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
                            <Badge
                                className={
                                    STATUS_COLORS[formState.status] ??
                                    "bg-slate-100"
                                }
                            >
                                {STATUS_LABELS[formState.status]}
                            </Badge>
                            <span>
                                Applied{" "}
                                {formatDistanceToNow(
                                    new Date(app.createdAt),
                                    { addSuffix: true }
                                )}
                            </span>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        disabled={loading}
                        onClick={onClose}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
                    {/* Contact strip */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                        <a
                            href={`mailto:${app.email}`}
                            className="inline-flex items-center gap-1 hover:text-purple-600"
                        >
                            <Mail className="w-3.5 h-3.5" />
                            {app.email}
                        </a>
                        <span className="inline-flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {app.phone}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {app.location}
                        </span>
                    </div>

                    {app.resume?.publicId && (
                        <div className="flex gap-3 text-sm">
                            <a
                                href={`/api/applications/${app._id}/resume?view=1`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:underline inline-flex items-center gap-1"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                View resume
                            </a>
                            <a
                                href={`/api/applications/${app._id}/resume`}
                                download
                                className="text-purple-600 hover:underline inline-flex items-center gap-1"
                            >
                                <Download className="w-3.5 h-3.5" />
                                Download
                            </a>
                        </div>
                    )}

                    {/* Primary action */}
                    <div className="rounded-lg border border-purple-100 bg-purple-50/40 p-4 space-y-3">
                        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                            Update status
                        </p>
                        <Select
                            value={formState.status}
                            disabled={loading}
                            onValueChange={(v) =>
                                onStatusChange(v as ApplicationStatus)
                            }
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ALL_APPLICATION_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {STATUS_LABELS[status]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {formState.status === "declined" && (
                            <Textarea
                                value={formState.declineReason}
                                disabled={loading}
                                onChange={(e) =>
                                    onDeclineReasonChange(e.target.value)
                                }
                                rows={2}
                                className="bg-white text-sm"
                                placeholder="Internal reason (not emailed)"
                            />
                        )}

                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input
                                type="checkbox"
                                checked={formState.notifyEmail}
                                disabled={loading}
                                onChange={(e) =>
                                    onNotifyEmailChange(e.target.checked)
                                }
                                className="rounded border-slate-300"
                            />
                            Email candidate about this update
                        </label>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                className="flex-1 bg-purple-600 hover:bg-purple-700"
                                disabled={loading}
                                onClick={() =>
                                    onSave(formState.notifyEmail)
                                }
                            >
                                {loading ? (
                                    <LoadingSpinner label="Updating…" />
                                ) : (
                                    "Update"
                                )}
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={loading}
                                        className="text-red-600 bg-white"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Delete application?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This permanently removes{" "}
                                            {app.name}&apos;s application.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                await onDelete();
                                            }}
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>

                    {/* Quick tools */}
                    <ApplicationQuickActions
                        app={app}
                        loading={loading}
                        onScheduleInterview={onScheduleInterview}
                        onSendInterviewInvite={onSendInterviewInvite}
                        onSaveContract={onSaveContract}
                        onSendEmail={onSendEmail}
                    />

                    {/* Notes */}
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-500">
                            Notes
                        </p>
                        {formState.notes?.length > 0 ? (
                            <ul className="space-y-1">
                                {formState.notes.map((note, i) => (
                                    <li
                                        key={i}
                                        className="text-xs bg-slate-50 rounded px-2 py-1.5 text-slate-700"
                                    >
                                        {note}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-slate-400">No notes</p>
                        )}
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a note…"
                                value={formState.newNote}
                                disabled={loading}
                                onChange={(e) =>
                                    onNewNoteChange(e.target.value)
                                }
                                className="bg-white h-9 text-sm"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={loading}
                                onClick={onAddNote}
                                className="bg-white shrink-0"
                            >
                                Add
                            </Button>
                        </div>
                    </div>

                    {/* Applicant details — collapsed by default */}
                    <CollapsibleBlock
                        title="Application details"
                        open={detailsOpen}
                        onToggle={() => setDetailsOpen((v) => !v)}
                    >
                        <div className="space-y-3 pt-2 text-sm">
                            <p className="text-slate-600">
                                <span className="text-slate-500">
                                    Experience:{" "}
                                </span>
                                {EXPERIENCE_LABELS[app.experience] ||
                                    app.experience}
                                {" · "}
                                <span className="text-slate-500">
                                    Can join:{" "}
                                </span>
                                {app.canJoin}
                            </p>
                            <ExpandableText
                                label="Skills"
                                text={`${app.primarySkills}${app.secondarySkills ? `\n${app.secondarySkills}` : ""}`}
                            />
                            <ExpandableText
                                label="Cover letter"
                                text={app.coverLetter}
                                collapsedLines={4}
                            />
                            <div className="flex flex-wrap gap-3">
                                {app.github?.trim() && (
                                    <a
                                        href={app.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-600 hover:underline inline-flex items-center gap-1 text-xs"
                                    >
                                        <Github className="w-3.5 h-3.5" />
                                        GitHub
                                    </a>
                                )}
                                {app.linkedin?.trim() && (
                                    <a
                                        href={app.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-600 hover:underline inline-flex items-center gap-1 text-xs"
                                    >
                                        <Linkedin className="w-3.5 h-3.5" />
                                        LinkedIn
                                    </a>
                                )}
                                {app.portfolio?.trim() && (
                                    <a
                                        href={app.portfolio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-600 hover:underline inline-flex items-center gap-1 text-xs"
                                    >
                                        <Globe className="w-3.5 h-3.5" />
                                        Portfolio
                                    </a>
                                )}
                            </div>
                        </div>
                    </CollapsibleBlock>

                    {/* Activity log — collapsed by default */}
                    <CollapsibleBlock
                        title={`Activity (${activityCount})`}
                        open={activityOpen}
                        onToggle={() => setActivityOpen((v) => !v)}
                    >
                        <div className="pt-2 space-y-3">
                            {emailCount > 0 && (
                                <div className="space-y-1">
                                    <p className="text-[10px] font-medium text-slate-400 uppercase">
                                        Emails sent
                                    </p>
                                    {[...(app.communications || [])]
                                        .sort(
                                            (a, b) =>
                                                new Date(b.sentAt).getTime() -
                                                new Date(a.sentAt).getTime()
                                        )
                                        .map((email) => (
                                            <p
                                                key={email.id}
                                                className="text-xs text-slate-600"
                                            >
                                                {format(
                                                    new Date(email.sentAt),
                                                    "MMM d"
                                                )}{" "}
                                                · {email.subject}
                                                {!email.success && (
                                                    <span className="text-red-500">
                                                        {" "}
                                                        (failed)
                                                    </span>
                                                )}
                                            </p>
                                        ))}
                                </div>
                            )}
                            <ApplicationTimeline app={app} />
                        </div>
                    </CollapsibleBlock>
                </div>
            </div>
        </div>,
        document.body
    );
}

function CollapsibleBlock({
    title,
    open,
    onToggle,
    children,
}: {
    title: string;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="border-t border-slate-100 pt-3">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between text-sm font-medium text-slate-700 hover:text-slate-900"
            >
                {title}
                <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && children}
        </div>
    );
}
