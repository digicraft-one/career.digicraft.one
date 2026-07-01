"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { AdminApplicationsSkeleton, Skeleton } from "@/components/skeletons";
import { fetchAPI } from "@/lib/api";
import { Application, ApplicationStatus, Job } from "@/lib/types";
import { EmailTemplateId } from "@/types/schemas";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ApplicationCard from "../_components/ApplicationCard";
import ApplicationDetailDialog from "../_components/ApplicationDetailDialog";
import ApplicationFiltersBar, {
    DEFAULT_APPLICATION_FILTERS,
    filterApplications,
} from "../_components/ApplicationFilters";

type FormState = {
    status: ApplicationStatus;
    notes: string[];
    newNote: string;
    declineReason: string;
    notifyEmail: boolean;
};

function buildFormState(app: Application): FormState {
    return {
        status: app.status,
        notes: app.notes || [],
        newNote: "",
        declineReason: app.declineReason || "",
        notifyEmail: true,
    };
}

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<Application[] | null>(
        null
    );
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [filters, setFilters] = useState(DEFAULT_APPLICATION_FILTERS);
    const [detailAppId, setDetailAppId] = useState<string | null>(null);
    const [formState, setFormState] = useState<Record<string, FormState>>({});

    const loadApplications = useCallback(async () => {
        const [apps, jobList] = await Promise.all([
            fetchAPI<Application[]>("/applications"),
            fetchAPI<Job[]>("/jobs?all=true"),
        ]);
        setApplications(apps);
        setJobs(jobList);
        const state: typeof formState = {};
        apps.forEach((a) => {
            state[a._id] = buildFormState(a);
        });
        setFormState(state);
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                await loadApplications();
            } catch {
                toast.error("Failed to load applications");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [loadApplications]);

    const updateApplicationInState = (updated: Application) => {
        setApplications(
            (prev) =>
                prev?.map((a) => (a._id === updated._id ? updated : a)) || []
        );
        setFormState((prev) => ({
            ...prev,
            [updated._id]: {
                ...buildFormState(updated),
                newNote: prev[updated._id]?.newNote || "",
                notifyEmail: prev[updated._id]?.notifyEmail ?? true,
            },
        }));
    };

    const filtered = useMemo(
        () => filterApplications(applications ?? [], filters),
        [applications, filters]
    );

    const detailApp = useMemo(
        () => applications?.find((a) => a._id === detailAppId) ?? null,
        [applications, detailAppId]
    );

    const runAction = async <T,>(
        message: string,
        successMessage: string,
        fn: () => Promise<T>
    ): Promise<T> => {
        setSaving(true);
        const toastId = toast.loading(message);
        try {
            const result = await fn();
            toast.success(successMessage, { id: toastId });
            return result;
        } catch {
            toast.error("Something went wrong", { id: toastId });
            throw new Error("Action failed");
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async (id: string, sendEmail: boolean) => {
        const state = formState[id];
        if (!state) return;

        if (state.status === "declined" && !state.declineReason.trim()) {
            toast.error("Add an internal decline reason");
            return;
        }

        try {
            const updated = await runAction(
                "Updating…",
                sendEmail ? "Updated & email sent" : "Updated",
                () =>
                    fetchAPI<Application>(`/applications/${id}`, {
                        method: "PATCH",
                        body: JSON.stringify({
                            status: state.status,
                            notes: state.notes,
                            sendEmail,
                            declineReason:
                                state.declineReason.trim() || undefined,
                        }),
                    })
            );
            updateApplicationInState(updated);
        } catch {
            /* toast handled */
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await runAction("Deleting…", "Deleted", () =>
                fetchAPI(`/applications/${id}`, { method: "DELETE" })
            );
            setApplications((prev) => prev?.filter((a) => a._id !== id) || []);
            setDetailAppId(null);
        } catch {
            /* toast handled */
        }
    };

    const runWorkflow = async (
        id: string,
        action: string,
        payload: Record<string, unknown>,
        loadingMsg: string,
        successMsg: string
    ) => {
        try {
            const updated = await runAction(loadingMsg, successMsg, () =>
                fetchAPI<Application>(`/applications/${id}/workflow`, {
                    method: "POST",
                    body: JSON.stringify({ action, ...payload }),
                })
            );
            updateApplicationInState(updated);
        } catch {
            /* toast handled */
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
                description="Review candidates and update their hiring status"
            />

            {loading ? (
                <div className="space-y-3">
                    <Skeleton className="h-10 w-full max-w-xl" />
                    <AdminApplicationsSkeleton />
                </div>
            ) : (
                <>
                    <ApplicationFiltersBar
                        filters={filters}
                        onChange={setFilters}
                        jobs={jobs}
                        totalCount={applications?.length ?? 0}
                        filteredCount={filtered.length}
                    />

                    {filtered.length === 0 ? (
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
                                    onViewDetails={() =>
                                        setDetailAppId(app._id)
                                    }
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            <ApplicationDetailDialog
                open={!!detailAppId}
                onClose={() => {
                    if (!saving) setDetailAppId(null);
                }}
                app={detailApp}
                loading={saving}
                formState={
                    detailAppId && formState[detailAppId]
                        ? formState[detailAppId]
                        : {
                              status: detailApp?.status ?? "pending",
                              notes: detailApp?.notes ?? [],
                              newNote: "",
                              declineReason: detailApp?.declineReason ?? "",
                              notifyEmail: true,
                          }
                }
                onStatusChange={(status) =>
                    detailAppId &&
                    setFormState((prev) => ({
                        ...prev,
                        [detailAppId]: { ...prev[detailAppId], status },
                    }))
                }
                onDeclineReasonChange={(value) =>
                    detailAppId &&
                    setFormState((prev) => ({
                        ...prev,
                        [detailAppId]: {
                            ...prev[detailAppId],
                            declineReason: value,
                        },
                    }))
                }
                onNotifyEmailChange={(value) =>
                    detailAppId &&
                    setFormState((prev) => ({
                        ...prev,
                        [detailAppId]: {
                            ...prev[detailAppId],
                            notifyEmail: value,
                        },
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
                onSave={(sendEmail) =>
                    detailAppId && handleSave(detailAppId, sendEmail)
                }
                onDelete={async () => {
                    if (detailAppId) await handleDelete(detailAppId);
                }}
                onScheduleInterview={async (data) => {
                    if (!detailAppId) return;
                    await runWorkflow(
                        detailAppId,
                        "schedule_interview",
                        {
                            ...data,
                            scheduledAt: data.scheduledAt,
                        },
                        "Scheduling interview…",
                        "Interview scheduled & invite sent"
                    );
                }}
                onSendInterviewInvite={async (interviewId) => {
                    if (!detailAppId) return;
                    await runWorkflow(
                        detailAppId,
                        "send_interview_invite",
                        { interviewId },
                        "Sending invite…",
                        "Invite sent"
                    );
                }}
                onSendEmail={async (data) => {
                    if (!detailAppId) return;
                    await runWorkflow(
                        detailAppId,
                        "send_email",
                        data,
                        "Sending email…",
                        "Email sent"
                    );
                }}
                onSaveContract={async (data) => {
                    if (!detailAppId) return;
                    await runWorkflow(
                        detailAppId,
                        "link_contract",
                        data,
                        "Saving contract…",
                        "Contract link saved"
                    );
                }}
            />
        </div>
    );
}
