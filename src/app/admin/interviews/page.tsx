"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/skeletons";
import { fetchAPI } from "@/lib/api";
import {
    collectUpcomingInterviews,
    isInterviewToday,
    isInterviewTomorrow,
    UpcomingInterviewItem,
} from "@/lib/hiring/upcomingInterviews";
import { Application } from "@/lib/types";
import { Calendar, CalendarClock } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import UpcomingInterviewRow from "../_components/UpcomingInterviewRow";

type Filter = "all" | "today" | "tomorrow" | "week";

function isWithinNextDays(scheduledAtMs: number, days: number): boolean {
    const now = Date.now();
    const cutoff = now + days * 24 * 60 * 60 * 1000;
    return scheduledAtMs >= now && scheduledAtMs <= cutoff;
}

function InterviewSection({
    title,
    items,
    saving,
    onReschedule,
}: {
    title: string;
    items: UpcomingInterviewItem[];
    saving: boolean;
    onReschedule: (data: {
        applicationId: string;
        interviewId: string;
        scheduledAt: string;
        meetingLink: string;
    }) => Promise<void>;
}) {
    if (items.length === 0) return null;

    return (
        <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                {title}
                <span className="text-xs font-normal text-slate-400">
                    ({items.length})
                </span>
            </h2>
            <div className="space-y-3">
                {items.map((item) => (
                    <UpcomingInterviewRow
                        key={`${item.applicationId}-${item.interview.id}`}
                        item={item}
                        saving={saving}
                        onReschedule={onReschedule}
                    />
                ))}
            </div>
        </section>
    );
}

export default function AdminInterviewsPage() {
    const [applications, setApplications] = useState<Application[] | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [filter, setFilter] = useState<Filter>("all");

    const load = useCallback(async () => {
        try {
            const apps = await fetchAPI<Application[]>("/applications");
            setApplications(apps);
        } catch {
            toast.error("Failed to load interviews");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleReschedule = async (data: {
        applicationId: string;
        interviewId: string;
        scheduledAt: string;
        meetingLink: string;
    }) => {
        setSaving(true);
        const toastId = toast.loading("Rescheduling & notifying…");
        try {
            await fetchAPI<Application>(
                `/applications/${data.applicationId}/workflow`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        action: "reschedule_interview",
                        interviewId: data.interviewId,
                        scheduledAt: data.scheduledAt,
                        meetingLink: data.meetingLink,
                        sendNotify: true,
                    }),
                }
            );
            await load();
            toast.success("Interview rescheduled & candidate notified", {
                id: toastId,
            });
        } catch {
            toast.error("Failed to reschedule interview", { id: toastId });
            throw new Error("Reschedule failed");
        } finally {
            setSaving(false);
        }
    };

    const allUpcoming = useMemo(
        () => collectUpcomingInterviews(applications ?? []),
        [applications]
    );

    const filtered = useMemo(() => {
        switch (filter) {
            case "today":
                return allUpcoming.filter((i) =>
                    isInterviewToday(i.scheduledAtMs)
                );
            case "tomorrow":
                return allUpcoming.filter((i) =>
                    isInterviewTomorrow(i.scheduledAtMs)
                );
            case "week":
                return allUpcoming.filter((i) =>
                    isWithinNextDays(i.scheduledAtMs, 7)
                );
            default:
                return allUpcoming;
        }
    }, [allUpcoming, filter]);

    const todayItems = useMemo(
        () =>
            filtered.filter((i) => isInterviewToday(i.scheduledAtMs)),
        [filtered]
    );
    const tomorrowItems = useMemo(
        () =>
            filtered.filter((i) => isInterviewTomorrow(i.scheduledAtMs)),
        [filtered]
    );
    const laterItems = useMemo(
        () =>
            filtered.filter(
                (i) =>
                    !isInterviewToday(i.scheduledAtMs) &&
                    !isInterviewTomorrow(i.scheduledAtMs)
            ),
        [filtered]
    );

    const stats = useMemo(
        () => ({
            total: allUpcoming.length,
            today: allUpcoming.filter((i) =>
                isInterviewToday(i.scheduledAtMs)
            ).length,
            week: allUpcoming.filter((i) =>
                isWithinNextDays(i.scheduledAtMs, 7)
            ).length,
        }),
        [allUpcoming]
    );

    const filterButtons: { id: Filter; label: string }[] = [
        { id: "all", label: "All upcoming" },
        { id: "today", label: "Today" },
        { id: "tomorrow", label: "Tomorrow" },
        { id: "week", label: "This week" },
    ];

    return (
        <div className="space-y-5">
            <AdminPageHeader
                title="Interviews"
                description="Upcoming scheduled interviews — one latest round per candidate (IST)"
            />

            {loading ? (
                <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                    </div>
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Card className="bg-white border-indigo-100">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="rounded-lg bg-indigo-100 p-2">
                                    <Calendar className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {stats.today}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Today
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="rounded-lg bg-purple-100 p-2">
                                    <CalendarClock className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {stats.week}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Next 7 days
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="rounded-lg bg-slate-100 p-2">
                                    <Calendar className="w-5 h-5 text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {stats.total}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        All scheduled
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {filterButtons.map((btn) => (
                            <button
                                key={btn.id}
                                type="button"
                                onClick={() => setFilter(btn.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                    filter === btn.id
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    {filtered.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm font-medium text-slate-700">
                                    No upcoming interviews
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Schedule interviews from an applicant&apos;s
                                    profile in Applications.
                                </p>
                            </CardContent>
                        </Card>
                    ) : filter === "all" ? (
                        <div className="space-y-8">
                            <InterviewSection
                                title="Today"
                                items={todayItems}
                                saving={saving}
                                onReschedule={handleReschedule}
                            />
                            <InterviewSection
                                title="Tomorrow"
                                items={tomorrowItems}
                                saving={saving}
                                onReschedule={handleReschedule}
                            />
                            <InterviewSection
                                title="Later"
                                items={laterItems}
                                saving={saving}
                                onReschedule={handleReschedule}
                            />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((item) => (
                                <UpcomingInterviewRow
                                    key={`${item.applicationId}-${item.interview.id}`}
                                    item={item}
                                    saving={saving}
                                    onReschedule={handleReschedule}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
