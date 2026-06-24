import PageShell from "@/components/PageShell";
import SectionHeading from "@/components/SectionHeading";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn about DigiCraft Innovation Private Limited — our company profile, registration details, and founder Ayush Kumar Singh.",
};

const companyFacts = [
    {
        label: "Legal name",
        value: "DigiCraft Innovation Private Limited",
        note: "Registered private limited company",
    },
    {
        label: "CIN",
        value: "U62010UP2026PTC241890",
        note: "Corporate Identification Number",
    },
    {
        label: "GST",
        value: "09AAMCD3672L1Z2",
        note: "Goods and Services Tax registration",
    },
    {
        label: "PAN",
        value: "AAMCD3672L",
        note: "Permanent Account Number",
    },
];

const founder = {
    name: "Ayush Kumar Singh",
    role: "Founder & CEO",
    image: "/team/ayush.png",
    bio: "Ayush Kumar Singh founded DigiCraft with a focus on building reliable web, mobile, and cloud products for businesses. With over five years in software development, he leads product direction, engineering standards, and client delivery across the DigiCraft platform ecosystem.",
    expertise: [
        "Full-stack development",
        "Cloud architecture",
        "System design",
        "Product engineering",
        "Team leadership",
    ],
};

export default function AboutPage() {
    return (
        <PageShell>
            <div className="border-b border-[var(--career-border)] bg-[var(--career-bg-subtle)]">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <SectionHeading
                        title="About"
                        highlight="DigiCraft"
                        subtitle="DigiCraft Innovation Private Limited builds production-grade digital products for startups and growing businesses."
                    />
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <section className="mb-20 max-w-3xl">
                    <h2 className="mb-6 text-xl font-medium text-[var(--career-text)]">
                        Company profile
                    </h2>
                    <div className="space-y-4 text-[var(--career-text-muted)] leading-relaxed">
                        <p>
                            <strong className="font-medium text-[var(--career-text)]">
                                DigiCraft Innovation Private Limited
                            </strong>{" "}
                            is a technology company focused on custom software
                            development, product engineering, and digital
                            infrastructure. We design and ship web applications,
                            mobile experiences, and cloud-backed platforms used in
                            production by real customers.
                        </p>
                        <p>
                            Through DigiCraft and its product ecosystem — including
                            marketplace and media platforms — we help businesses
                            launch faster, operate reliably, and scale with clear
                            engineering practices. Our work spans frontend and
                            backend development, APIs, databases, DevOps, and
                            UI/UX implementation.
                        </p>
                        <p>
                            DigiCraft is headquartered in India and works with
                            clients and collaborators remotely. We value clear
                            communication, accountable delivery, and long-term
                            product quality over short-term shortcuts.
                        </p>
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="mb-8 text-xl font-medium text-[var(--career-text)]">
                        Registration & legal details
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {companyFacts.map((fact) => (
                            <div key={fact.label} className="career-card p-6">
                                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--career-text-subtle)]">
                                    {fact.label}
                                </p>
                                <p className="font-medium text-[var(--career-text)]">
                                    {fact.value}
                                </p>
                                <p className="mt-1 text-sm text-[var(--career-text-muted)]">
                                    {fact.note}
                                </p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-sm text-[var(--career-text-subtle)]">
                        Official certificates and documents are available upon
                        request for verification purposes.
                    </p>
                </section>

                <section className="mb-20">
                    <h2 className="mb-8 text-xl font-medium text-[var(--career-text)]">
                        Founder
                    </h2>
                    <div className="career-card flex flex-col gap-8 p-8 md:flex-row md:items-start">
                        <div className="relative mx-auto h-40 w-40 shrink-0 overflow-hidden rounded-full border border-[var(--career-border)] md:mx-0">
                            <Image
                                src={founder.image}
                                alt={founder.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-medium text-[var(--career-text)]">
                                {founder.name}
                            </h3>
                            <p className="mb-4 text-sm text-[var(--career-text-muted)]">
                                {founder.role}
                            </p>
                            <p className="mb-6 leading-relaxed text-[var(--career-text-muted)]">
                                {founder.bio}
                            </p>
                            <div>
                                <p className="mb-3 text-sm font-medium text-[var(--career-text)]">
                                    Areas of focus
                                </p>
                                <ul className="flex flex-wrap justify-center gap-2 md:justify-start">
                                    {founder.expertise.map((item) => (
                                        <li
                                            key={item}
                                            className="career-badge"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="career-section-alt -mx-4 rounded-none border-x-0 px-4 py-12 text-center sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <h2 className="mb-3 text-2xl font-normal text-[var(--career-text)]">
                        Work with us
                    </h2>
                    <p className="mb-6 text-[var(--career-text-muted)]">
                        Explore open roles or learn more about our culture and
                        benefits.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link href="/jobs" className="career-btn-primary">
                            View open roles
                            <FiArrowRight />
                        </Link>
                        <Link href="/culture" className="career-btn-secondary">
                            Life at DigiCraft
                        </Link>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
