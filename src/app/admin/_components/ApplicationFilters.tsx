"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Application, ApplicationStatus, ExperienceLevel, Job } from "@/lib/types";
import { Search, X } from "lucide-react";

export type ApplicationSort = "newest" | "oldest" | "name-asc" | "name-desc";
export type AppliedWithin = "all" | "7d" | "30d" | "90d";

export interface ApplicationFiltersState {
    search: string;
    jobId: string;
    status: string;
    experience: string;
    appliedWithin: AppliedWithin;
    sort: ApplicationSort;
}

export const DEFAULT_APPLICATION_FILTERS: ApplicationFiltersState = {
    search: "",
    jobId: "all",
    status: "all",
    experience: "all",
    appliedWithin: "all",
    sort: "newest",
};

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string }[] = [
    { value: "junior", label: "Junior" },
    { value: "mid", label: "Mid-level" },
    { value: "senior", label: "Senior" },
    { value: "lead", label: "Lead" },
];

function normalizeJobId(jobId: Application["jobId"]): string {
    if (typeof jobId === "string") return jobId;
    if (jobId && typeof jobId === "object" && "_id" in jobId) {
        return String((jobId as { _id: string })._id);
    }
    return String(jobId);
}

function matchesSearch(app: Application, query: string): boolean {
    const q = query.trim().toLowerCase();
    if (!q) return true;

    const haystack = [
        app.name,
        app.email,
        app.phone,
        app.location,
        app.jobTitle,
        app.primarySkills,
        app.secondarySkills,
        app.canJoin,
    ]
        .join(" ")
        .toLowerCase();

    return haystack.includes(q);
}

function matchesAppliedWithin(app: Application, within: AppliedWithin): boolean {
    if (within === "all") return true;

    const days = within === "7d" ? 7 : within === "30d" ? 30 : 90;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return new Date(app.createdAt).getTime() >= cutoff;
}

function compareApplications(a: Application, b: Application, sort: ApplicationSort) {
    switch (sort) {
        case "oldest":
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name-asc":
            return a.name.localeCompare(b.name);
        case "name-desc":
            return b.name.localeCompare(a.name);
        case "newest":
        default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
}

export function filterApplications(
    applications: Application[],
    filters: ApplicationFiltersState
): Application[] {
    return applications
        .filter((app) => {
            if (filters.jobId !== "all" && normalizeJobId(app.jobId) !== filters.jobId) {
                return false;
            }
            if (filters.status !== "all" && app.status !== filters.status) {
                return false;
            }
            if (
                filters.experience !== "all" &&
                app.experience !== filters.experience
            ) {
                return false;
            }
            if (!matchesAppliedWithin(app, filters.appliedWithin)) return false;
            if (!matchesSearch(app, filters.search)) return false;
            return true;
        })
        .sort((a, b) => compareApplications(a, b, filters.sort));
}

export function hasActiveFilters(filters: ApplicationFiltersState): boolean {
    return (
        filters.search.trim() !== "" ||
        filters.jobId !== "all" ||
        filters.status !== "all" ||
        filters.experience !== "all" ||
        filters.appliedWithin !== "all" ||
        filters.sort !== "newest"
    );
}

interface ApplicationFiltersProps {
    filters: ApplicationFiltersState;
    onChange: (filters: ApplicationFiltersState) => void;
    jobs: Job[];
    totalCount: number;
    filteredCount: number;
}

export default function ApplicationFiltersBar({
    filters,
    onChange,
    jobs,
    totalCount,
    filteredCount,
}: ApplicationFiltersProps) {
    const active = hasActiveFilters(filters);

    const patch = (partial: Partial<ApplicationFiltersState>) => {
        onChange({ ...filters, ...partial });
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search name, email, skills, location..."
                        value={filters.search}
                        onChange={(e) => patch({ search: e.target.value })}
                        className="pl-9 bg-white"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <Select
                        value={filters.jobId}
                        onValueChange={(v) => patch({ jobId: v })}
                    >
                        <SelectTrigger className="w-[160px] bg-white">
                            <SelectValue placeholder="Job" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All jobs</SelectItem>
                            {jobs.map((j) => (
                                <SelectItem key={j._id} value={j._id}>
                                    {j.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.status}
                        onValueChange={(v) =>
                            patch({ status: v as ApplicationStatus | "all" })
                        }
                    >
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shortlisted">Shortlisted</SelectItem>
                            <SelectItem value="selected">Selected</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.experience}
                        onValueChange={(v) => patch({ experience: v })}
                    >
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="Experience" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All experience</SelectItem>
                            {EXPERIENCE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.appliedWithin}
                        onValueChange={(v) =>
                            patch({ appliedWithin: v as AppliedWithin })
                        }
                    >
                        <SelectTrigger className="w-[150px] bg-white">
                            <SelectValue placeholder="Applied" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any time</SelectItem>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.sort}
                        onValueChange={(v) =>
                            patch({ sort: v as ApplicationSort })
                        }
                    >
                        <SelectTrigger className="w-[150px] bg-white">
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest first</SelectItem>
                            <SelectItem value="oldest">Oldest first</SelectItem>
                            <SelectItem value="name-asc">Name A–Z</SelectItem>
                            <SelectItem value="name-desc">Name Z–A</SelectItem>
                        </SelectContent>
                    </Select>

                    {active && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="bg-white"
                            onClick={() => onChange(DEFAULT_APPLICATION_FILTERS)}
                        >
                            <X className="w-3.5 h-3.5 mr-1" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-700">{filteredCount}</span>{" "}
                of{" "}
                <span className="font-medium text-slate-700">{totalCount}</span>{" "}
                applications
            </p>
        </div>
    );
}
