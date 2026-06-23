"use client";

import CareerHero from "@/components/CareerHero";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import Navbar from "@/components/Navbar";
import SectionHeading from "@/components/SectionHeading";
import { JobsGridSkeleton } from "@/components/skeletons";
import { Job } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";

const values = [
    {
        title: "Meaningful work",
        desc: "Ship web, mobile, and AI products used by real customers — not slide decks.",
    },
    {
        title: "Clear ownership",
        desc: "Small teams, direct communication, and responsibility from day one.",
    },
    {
        title: "Room to grow",
        desc: "Mentorship, learning budget, and paths to lead larger initiatives.",
    },
];

export default function HomePage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [jobsLoading, setJobsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/jobs")
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setJobs(json.data.slice(0, 3));
            })
            .catch(console.error)
            .finally(() => setJobsLoading(false));
    }, []);

    return (
        <>
            <Navbar />
            <CareerHero />

            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        title="Why work at"
                        highlight="DigiCraft"
                        subtitle="We focus on craft, accountability, and building software that holds up in production."
                        align="center"
                    />
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {values.map((item) => (
                            <div
                                key={item.title}
                                className="career-card p-8"
                            >
                                <h3 className="mb-3 text-lg font-medium text-[var(--career-text)]">
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-[var(--career-text-muted)]">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {(jobsLoading || jobs.length > 0) && (
                <section className="career-section-alt py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between [&_.section-title]:mb-0">
                            <SectionHeading
                                title="Open"
                                highlight="positions"
                                subtitle="Current opportunities across engineering and product."
                            />
                            {!jobsLoading && (
                                <Link
                                    href="/jobs"
                                    className="inline-flex items-center gap-2 text-sm font-medium career-link"
                                >
                                    View all roles <FiArrowRight />
                                </Link>
                            )}
                        </div>
                        {jobsLoading ? (
                            <JobsGridSkeleton count={3} />
                        ) : (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {jobs.map((job) => (
                                    <JobCard key={job._id} job={job} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            <section className="py-20">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-4 text-3xl font-normal tracking-tight text-[var(--career-text)]">
                        Ready to apply?
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-[var(--career-text-muted)]">
                        Browse our open roles and submit your application in a
                        few minutes.
                    </p>
                    <Link href="/jobs" className="career-btn-primary">
                        Browse open roles
                        <FiArrowRight />
                    </Link>
                </div>
            </section>

            <Footer />
        </>
    );
}
