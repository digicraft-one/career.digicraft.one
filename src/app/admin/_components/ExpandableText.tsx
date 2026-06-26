"use client";

import { useState } from "react";

interface ExpandableTextProps {
    label: string;
    text: string;
    collapsedLines?: number;
    minCharsToCollapse?: number;
}

export default function ExpandableText({
    label,
    text,
    collapsedLines = 3,
    minCharsToCollapse = 120,
}: ExpandableTextProps) {
    const [expanded, setExpanded] = useState(false);
    const trimmed = text?.trim() || "";
    const collapsible =
        trimmed.length > minCharsToCollapse ||
        trimmed.split("\n").length > collapsedLines;

    if (!trimmed) {
        return (
            <div>
                <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
                <p className="text-sm text-slate-400">—</p>
            </div>
        );
    }

    return (
        <div>
            <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
            <p
                className={`text-sm text-slate-700 whitespace-pre-wrap break-words ${
                    collapsible && !expanded ? `line-clamp-${collapsedLines}` : ""
                }`}
                style={
                    collapsible && !expanded
                        ? {
                              display: "-webkit-box",
                              WebkitLineClamp: collapsedLines,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                          }
                        : undefined
                }
            >
                {trimmed}
            </p>
            {collapsible && (
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="mt-1 text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline"
                >
                    {expanded ? "Show less" : "Show more"}
                </button>
            )}
        </div>
    );
}
