"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { AdminApplicationsSkeleton, Skeleton } from "@/components/skeletons";
import { fetchAPI } from "@/lib/api";
import { Application, ApplicationStatus, Job } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ApplicationCard from "../_components/ApplicationCard";
import ApplicationDetailDialog from "../_components/ApplicationDetailDialog";
import ApplicationFiltersBar, {
    DEFAULT_APPLICATION_FILTERS,
    filterApplications,
} from "../_components/ApplicationFilters";

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<Application[] | null>(
        null
    );
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState(DEFAULT_APPLICATION_FILTERS);
    const [detailAppId, setDetailAppId] = useState<string | null>(null);
    const [formState, setFormState] = useState<
        Record<string, { status: ApplicationStatus; notes: string[]; newNote: string }>
    >({});

    useEffect(() => {
        const load = async () => {
            try {
                const [apps, jobList] = await Promise.all([
                    fetchAPI<Application[]>("/applications"),
                    fetchAPI<Job[]>("/jobs?all=true"),
                ]);
                setApplications(apps);
                setJobs(jobList);
                const state: typeof formState = {};
                apps.forEach((a) => {
                    state[a._id] = {
                        status: a.status,
                        notes: a.notes || [],
                        newNote: "",
                    };
                });
                setFormState(state);
            } catch {
                toast.error("Failed to load applications");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = useMemo(
        () => filterApplications(applications ?? [], filters),
        [applications, filters]
    );

    const detailApp = useMemo(
        () => applications?.find((a) => a._id === detailAppId) ?? null,
        [applications, detailAppId]
    );

    const handleSave = async (id: string) => {
        const state = formState[id];
        if (!state) return;
        try {
            await fetchAPI(`/applications/${id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    status: state.status,
                    notes: state.notes,
                }),
            });
            setApplications((prev) =>
                prev?.map((a) =>
                    a._id === id
                        ? { ...a, status: state.status, notes: state.notes }
                        : a
                ) || []
            );
            toast.success("Application updated — email sent if status changed");
        } catch {
            toast.error("Failed to update");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await fetchAPI(`/applications/${id}`, { method: "DELETE" });
            setApplications((prev) => prev?.filter((a) => a._id !== id) || []);
            setDetailAppId(null);
            toast.success("Deleted");
        } catch {
            toast.error("Failed to delete");
        }
    };

    const addNote = (id: string) => {
        const note = formState[id]?.newNote?.trim();
        if (!note) return;
        setFormState((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                notes: [...(prev[id]?.notes || []), note],
                newNote: "",
            },
        }));
    };

    return (
        <div className="space-y-5">
            <AdminPageHeader
                title="Applications"
                description="Search, filter, and open any applicant for full details"
            />

            {loading ? (
                <div className="space-y-3">
                    <Skeleton className="h-10 w-full max-w-xl" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-10 w-40" />
                        <Skeleton className="h-10 w-36" />
                        <Skeleton className="h-10 w-36" />
                    </div>
                </div>
            ) : (
                <ApplicationFiltersBar
                    filters={filters}
                    onChange={setFilters}
                    jobs={jobs}
                    totalCount={applications?.length ?? 0}
                    filteredCount={filtered.length}
                />
            )}

            {loading ? (
                <AdminApplicationsSkeleton />
            ) : filtered.length === 0 ? (
                <Card>
                    <CardContent className="p-10 text-center text-slate-500 text-sm">
                        No applications match your filters
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filtered.map((app) => (
                        <ApplicationCard
                            key={app._id}
                            app={app}
                            onViewDetails={() => setDetailAppId(app._id)}
                        />
                    ))}
                </div>
            )}

            <ApplicationDetailDialog
                open={!!detailAppId}
                onClose={() => setDetailAppId(null)}
                app={detailApp}
                formState={
                    detailAppId && formState[detailAppId]
                        ? formState[detailAppId]
                        : {
                              status: detailApp?.status ?? "pending",
                              notes: detailApp?.notes ?? [],
                              newNote: "",
                          }
                }
                onStatusChange={(status) =>
                    detailAppId &&
                    setFormState((prev) => ({
                        ...prev,
                        [detailAppId]: { ...prev[detailAppId], status },
                    }))
                }
                onNewNoteChange={(value) =>
                    detailAppId &&
                    setFormState((prev) => ({
                        ...prev,
                        [detailAppId]: {
                            ...prev[detailAppId],
                            newNote: value,
                        },
                    }))
                }
                onAddNote={() => detailAppId && addNote(detailAppId)}
                onSave={() => detailAppId && handleSave(detailAppId)}
                onDelete={() => detailAppId && handleDelete(detailAppId)}
            />
        </div>
    );
}
