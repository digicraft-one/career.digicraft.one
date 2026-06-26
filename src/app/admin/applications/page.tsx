"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AdminApplicationsSkeleton, Skeleton } from "@/components/skeletons";
import { fetchAPI } from "@/lib/api";
import { Application, ApplicationStatus, Job } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ApplicationCard from "../_components/ApplicationCard";

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<Application[] | null>(
        null
    );
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterJob, setFilterJob] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
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

    const filtered = applications?.filter((a) => {
        if (filterJob !== "all" && a.jobId !== filterJob) return false;
        if (filterStatus !== "all" && a.status !== filterStatus) return false;
        return true;
    });

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
            <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Applications</h1>
                            <p className="text-slate-600">
                                Review full applicant details, update status, and
                                manage hiring
                            </p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-wrap gap-4">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-10 w-48" />
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4">
                        <Select value={filterJob} onValueChange={setFilterJob}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by job" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Jobs</SelectItem>
                                {jobs.map((j) => (
                                    <SelectItem key={j._id} value={j._id}>
                                        {j.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={filterStatus}
                            onValueChange={setFilterStatus}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="shortlisted">
                                    Shortlisted
                                </SelectItem>
                                <SelectItem value="selected">Selected</SelectItem>
                                <SelectItem value="declined">Declined</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {loading ? (
                    <AdminApplicationsSkeleton />
                ) : filtered?.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center text-slate-500">
                            No applications found
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {filtered?.map((app) => (
                            <ApplicationCard
                                key={app._id}
                                app={app}
                                formState={
                                    formState[app._id] || {
                                        status: app.status,
                                        notes: app.notes || [],
                                        newNote: "",
                                    }
                                }
                                onStatusChange={(status) =>
                                    setFormState((prev) => ({
                                        ...prev,
                                        [app._id]: {
                                            ...prev[app._id],
                                            status,
                                        },
                                    }))
                                }
                                onNewNoteChange={(value) =>
                                    setFormState((prev) => ({
                                        ...prev,
                                        [app._id]: {
                                            ...prev[app._id],
                                            newNote: value,
                                        },
                                    }))
                                }
                                onAddNote={() => addNote(app._id)}
                                onSave={() => handleSave(app._id)}
                                onDelete={() => handleDelete(app._id)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
