"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
    INTERVIEW_MODE_LABELS,
    STATUS_COLORS,
    STATUS_LABELS,
} from "@/lib/hiring/constants";
import {
    isInterviewToday,
    isInterviewTomorrow,
    UpcomingInterviewItem,
} from "@/lib/hiring/upcomingInterviews";
import { formatISTShort, toISTDateTimeLocalValue } from "@/lib/timezone";
import { formatDistanceToNow } from "date-fns";
import {
    CalendarClock,
    ChevronDown,
    ExternalLink,
    Mail,
    Phone,
    User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function whenLabel(scheduledAtMs: number): string {
    if (isInterviewToday(scheduledAtMs)) return "Today";
    if (isInterviewTomorrow(scheduledAtMs)) return "Tomorrow";
    return formatDistanceToNow(new Date(scheduledAtMs), { addSuffix: true });
}

export default function UpcomingInterviewRow({
    item,
    saving = false,
    onReschedule,
}: {
    item: UpcomingInterviewItem;
    saving?: boolean;
    onReschedule?: (data: {
        applicationId: string;
        interviewId: string;
        scheduledAt: string;
        meetingLink: string;
    }) => Promise<void>;
}) {
    const { interview } = item;
    const urgent = isInterviewToday(item.scheduledAtMs);
    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [scheduledAt, setScheduledAt] = useState(() =>
        toISTDateTimeLocalValue(interview.scheduledAt)
    );
    const [meetingLink, setMeetingLink] = useState(
        interview.meetingLink || ""
    );

    const openReschedule = () => {
        setScheduledAt(toISTDateTimeLocalValue(interview.scheduledAt));
        setMeetingLink(interview.meetingLink || "");
        setRescheduleOpen(true);
    };

    const handleReschedule = async () => {
        if (!onReschedule || !scheduledAt.trim() || !meetingLink.trim()) return;
        await onReschedule({
            applicationId: item.applicationId,
            interviewId: interview.id,
            scheduledAt,
            meetingLink: meetingLink.trim(),
        });
        setRescheduleOpen(false);
    };

    return (
        <div
            className={`rounded-xl border px-4 py-4 bg-white flex flex-col gap-4 ${
                urgent
                    ? "border-indigo-300 ring-1 ring-indigo-100 shadow-sm"
                    : "border-slate-200 shadow-sm"
            }`}
        >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900">
                            {item.candidateName}
                        </p>
                        <Badge variant="outline" className="text-[10px]">
                            Round {interview.round}
                        </Badge>
                        <Badge
                            className={`text-[10px] ${STATUS_COLORS[item.applicationStatus]}`}
                        >
                            {STATUS_LABELS[item.applicationStatus]}
                        </Badge>
                        <Badge
                            className={`text-[10px] ${
                                urgent
                                    ? "bg-indigo-600 text-white hover:bg-indigo-600"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            {whenLabel(item.scheduledAtMs)}
                        </Badge>
                    </div>

                    <p className="text-sm text-slate-600">{item.jobTitle}</p>

                    <p className="text-base font-medium text-indigo-900">
                        {formatISTShort(interview.scheduledAt)}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-1.5 min-w-0">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{item.email}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {item.phone}
                        </span>
                        <span className="text-slate-500">
                            Mode: {INTERVIEW_MODE_LABELS[interview.mode]}
                        </span>
                        {interview.interviewer?.trim() && (
                            <span className="inline-flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {interview.interviewer}
                            </span>
                        )}
                    </div>

                    {interview.meetingLink?.trim() && (
                        <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-purple-600 hover:underline break-all font-medium"
                        >
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            Join meeting
                        </a>
                    )}

                    {interview.notes?.trim() && (
                        <p className="text-xs text-slate-500 bg-slate-50 rounded px-2 py-1.5">
                            Note: {interview.notes}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                    {onReschedule && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                            onClick={() =>
                                rescheduleOpen
                                    ? setRescheduleOpen(false)
                                    : openReschedule()
                            }
                            disabled={saving}
                        >
                            <CalendarClock className="w-3.5 h-3.5 mr-1.5" />
                            Reschedule
                            <ChevronDown
                                className={`w-3.5 h-3.5 ml-1 transition-transform ${rescheduleOpen ? "rotate-180" : ""}`}
                            />
                        </Button>
                    )}
                    <Link
                        href={`/admin/applications?open=${item.applicationId}`}
                        className="shrink-0"
                    >
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                            disabled={saving}
                        >
                            View applicant
                        </Button>
                    </Link>
                </div>
            </div>

            {rescheduleOpen && onReschedule && (
                <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-4 space-y-3">
                    <p className="text-sm font-medium text-slate-800">
                        Change time — candidate gets a reschedule email
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <Label className="text-xs text-slate-500">
                                New date & time (IST)
                            </Label>
                            <Input
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(e) =>
                                    setScheduledAt(e.target.value)
                                }
                                disabled={saving}
                                className="mt-1 bg-white"
                            />
                        </div>
                        <div>
                            <Label className="text-xs text-slate-500">
                                Meet / Zoom link
                            </Label>
                            <Input
                                value={meetingLink}
                                onChange={(e) =>
                                    setMeetingLink(e.target.value)
                                }
                                placeholder="https://meet.google.com/..."
                                disabled={saving}
                                className="mt-1 bg-white"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            size="sm"
                            disabled={
                                saving ||
                                !scheduledAt.trim() ||
                                !meetingLink.trim()
                            }
                            onClick={handleReschedule}
                        >
                            {saving ? (
                                <LoadingSpinner label="Saving…" />
                            ) : (
                                "Save & notify candidate"
                            )}
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={saving}
                            onClick={() => setRescheduleOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
