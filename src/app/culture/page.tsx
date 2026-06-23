"use client";

import PageShell from "@/components/PageShell";
import SectionHeading from "@/components/SectionHeading";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const team = [
    { name: "Ayush Maurya", role: "Founder & CEO", image: "/team/ayush.png" },
    { name: "Adarsh", role: "Tech Lead", image: "/team/adarsh.jpg" },
    { name: "Harshit", role: "Developer", image: "/team/harshit.jpg" },
    { name: "Prateek", role: "Developer", image: "/team/prateek.jpg" },
    { name: "Vikash", role: "Developer", image: "/team/vikash.jpg" },
    { name: "Anshu", role: "Designer", image: "/team/anshu.jpg" },
];

const techStack = [
    "react.png",
    "nextjs.png",
    "typescript.png",
    "nodejs.png",
    "mongodb.png",
    "tailwind.svg",
    "python.png",
    "docker.png",
];

const benefits = [
    "Competitive compensation packages",
    "Remote-friendly work culture",
    "Flexible work hours",
    "Learning & development budget",
    "Production-grade project exposure",
    "Responsive hiring process",
];

export default function CulturePage() {
    return (
        <PageShell>
            <div className="border-b border-[var(--career-border)] bg-[var(--career-bg-subtle)]">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <SectionHeading
                        title="Life at"
                        highlight="DigiCraft"
                        subtitle="We hire people who communicate clearly, ship responsibly, and care about the details."
                    />
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <section className="mb-20">
                    <h2 className="mb-8 text-xl font-medium text-[var(--career-text)]">
                        Benefits & perks
                    </h2>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit}
                                className="career-card px-5 py-4 text-sm text-[var(--career-text-muted)]"
                            >
                                {benefit}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="mb-8 text-xl font-medium text-[var(--career-text)]">
                        Leadership & team
                    </h2>
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
                        {team.map((member) => (
                            <div
                                key={member.name}
                                className="career-card p-4 text-center"
                            >
                                <div className="relative mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full border border-[var(--career-border)]">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className="text-sm font-medium text-[var(--career-text)]">
                                    {member.name}
                                </h3>
                                <p className="text-xs text-[var(--career-text-muted)]">
                                    {member.role}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="mb-8 text-xl font-medium text-[var(--career-text)]">
                        Technology we use
                    </h2>
                    <div className="career-card p-8">
                        <div className="flex flex-wrap justify-center gap-8">
                            {techStack.map((tech) => (
                                <div
                                    key={tech}
                                    className="relative h-14 w-14 opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                                >
                                    <Image
                                        src={`/tech/${tech}`}
                                        alt={tech}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="career-section-alt -mx-4 rounded-none border-x-0 px-4 py-12 text-center sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <h2 className="mb-3 text-2xl font-normal text-[var(--career-text)]">
                        Explore open roles
                    </h2>
                    <p className="mb-6 text-[var(--career-text-muted)]">
                        See where your skills fit and apply directly online.
                    </p>
                    <Link href="/jobs" className="career-btn-primary">
                        View open roles
                        <FiArrowRight />
                    </Link>
                </div>
            </div>
        </PageShell>
    );
}
