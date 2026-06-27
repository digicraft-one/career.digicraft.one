"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/hiring/constants";
import { Application } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Briefcase, Eye, Mail, Phone } from "lucide-react";

const STATUS_COLORS_MAP = STATUS_COLORS;

interface ApplicationCardProps {
    app: Application;
    onViewDetails: () => void;
}

export default function ApplicationCard({
    app,
    onViewDetails,
}: ApplicationCardProps) {
    return (
        <Card className="bg-white/90 hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">
                            {app.name}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                            <Briefcase className="w-3 h-3 shrink-0" />
                            {app.jobTitle}
                        </p>
                    </div>
                    <Badge
                        className={`shrink-0 text-[10px] ${STATUS_COLORS_MAP[app.status] ?? "bg-slate-100 text-slate-700"}`}
                    >
                        {STATUS_LABELS[app.status] ?? app.status}
                    </Badge>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                        {app.email}
                    </p>
                    <p className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 shrink-0 text-slate-400" />
                        {app.phone}
                    </p>
                </div>

                <p className="text-[11px] text-slate-400">
                    Applied{" "}
                    {formatDistanceToNow(new Date(app.createdAt), {
                        addSuffix: true,
                    })}
                </p>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-purple-700 border-purple-200 hover:bg-purple-50"
                    onClick={onViewDetails}
                >
                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                    View details
                </Button>
            </CardContent>
        </Card>
    );
}
