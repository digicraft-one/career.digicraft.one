import Link from "next/link";
import {
    FaGithub,
    FaLinkedinIn,
    FaInstagram,
    FaWhatsapp,
    FaEnvelope,
} from "react-icons/fa";

const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Open roles", path: "/jobs" },
    { name: "Culture", path: "/culture" },
    { name: "DigiCraft", path: "https://digicraft.one" },
    { name: "Marketplace", path: "https://marketplace.digicraft.one" },
    { name: "Contact", path: "https://digicraft.one/contact" },
];

const perks = [
    "Competitive compensation",
    "Remote-friendly culture",
    "Learning & growth budget",
    "Flexible work hours",
    "Modern product stack",
    "Collaborative team",
];

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-[var(--career-border)] bg-[var(--career-bg-subtle)]">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <Link
                            href="/"
                            className="mb-4 block text-lg font-medium text-[var(--career-text)]"
                        >
                            DigiCraft Careers
                        </Link>
                        <p className="mb-4 text-sm leading-relaxed text-[var(--career-text-muted)]">
                            Join us in building digital products that are
                            reliable, thoughtful, and built to last.
                        </p>
                        <p className="text-sm text-[var(--career-text-subtle)]">
                            DigiCraft Innovation Private Limited
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-[var(--career-text)]">
                            Quick links
                        </h3>
                        <ul className="space-y-2.5">
                            {quickLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.path}
                                        className="text-sm text-[var(--career-text-muted)] transition-colors hover:text-[var(--career-accent)]"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-[var(--career-text)]">
                            Why join us
                        </h3>
                        <ul className="mb-6 space-y-2.5">
                            {perks.map((perk) => (
                                <li
                                    key={perk}
                                    className="text-sm text-[var(--career-text-muted)]"
                                >
                                    {perk}
                                </li>
                            ))}
                        </ul>
                        <div className="flex gap-4">
                            {[
                                {
                                    href: "https://github.com/digicraft-one",
                                    icon: FaGithub,
                                },
                                {
                                    href: "https://www.linkedin.com/company/digicraft-tech",
                                    icon: FaLinkedinIn,
                                },
                                {
                                    href: "https://www.instagram.com/digicraft_technologies",
                                    icon: FaInstagram,
                                },
                                {
                                    href: "https://api.whatsapp.com/send/?phone=%2B918299797516",
                                    icon: FaWhatsapp,
                                },
                                {
                                    href: "mailto:hello@digicraft.one",
                                    icon: FaEnvelope,
                                },
                            ].map(({ href, icon: Icon }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--career-text-subtle)] transition-colors hover:text-[var(--career-text)]"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--career-border)] pt-8 text-sm text-[var(--career-text-subtle)] md:flex-row">
                    <p>
                        © {new Date().getFullYear()} DigiCraft Innovation
                        Private Limited. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a
                            href="https://digicraft.one/privacy-policy"
                            className="transition-colors hover:text-[var(--career-text)]"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="https://digicraft.one/terms"
                            className="transition-colors hover:text-[var(--career-text)]"
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
