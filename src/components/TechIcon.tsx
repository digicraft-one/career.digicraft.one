"use client";

import { useState } from "react";
import Image from "next/image";

interface TechIconProps {
    name: string;
    icon: string;
    size?: number;
}

export default function TechIcon({ name, icon, size = 48 }: TechIconProps) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <div
                className="flex items-center justify-center rounded-md border border-[var(--career-border)] bg-[var(--career-bg-subtle)] text-xs font-semibold uppercase text-[var(--career-text-muted)]"
                style={{ width: size, height: size }}
                title={name}
            >
                {name.slice(0, 2)}
            </div>
        );
    }

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <Image
                src={icon}
                alt={name}
                fill
                className="object-contain"
                onError={() => setFailed(true)}
            />
        </div>
    );
}
