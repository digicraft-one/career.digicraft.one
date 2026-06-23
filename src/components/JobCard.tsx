import Link from "next/link";
import { Job } from "@/lib/types";
import { MapPin, Briefcase, Clock, ArrowUpRight } from "lucide-react";

interface JobCardProps {
    job: Job;
}

const employmentLabels: Record<string, string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    internship: "Internship",
};

const levelLabels: Record<string, string> = {
    junior: "Junior",
    mid: "Mid-level",
    senior: "Senior",
    lead: "Lead",
};

export default function JobCard({ job }: JobCardProps) {
    return (
        <Link href={`/jobs/${job.seo.slug}`} className="group block h-full">
            <article className="career-card flex h-full flex-col p-6">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <span className="career-badge">{job.department}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--career-text-subtle)] transition-colors group-hover:text-[var(--career-text)]" />
                </div>

                <h3 className="mb-3 text-lg font-medium text-[var(--career-text)] transition-colors group-hover:text-[var(--career-accent)]">
                    {job.title}
                </h3>

                <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--career-text-muted)]">
                    <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" />
                        {employmentLabels[job.employmentType]}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {levelLabels[job.experienceLevel]}
                    </span>
                </div>

                {job.salaryRange?.displayText && (
                    <p className="mb-3 text-sm font-medium text-[var(--career-text)]">
                        {job.salaryRange.displayText}
                    </p>
                )}

                <p className="mt-auto line-clamp-2 text-sm leading-relaxed text-[var(--career-text-muted)]">
                    {job.description}
                </p>
            </article>
        </Link>
    );
}
