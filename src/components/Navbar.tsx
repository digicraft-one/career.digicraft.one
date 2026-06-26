"use client";

import DigiCraftLogo from "@/components/shared/DigiCraftLogo";
import { DIGICRAFT_LOGO_PATH } from "@/lib/branding";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Open roles", path: "/jobs" },
    { name: "Culture", path: "/culture" },
];

const productDropdownItems = [
    {
        name: "DigiCraft",
        href: "https://digicraft.one",
        logo: DIGICRAFT_LOGO_PATH,
    },
    {
        name: "Marketplace",
        href: "https://marketplace.digicraft.one",
        logo: "https://marketplace.digicraft.one/logo.svg",
    },
    {
        name: "Media",
        href: "https://media.digicraft.one",
        logo: "https://media.digicraft.one/logo.svg",
    },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const productButtonRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        const handleScroll = () => setIsScrolled(window.scrollY > 8);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMounted]);

    useEffect(() => {
        if (!isMounted) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (
                productButtonRef.current &&
                !productButtonRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isMounted]);

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname.startsWith(path);
    };

    const linkClass = (path: string) =>
        `text-sm font-medium transition-colors ${
            isActive(path)
                ? "text-[var(--career-text)]"
                : "text-[var(--career-text-muted)] hover:text-[var(--career-text)]"
        }`;

    return (
        <nav
            className={`sticky top-0 z-50 w-full border-b bg-white transition-shadow ${
                isScrolled
                    ? "border-[var(--career-border)] shadow-sm"
                    : "border-transparent"
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2.5">
                            <DigiCraftLogo size={36} priority />
                            <div className="leading-tight hidden sm:block">
                                <p className="text-sm font-semibold text-[var(--career-text)] leading-none">
                                    DigiCraft
                                </p>
                                <p className="text-[11px] font-medium text-purple-600 leading-none mt-0.5">
                                    Careers
                                </p>
                            </div>
                        </Link>
                        <div className="relative">
                            <div
                                onClick={() =>
                                    isMounted &&
                                    setIsDropdownOpen((prev) => !prev)
                                }
                                ref={productButtonRef}
                            >
                                <button
                                    title="DigiCraft Products"
                                    className="hidden items-center justify-center gap-1 rounded-md border border-[var(--career-border)] px-3 py-1.5 text-sm text-[var(--career-text-muted)] transition-colors hover:bg-[var(--career-bg-subtle)] hover:text-[var(--career-text)] md:flex"
                                >
                                    Products
                                    <ChevronDownIcon
                                        className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                                    />
                                </button>
                            </div>
                            {isMounted && isDropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute left-0 z-50 mt-2 w-48 rounded-lg border border-[var(--career-border)] bg-white py-1 shadow-lg"
                                >
                                    <ul>
                                        {productDropdownItems.map((item) => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--career-text-muted)] transition-colors hover:bg-[var(--career-bg-subtle)] hover:text-[var(--career-text)]"
                                                    onClick={() =>
                                                        setIsDropdownOpen(false)
                                                    }
                                                >
                                                    <Image
                                                        src={item.logo}
                                                        alt={item.name}
                                                        width={20}
                                                        height={20}
                                                        className={`h-5 w-5 object-contain ${item.name === "DigiCraft" ? "rounded-full" : ""}`}
                                                    />
                                                    <span className="font-medium">
                                                        {item.name}
                                                    </span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="hidden items-center gap-8 lg:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={linkClass(item.path)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <button
                            onClick={() => router.push("/jobs")}
                            className="career-btn-primary !px-4 !py-2"
                        >
                            View open roles
                        </button>
                    </div>

                    <button
                        className="p-2 lg:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        <div
                            className={`mb-1.5 h-0.5 w-6 bg-[var(--career-text)] transition-all ${
                                isOpen ? "translate-y-2 rotate-45" : ""
                            }`}
                        />
                        <div
                            className={`mb-1.5 h-0.5 w-6 bg-[var(--career-text)] transition-all ${
                                isOpen ? "opacity-0" : ""
                            }`}
                        />
                        <div
                            className={`h-0.5 w-6 bg-[var(--career-text)] transition-all ${
                                isOpen ? "-translate-y-2 -rotate-45" : ""
                            }`}
                        />
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="border-t border-[var(--career-border)] bg-white lg:hidden">
                    <div className="space-y-1 px-4 py-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`block rounded-md px-3 py-2.5 ${linkClass(item.path)}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                router.push("/jobs");
                            }}
                            className="mt-2 w-full career-btn-primary"
                        >
                            View open roles
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
