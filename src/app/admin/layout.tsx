import AdminShell from "@/components/admin/AdminShell";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen text-neutral-950 antialiased [color-scheme:light] [&_input]:text-neutral-950 [&_textarea]:text-neutral-950 [&_textarea]:placeholder:text-slate-500 [&_input]:placeholder:text-slate-500">
            <AdminShell>{children}</AdminShell>
        </div>
    );
}
