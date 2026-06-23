"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

interface PageShellProps {
    children: ReactNode;
    noTopPadding?: boolean;
    showFooter?: boolean;
}

export default function PageShell({
    children,
    noTopPadding = false,
    showFooter = true,
}: PageShellProps) {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className={noTopPadding ? "" : "pt-0"}>{children}</main>
            {showFooter && <Footer />}
        </div>
    );
}
