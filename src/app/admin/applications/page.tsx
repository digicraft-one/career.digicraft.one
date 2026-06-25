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
import { AdminApplicationsSkeleton, Skeleton } from "@/components/skeletons";
import { fetchAPI } from "@/lib/api";
import { Application, ApplicationStatus, Job } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import {
    ArrowLeft,
    Download,
    ExternalLink,
    Mail,
    Phone,
    Save,
    Trash2,
    User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const STATUS_COLORS: Record<ApplicationStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    shortlisted: "bg-blue-100 text-blue-800",
    selected: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
};

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
                                Review, approve, and manage hiring
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filtered?.map((app) => (
                            <Card key={app._id} className="bg-white/90">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {app.name}
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    {app.jobTitle}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {formatDistanceToNow(
                                                        new Date(app.createdAt),
                                                        { addSuffix: true }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge
                                            className={
                                                STATUS_COLORS[app.status]
                                            }
                                        >
                                            {app.status}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Mail className="w-4 h-4" />
                                            {app.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Phone className="w-4 h-4" />
                                            {app.phone}
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-600 line-clamp-2">
                                        <strong>Skills:</strong>{" "}
                                        {app.primarySkills}
                                    </p>

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
                                                className="inline-flex items-center gap-2 text-sm text-purple-600 hover:underline"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download PDF
                                            </a>
                                        </div>
                                    )}

                                    <Select
                                        value={formState[app._id]?.status}
                                        onValueChange={(v) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                [app._id]: {
                                                    ...prev[app._id],
                                                    status: v as ApplicationStatus,
                                                },
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="shortlisted">
                                                Shortlisted
                                            </SelectItem>
                                            <SelectItem value="selected">
                                                Selected / Hired
                                            </SelectItem>
                                            <SelectItem value="declined">
                                                Declined
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Add a note..."
                                                value={
                                                    formState[app._id]?.newNote ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setFormState((prev) => ({
                                                        ...prev,
                                                        [app._id]: {
                                                            ...prev[app._id],
                                                            newNote:
                                                                e.target.value,
                                                        },
                                                    }))
                                                }
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => addNote(app._id)}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                        {formState[app._id]?.notes?.map(
                                            (note, i) => (
                                                <p
                                                    key={i}
                                                    className="text-xs bg-slate-50 p-2 rounded"
                                                >
                                                    {note}
                                                </p>
                                            )
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleSave(app._id)}
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
                                                        Remove {app.name}&apos;s
                                                        application permanently.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDelete(
                                                                app._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
