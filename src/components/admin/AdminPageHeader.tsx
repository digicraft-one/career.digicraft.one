import { ReactNode } from "react";

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

export default function AdminPageHeader({
    title,
    description,
    action,
}: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div className="min-w-0">
                <h1 className="text-xl font-bold text-slate-900 truncate">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-slate-500 mt-0.5">{description}</p>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
