"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function CareerHero() {
    return (
        <section className="border-b border-[var(--career-border)] bg-[var(--career-bg-subtle)]">
            <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
                <div className="max-w-3xl">
                    <p className="mb-4 text-sm font-medium uppercase tracking-wider text-[var(--career-text-muted)]">
                        DigiCraft Careers
                    </p>
                    <h1 className="mb-6 text-4xl font-normal leading-tight tracking-tight text-[var(--career-text)] sm:text-5xl lg:text-6xl">
                        Build products that matter. Grow with a team that ships.
                    </h1>
                    <p className="mb-10 max-w-2xl text-lg leading-relaxed text-[var(--career-text-muted)]">
                        We hire engineers, designers, and builders who care about
                        craft, clarity, and impact. Explore open roles and find
                        where you fit.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link href="/jobs" className="career-btn-primary">
                            View open roles
                            <FiArrowRight />
                        </Link>
                        <Link href="/culture" className="career-btn-secondary">
                            Life at DigiCraft
                        </Link>
                        <Link href="/about" className="career-btn-secondary">
                            About the company
                        </Link>
                    </div>
                    <div className="hero-badges mt-12">
                        <span className="career-badge">Remote-friendly</span>
                        <span className="career-badge">Growth-focused</span>
                        <span className="career-badge">Product-driven</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
