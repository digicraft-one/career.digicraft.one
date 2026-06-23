import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://career.digicraft.one";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "DigiCraft Careers",
        template: "%s | DigiCraft Careers",
    },
        description:
        "Explore career opportunities at DigiCraft. Join our team building reliable, production-grade digital products.",
    openGraph: {
        title: "DigiCraft Careers",
        description: "Build the future with DigiCraft",
        url: siteUrl,
        siteName: "DigiCraft Careers",
        images: [{ url: "/preview.png" }],
    },
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen antialiased`}>
                <Providers>
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
