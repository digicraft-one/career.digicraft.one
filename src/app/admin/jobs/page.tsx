"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
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
import { AdminJobsListSkeleton } from "@/components/skeletons";
import { fetchAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Job } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    published: "bg-green-100 text-green-700",
    closed: "bg-red-100 text-red-700",
};

const STATUS_FILTERS = [
    { value: "all", label: "All" },
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "closed", label: "Closed" },
] as const;

export default function AdminJobsPage() {
    const [jobs, setJobs] = useState<Job[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [search, setSearch] = useState("");

    const fetchJobs = async () => {
        try {
            const data = await fetchAPI<Job[]>("/jobs?all=true");
            setJobs(data);
        } catch {
            toast.error("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return (jobs ?? []).filter((job) => {
            if (statusFilter !== "all" && job.status !== statusFilter) {
                return false;
            }
            if (!q) return true;
            return [job.title, job.department, job.location]
                .join(" ")
                .toLowerCase()
                .includes(q);
        });
    }, [jobs, statusFilter, search]);

    const handleDelete = async (id: string) => {
        try {
            await fetchAPI(`/jobs/${id}`, { method: "DELETE" });
            toast.success("Job deleted");
            setJobs((prev) => prev?.filter((j) => j._id !== id) || []);
        } catch {
            toast.error("Failed to delete job");
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await fetchAPI(`/jobs/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            });
            toast.success("Status updated");
            setJobs((prev) =>
                prev?.map((j) =>
                    j._id === id
                        ? { ...j, status: status as Job["status"] }
                        : j
                ) || []
            );
        } catch {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-5">
            <AdminPageHeader
                title="Jobs"
                description="Create, publish, and manage open roles"
                action={
                    <Link href="/admin/jobs/new">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Plus className="w-4 h-4 mr-1.5" />
                            Post job
                        </Button>
                    </Link>
                }
            />

            {!loading && (jobs?.length ?? 0) > 0 && (
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search jobs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-white"
                        />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {STATUS_FILTERS.map((f) => (
                            <button
                                key={f.value}
                                type="button"
                                onClick={() => setStatusFilter(f.value)}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                                    statusFilter === f.value
                                        ? "bg-purple-600 text-white"
                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                )}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading ? (
                <AdminJobsListSkeleton />
            ) : jobs?.length === 0 ? (
                <Card>
                    <CardContent className="p-10 text-center">
                        <p className="text-slate-500 text-sm mb-4">No jobs yet</p>
                        <Link href="/admin/jobs/new">
                            <Button size="sm">Create first job</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : filtered.length === 0 ? (
                <Card>
                    <CardContent className="p-10 text-center text-slate-500 text-sm">
                        No jobs match your filters
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2">
                    {filtered.map((job) => (
                        <Card key={job._id} className="bg-white">
                            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                        <h3 className="font-medium text-slate-900 truncate">
                                            {job.title}
                                        </h3>
                                        <Badge
                                            className={`text-[10px] ${statusColors[job.status]}`}
                                        >
                                            {job.status}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {job.department} · {job.location} ·{" "}
                                        {formatDistanceToNow(
                                            new Date(job.createdAt),
                                            { addSuffix: true }
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Select
                                        value={job.status}
                                        onValueChange={(v) =>
                                            handleStatusChange(job._id, v)
                                        }
                                    >
                                        <SelectTrigger className="w-32 h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">
                                                Draft
                                            </SelectItem>
                                            <SelectItem value="published">
                                                Published
                                            </SelectItem>
                                            <SelectItem value="closed">
                                                Closed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Link href={`/admin/jobs/${job._id}`}>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                        </Button>
                                    </Link>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 text-red-600"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Delete job?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete
                                                    &quot;{job.title}&quot;.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() =>
                                                        handleDelete(job._id)
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
        </div>
    );
}
