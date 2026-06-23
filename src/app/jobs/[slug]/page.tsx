"use client";

import { JobDetailSkeleton } from "@/components/skeletons";
import PageShell from "@/components/PageShell";
import { Job } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowRight, FiMapPin, FiBriefcase, FiClock } from "react-icons/fi";

export default function JobDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/jobs/by-slug/${slug}`)
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setJob(json.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return <JobDetailSkeleton />;
    }

    if (!job) {
        return (
            <PageShell>
                <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
                    <p className="text-[var(--career-text-muted)]">
                        Job not found
                    </p>
                    <Link href="/jobs" className="career-link text-sm">
                        Back to open roles
                    </Link>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell>
            <div className="border-b border-[var(--career-border)] bg-[var(--career-bg-subtle)]">
                <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                    <Link
                        href="/jobs"
                        className="mb-6 inline-block text-sm text-[var(--career-text-muted)] transition-colors hover:text-[var(--career-accent)]"
                    >
                        ← All open roles
                    </Link>
                    <span className="career-badge mb-4 inline-block">
                        {job.department}
                    </span>
                    <h1 className="mb-6 text-3xl font-normal tracking-tight text-[var(--career-text)] md:text-4xl">
                        {job.title}
                    </h1>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--career-text-muted)]">
                        <span className="flex items-center gap-2">
                            <FiMapPin className="h-4 w-4" />
                            {job.location}
                        </span>
                        <span className="flex items-center gap-2">
                            <FiBriefcase className="h-4 w-4" />
                            {job.employmentType}
                        </span>
                        <span className="flex items-center gap-2">
                            <FiClock className="h-4 w-4" />
                            {job.experienceLevel}
                        </span>
                        {job.salaryRange?.displayText && (
                            <span className="font-medium text-[var(--career-text)]">
                                {job.salaryRange.displayText}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-12 pb-20 sm:px-6 lg:px-8">
                <article className="prose-career space-y-10">
                    <section>
                        <h2>About the role</h2>
                        <p className="whitespace-pre-wrap">{job.description}</p>
                    </section>

                    {job.responsibilities?.length > 0 && (
                        <section>
                            <h2>Responsibilities</h2>
                            <ul>
                                {job.responsibilities.map((r, i) => (
                                    <li key={i}>{r}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {job.requirements?.length > 0 && (
                        <section>
                            <h2>Requirements</h2>
                            <ul>
                                {job.requirements.map((r, i) => (
                                    <li key={i}>{r}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {job.niceToHave?.length > 0 && (
                        <section>
                            <h2>Nice to have</h2>
                            <ul>
                                {job.niceToHave.map((r, i) => (
                                    <li key={i}>{r}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </article>

                <Link
                    href={`/jobs/${slug}/apply`}
                    className="career-btn-primary mt-12"
                >
                    Apply for this role
                    <FiArrowRight />
                </Link>
            </div>
        </PageShell>
    );
}
