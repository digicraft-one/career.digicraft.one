"use client";

import DigiCraftLogo from "@/components/shared/DigiCraftLogo";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
    Briefcase,
    ExternalLink,
    FileUser,
    LayoutDashboard,
    LogOut,
    Menu,
    Plus,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

const NAV = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
    {
        href: "/admin/applications",
        label: "Applications",
        icon: FileUser,
    },
];

function isActive(pathname: string, href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
}

function LogoutSidebarButton() {
    return (
        <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
            <LogOut className="h-4 w-4" />
            Log out
        </button>
    );
}

export default function AdminShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const sidebar = (
        <div className="flex h-full flex-col">
            <div className="px-4 py-5 border-b border-slate-800">
                <Link
                    href="/admin"
                    className="flex items-center gap-3"
                    onClick={() => setMobileOpen(false)}
                >
                    <DigiCraftLogo size={32} priority />
                    <div>
                        <p className="text-sm font-semibold text-white leading-none">
                            DigiCraft
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Careers Admin
                        </p>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-2 py-3 space-y-0.5">
                {NAV.map((item) => {
                    const active = isActive(pathname, item.href, item.exact);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                active
                                    ? "bg-purple-600 text-white"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-slate-800 space-y-2">
                <Link
                    href="/admin/jobs/new"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium py-2 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Post job
                </Link>
                <Link
                    href="/"
                    target="_blank"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-sm font-medium py-2 transition-colors"
                >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View careers site
                </Link>
                <LogoutSidebarButton />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100 flex">
            <aside className="hidden lg:flex w-56 shrink-0 bg-slate-900 flex-col fixed inset-y-0 left-0 z-30">
                {sidebar}
            </aside>

            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-56 bg-slate-900 transform transition-transform lg:hidden",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-4 right-3 text-slate-400 hover:text-white"
                    aria-label="Close menu"
                >
                    <X className="h-5 w-5" />
                </button>
                {sidebar}
            </aside>

            <div className="flex-1 lg:pl-56 flex flex-col min-h-screen min-w-0">
                <header className="lg:hidden sticky top-0 z-20 flex items-center gap-3 bg-white border-b border-slate-200 px-4 py-2.5">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <DigiCraftLogo size={28} />
                    <span className="font-semibold text-slate-900 text-sm">
                        Careers Admin
                    </span>
                </header>
                <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
