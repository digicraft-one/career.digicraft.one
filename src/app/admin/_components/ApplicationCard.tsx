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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Application, ApplicationStatus } from "@/lib/types";
import { format, formatDistanceToNow } from "date-fns";
import {
    Briefcase,
    Calendar,
    ChevronDown,
    Download,
    ExternalLink,
    Github,
    Globe,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Save,
    Trash2,
    User,
} from "lucide-react";
import { useState } from "react";
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

interface ApplicationCardProps {
    app: Application;
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

export default function ApplicationCard({
    app,
    formState,
    onStatusChange,
    onNewNoteChange,
    onAddNote,
    onSave,
    onDelete,
}: ApplicationCardProps) {
    const [detailsOpen, setDetailsOpen] = useState(false);

    return (
        <Card className="bg-white/90">
            <CardContent className="p-6 space-y-5">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600 shrink-0">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-lg text-slate-900 truncate">
                                {app.name}
                            </h3>
                            <p className="text-sm text-slate-500 flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                                {app.jobTitle}
                            </p>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 shrink-0" />
                                Applied{" "}
                                {formatDistanceToNow(new Date(app.createdAt), {
                                    addSuffix: true,
                                })}
                                {" · "}
                                {format(new Date(app.createdAt), "PPp")}
                            </p>
                        </div>
                    </div>
                    <Badge className={`shrink-0 ${STATUS_COLORS[app.status]}`}>
                        {app.status}
                    </Badge>
                </div>

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
                            EXPERIENCE_LABELS[app.experience] || app.experience
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
                        collapsedLines={4}
                        minCharsToCollapse={160}
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

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setDetailsOpen((v) => !v)}
                        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                        <span>Status history & admin notes</span>
                        <ChevronDown
                            className={`w-4 h-4 shrink-0 transition-transform ${
                                detailsOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                    {detailsOpen && (
                        <div className="px-4 py-4 space-y-4 border-t border-slate-200 bg-white">
                            {app.statusHistory?.length > 0 ? (
                                <div className="space-y-2">
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
                                                        new Date(
                                                            entry.changedAt
                                                        ),
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
                            ) : (
                                <p className="text-xs text-slate-400">
                                    No status history yet.
                                </p>
                            )}

                            <div className="space-y-2">
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
                    )}
                </div>

                <Select
                    value={formState.status}
                    onValueChange={(v) =>
                        onStatusChange(v as ApplicationStatus)
                    }
                >
                    <SelectTrigger>
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
                    />
                    <Button type="button" variant="outline" onClick={onAddNote}>
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
                                className="text-red-600"
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
                                <AlertDialogAction onClick={onDelete}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}
