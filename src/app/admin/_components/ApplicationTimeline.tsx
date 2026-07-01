"use client";

import { Badge } from "@/components/ui/badge";
import { Application } from "@/lib/types";
import { ActivityType } from "@/types/schemas";
import { formatISTShort } from "@/lib/timezone";
import {
    Calendar,
    FileText,
    Mail,
    MessageSquare,
    PenLine,
    RefreshCw,
    UserCheck,
} from "lucide-react";

const ACTIVITY_ICONS: Record<ActivityType, React.ReactNode> = {
    application_received: <UserCheck className="w-3.5 h-3.5" />,
    status_change: <RefreshCw className="w-3.5 h-3.5" />,
    note_added: <MessageSquare className="w-3.5 h-3.5" />,
    email_sent: <Mail className="w-3.5 h-3.5" />,
    interview_scheduled: <Calendar className="w-3.5 h-3.5" />,
    interview_updated: <Calendar className="w-3.5 h-3.5" />,
    interview_invite_sent: <Mail className="w-3.5 h-3.5" />,
    sign_linked: <PenLine className="w-3.5 h-3.5" />,
    contract_linked: <FileText className="w-3.5 h-3.5" />,
};

interface ApplicationTimelineProps {
    app: Application;
}

export default function ApplicationTimeline({ app }: ApplicationTimelineProps) {
    const activities = [...(app.activities || [])].sort(
        (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
    );

    if (activities.length === 0) {
        return (
            <p className="text-xs text-slate-400 py-4 text-center">
                No activity recorded yet.
            </p>
        );
    }

    return (
        <ul className="space-y-2">
            {activities.map((entry, i) => (
                <li
                    key={`${entry.type}-${i}-${entry.at}`}
                    className="flex gap-3 text-xs bg-slate-50 rounded-lg px-3 py-2.5"
                >
                    <span className="shrink-0 mt-0.5 text-purple-500">
                        {ACTIVITY_ICONS[entry.type] ?? (
                            <RefreshCw className="w-3.5 h-3.5" />
                        )}
                    </span>
                    <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-slate-700 font-medium break-words">
                            {entry.summary}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-400">
                            <span>{formatISTShort(entry.at)}</span>
                            {entry.by && <span>· {entry.by}</span>}
                            <Badge
                                variant="outline"
                                className="text-[9px] capitalize"
                            >
                                {entry.type.replace(/_/g, " ")}
                            </Badge>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
