"use client";

import JobCard from "@/components/JobCard";
import PageShell from "@/components/PageShell";
import SectionHeading from "@/components/SectionHeading";
import {
    JobsFiltersSkeleton,
    JobsGridSkeleton,
} from "@/components/skeletons";
import { Job } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("applied") === "true") {
            toast.success("Your application has been submitted!");
        }
    }, []);

    useEffect(() => {
        fetch("/api/jobs")
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setJobs(json.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const departments = [...new Set(jobs.map((j) => j.department))];

    const filtered = jobs.filter((j) => {
        if (deptFilter !== "all" && j.department !== deptFilter) return false;
        if (typeFilter !== "all" && j.employmentType !== typeFilter)
            return false;
        if (
            search &&
            !j.title.toLowerCase().includes(search.toLowerCase()) &&
            !j.department.toLowerCase().includes(search.toLowerCase())
        )
            return false;
        return true;
    });

    return (
        <PageShell>
            <div className="border-b border-[var(--career-border)] bg-[var(--career-bg-subtle)]">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <SectionHeading
                        title="Open"
                        highlight="roles"
                        subtitle="Find your next opportunity at DigiCraft. We're hiring across engineering, design, and product."
                    />
                </div>
            </div>
            <div className="mx-auto max-w-7xl px-4 py-12 pb-20 sm:px-6 lg:px-8">
                {loading ? (
                    <>
                        <JobsFiltersSkeleton />
                        <JobsGridSkeleton count={6} />
                    </>
                ) : (
                    <>
                        <div className="mb-10 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_11rem_11rem] md:items-center">
                            <input
                                placeholder="Search roles..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="career-field w-full"
                            />
                            <select
                                value={deptFilter}
                                onChange={(e) => setDeptFilter(e.target.value)}
                                className="career-field w-full"
                            >
                                <option value="all" className="bg-white">
                                    All Departments
                                </option>
                                {departments.map((d) => (
                                    <option
                                        key={d}
                                        value={d}
                                        className="bg-white"
                                    >
                                        {d}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="career-field w-full"
                            >
                                <option value="all" className="bg-white">
                                    All Types
                                </option>
                                <option
                                    value="full-time"
                                    className="bg-white"
                                >
                                    Full-time
                                </option>
                                <option
                                    value="part-time"
                                    className="bg-white"
                                >
                                    Part-time
                                </option>
                                <option
                                    value="contract"
                                    className="bg-white"
                                >
                                    Contract
                                </option>
                                <option
                                    value="internship"
                                    className="bg-white"
                                >
                                    Internship
                                </option>
                            </select>
                        </div>

                        {filtered.length === 0 ? (
                            <div className="career-card p-12 text-center">
                                <p className="text-lg text-[var(--career-text-muted)]">
                                    No open positions right now. Check back soon.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filtered.map((job) => (
                                    <JobCard key={job._id} job={job} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageShell>
    );
}
