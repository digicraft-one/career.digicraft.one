"use client";

import PageShell from "@/components/PageShell";
import SectionHeading from "@/components/SectionHeading";
import TechIcon from "@/components/TechIcon";
import { TECH_STACK, TECH_STACK_STATS } from "@/lib/techStack";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FiArrowRight } from "react-icons/fi";

const benefits = [
    "Competitive compensation packages",
    "Remote-friendly work culture",
    "Flexible work hours",
    "Learning & development budget",
    "Production-grade project exposure",
    "Responsive hiring process",
];

export default function CulturePage() {
    const [activeCategory, setActiveCategory] = useState<string>("all");

    const visibleCategories = useMemo(() => {
        if (activeCategory === "all") return TECH_STACK;
        return TECH_STACK.filter((cat) => cat.id === activeCategory);
    }, [activeCategory]);

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
                    <h2 className="mb-3 text-xl font-medium text-[var(--career-text)]">
                        Technology we use
                    </h2>
                    <p className="mb-4 max-w-2xl text-sm text-[var(--career-text-muted)]">
                        The same stack we use across DigiCraft products —{" "}
                        {TECH_STACK_STATS.domains} domains and{" "}
                        {TECH_STACK_STATS.technologies}+ technologies from AI and
                        data to mobile, cloud, and web.
                    </p>
                    <p className="mb-8 text-sm">
                        <a
                            href="https://digicraft.one/tech-stack"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="career-link font-medium"
                        >
                            View full stack on digicraft.one →
                        </a>
                    </p>

                    <div className="mb-10 flex flex-wrap justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveCategory("all")}
                            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                                activeCategory === "all"
                                    ? "border-[var(--career-text)] bg-[var(--career-text)] text-white"
                                    : "border-[var(--career-border)] bg-white text-[var(--career-text-muted)] hover:bg-[var(--career-bg-subtle)]"
                            }`}
                        >
                            All domains
                        </button>
                        {TECH_STACK.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setActiveCategory(category.id)}
                                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                                    activeCategory === category.id
                                        ? "border-[var(--career-text)] bg-[var(--career-text)] text-white"
                                        : "border-[var(--career-border)] bg-white text-[var(--career-text-muted)] hover:bg-[var(--career-bg-subtle)]"
                                }`}
                            >
                                {category.category}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-12">
                        {visibleCategories.map((group) => (
                            <div key={group.id} id={`tech-${group.id}`}>
                                <h3 className="mb-1 text-base font-medium text-[var(--career-text)]">
                                    {group.category}
                                </h3>
                                <p className="mb-5 text-sm text-[var(--career-text-muted)]">
                                    {group.description}
                                </p>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                    {group.techs.map((tech) => (
                                        <div
                                            key={tech.name}
                                            className="career-card flex flex-col items-center gap-2 p-4 text-center"
                                        >
                                            <TechIcon
                                                name={tech.name}
                                                icon={tech.icon}
                                                size={40}
                                            />
                                            <span className="text-xs font-medium leading-tight text-[var(--career-text)]">
                                                {tech.name}
                                            </span>
                                            {tech.description && (
                                                <span className="line-clamp-2 text-[10px] leading-snug text-[var(--career-text-subtle)]">
                                                    {tech.description}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="career-section-alt -mx-4 rounded-none border-x-0 px-4 py-12 text-center sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <h2 className="mb-3 text-2xl font-normal text-[var(--career-text)]">
                        Explore open roles
                    </h2>
                    <p className="mb-6 text-[var(--career-text-muted)]">
                        See where your skills fit and apply directly online.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link href="/jobs" className="career-btn-primary">
                            View open roles
                            <FiArrowRight />
                        </Link>
                        <Link href="/about" className="career-btn-secondary">
                            About the company
                        </Link>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
