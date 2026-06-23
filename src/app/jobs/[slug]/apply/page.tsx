"use client";

import ApplicationForm from "@/components/ApplicationForm";
import PageShell from "@/components/PageShell";
import { ApplicationFormSkeleton } from "@/components/skeletons";
import { Job } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ApplyPage() {
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
        return <ApplicationFormSkeleton />;
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
            <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
                <Link
                    href={`/jobs/${slug}`}
                    className="mb-6 inline-block text-sm text-[var(--career-text-muted)] transition-colors hover:text-[var(--career-accent)]"
                >
                    ← Back to job details
                </Link>
                <ApplicationForm jobId={job._id} jobTitle={job.title} />
            </div>
        </PageShell>
    );
}
