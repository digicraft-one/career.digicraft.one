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
import { buildSignHiringUserUrl } from "@/lib/signIntegration";
import { Application, ApplicationStatus } from "@/lib/types";
import { format, formatDistanceToNow } from "date-fns";
import {
    Briefcase,
    Calendar,
    Download,
    ExternalLink,
    Github,
    Globe,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    PenLine,
    Save,
    Trash2,
    X,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import ExpandableText from "./ExpandableText";

const STATUS_COLORS: Record<ApplicationStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    shortlisted: "bg-blue-100 text-blue-800",
    selected: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
};

const EXPERIENCE_LABELS: Record<string, string> = {
    junior: "Junior",
    mid: "Mid-level",
    senior: "Senior",
    lead: "Lead",
};

function DetailItem({
    label,
    value,
    icon,
}: {
    label: string;
    value?: string;
    icon?: React.ReactNode;
}) {
    const display = value?.trim();
    return (
        <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 mb-0.5">{label}</p>
            <div className="flex items-start gap-1.5 text-sm text-slate-700 break-words">
                {icon && (
                    <span className="shrink-0 text-slate-400 mt-0.5">{icon}</span>
                )}
                <span>{display || "—"}</span>
            </div>
        </div>
    );
}

function ExternalLinkItem({
    label,
    href,
    icon,
}: {
    label: string;
    href?: string;
    icon: React.ReactNode;
}) {
    const url = href?.trim();
    if (!url) return null;

    return (
        <a
            href={url.startsWith("http") ? url : `https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-purple-600 hover:underline break-all"
        >
            {icon}
            {label}
            <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
    );
}

interface ApplicationDetailDialogProps {
    open: boolean;
    onClose: () => void;
    app: Application | null;
    formState: {
        status: ApplicationStatus;
        notes: string[];
        newNote: string;
    };
    onStatusChange: (status: ApplicationStatus) => void;
    onNewNoteChange: (value: string) => void;
    onAddNote: () => void;
    onSave: () => void;
    onDelete: () => void;
}

export default function ApplicationDetailDialog({
    open,
    onClose,
    app,
    formState,
    onStatusChange,
    onNewNoteChange,
    onAddNote,
    onSave,
    onDelete,
}: ApplicationDetailDialogProps) {
    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    if (!open || !app || typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <button
                type="button"
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-label="Close dialog"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="application-detail-title"
                className="relative z-10 flex w-full max-w-3xl max-h-[92vh] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
            >
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
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Badge
                            className={`capitalize ${STATUS_COLORS[app.status]}`}
                        >
                            {app.status}
                        </Badge>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={onClose}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Applied{" "}
                        {formatDistanceToNow(new Date(app.createdAt), {
                            addSuffix: true,
                        })}
                        {" · "}
                        {format(new Date(app.createdAt), "PPp")}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailItem
                            label="Email"
                            value={app.email}
                            icon={<Mail className="w-4 h-4" />}
                        />
                        <DetailItem
                            label="Phone"
                            value={app.phone}
                            icon={<Phone className="w-4 h-4" />}
                        />
                        <DetailItem
                            label="Location"
                            value={app.location}
                            icon={<MapPin className="w-4 h-4" />}
                        />
                        <DetailItem
                            label="Experience"
                            value={
                                EXPERIENCE_LABELS[app.experience] ||
                                app.experience
                            }
                        />
                        <DetailItem label="Can join" value={app.canJoin} />
                        <DetailItem
                            label="Last updated"
                            value={format(new Date(app.updatedAt), "PPp")}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <ExpandableText
                            label="Primary skills"
                            text={app.primarySkills}
                        />
                        <ExpandableText
                            label="Secondary skills"
                            text={app.secondarySkills}
                        />
                        <ExpandableText
                            label="Cover letter"
                            text={app.coverLetter}
                            collapsedLines={6}
                            minCharsToCollapse={200}
                        />
                    </div>

                    {(app.github?.trim() ||
                        app.linkedin?.trim() ||
                        app.portfolio?.trim()) && (
                        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 border-t border-slate-100">
                            <ExternalLinkItem
                                label="GitHub"
                                href={app.github}
                                icon={<Github className="w-4 h-4" />}
                            />
                            <ExternalLinkItem
                                label="LinkedIn"
                                href={app.linkedin}
                                icon={<Linkedin className="w-4 h-4" />}
                            />
                            <ExternalLinkItem
                                label="Portfolio"
                                href={app.portfolio}
                                icon={<Globe className="w-4 h-4" />}
                            />
                        </div>
                    )}

                    {app.resume?.publicId && (
                        <div className="flex flex-wrap gap-4">
                            <a
                                href={`/api/applications/${app._id}/resume?view=1`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-purple-600 hover:underline"
                            >
                                <ExternalLink className="w-4 h-4" />
                                View Resume
                            </a>
                            <a
                                href={`/api/applications/${app._id}/resume`}
                                download={`${app.name.replace(/[^\w\s-]/g, "").trim() || "Applicant"}-Resume.pdf`}
                                className="inline-flex items-center gap-2 text-sm text-purple-600 hover:underline"
                            >
                                <Download className="w-4 h-4" />
                                Download PDF
                            </a>
                        </div>
                    )}

                    <div className="border-t border-slate-100 pt-4">
                        <p className="text-xs font-medium text-slate-500 mb-2">
                            DigiCraft Sign
                        </p>
                        <a
                            href={buildSignHiringUserUrl(app)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto border-purple-200 text-purple-700 hover:bg-purple-50"
                            >
                                <PenLine className="w-4 h-4 mr-2" />
                                Add to DigiCraft Sign
                            </Button>
                        </a>
                        <p className="text-[11px] text-slate-400 mt-1.5">
                            Opens Sign admin with this applicant pre-filled as a
                            hiring user
                        </p>
                    </div>

                    {app.statusHistory?.length > 0 && (
                        <div className="space-y-2 border-t border-slate-100 pt-4">
                            <p className="text-xs font-medium text-slate-500">
                                Status history
                            </p>
                            <ul className="space-y-2">
                                {app.statusHistory.map((entry, i) => (
                                    <li
                                        key={i}
                                        className="text-xs bg-slate-50 rounded-md px-3 py-2 flex flex-wrap items-center gap-x-2 gap-y-1"
                                    >
                                        <Badge
                                            variant="outline"
                                            className="capitalize text-[10px]"
                                        >
                                            {entry.status}
                                        </Badge>
                                        <span className="text-slate-500">
                                            {format(
                                                new Date(entry.changedAt),
                                                "PPp"
                                            )}
                                        </span>
                                        {entry.changedBy && (
                                            <span className="text-slate-400">
                                                by {entry.changedBy}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="space-y-2 border-t border-slate-100 pt-4">
                        <p className="text-xs font-medium text-slate-500">
                            Admin notes
                        </p>
                        {formState.notes?.length > 0 ? (
                            formState.notes.map((note, i) => (
                                <p
                                    key={i}
                                    className="text-xs bg-slate-50 p-2 rounded whitespace-pre-wrap break-words"
                                >
                                    {note}
                                </p>
                            ))
                        ) : (
                            <p className="text-xs text-slate-400">
                                No notes yet.
                            </p>
                        )}
                    </div>
                </div>

                <div className="border-t border-slate-200 px-5 py-4 space-y-3 shrink-0 bg-slate-50/80">
                    <Select
                        value={formState.status}
                        onValueChange={(v) =>
                            onStatusChange(v as ApplicationStatus)
                        }
                    >
                        <SelectTrigger className="bg-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shortlisted">
                                Shortlisted
                            </SelectItem>
                            <SelectItem value="selected">
                                Selected / Hired
                            </SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a note..."
                            value={formState.newNote}
                            onChange={(e) => onNewNoteChange(e.target.value)}
                            className="bg-white"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onAddNote}
                            className="bg-white"
                        >
                            Add
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={onSave}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save & Notify
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
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
                                        Remove {app.name}&apos;s application
                                        permanently.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            onDelete();
                                            onClose();
                                        }}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
