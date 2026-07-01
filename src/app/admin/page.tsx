import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authOptions } from "@/lib/auth/options";
import { connectToDB } from "@/lib/db/mongoose";
import { Application } from "@/schemas/Application";
import { Job } from "@/schemas/Job";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/hiring/constants";
import { collectUpcomingInterviews } from "@/lib/hiring/upcomingInterviews";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getStats() {
    await connectToDB();
    const [jobs, applications, allForInterviews] = await Promise.all([
        Job.find({}).sort({ createdAt: -1 }).lean(),
        Application.find({}).sort({ createdAt: -1 }).limit(5).lean(),
        Application.find({}).select("interviews status jobTitle name email phone").lean(),
    ]);

    const allApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({
        status: { $in: ["pending", "under_review"] },
    });

    const upcomingInterviews = collectUpcomingInterviews(
        allForInterviews as Parameters<typeof collectUpcomingInterviews>[0]
    ).length;

    return {
        totalJobs: jobs.length,
        publishedJobs: jobs.filter((j) => j.status === "published").length,
        totalApplications: allApplications,
        pendingApplications,
        upcomingInterviews,
        recentApplications: applications,
    };
}

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const stats = await getStats();

    const statItems = [
        {
            label: "Jobs",
            value: stats.totalJobs,
            href: "/admin/jobs",
        },
        {
            label: "Published",
            value: stats.publishedJobs,
            href: "/admin/jobs",
            accent: "text-green-600",
        },
        {
            label: "Applications",
            value: stats.totalApplications,
            href: "/admin/applications",
        },
        {
            label: "Pending review",
            value: stats.pendingApplications,
            href: "/admin/applications",
            accent: "text-amber-600",
        },
        {
            label: "Interviews",
            value: stats.upcomingInterviews,
            href: "/admin/interviews",
            accent: "text-indigo-600",
        },
    ];

    return (
        <div className="space-y-5">
            <AdminPageHeader
                title="Dashboard"
                description={`Welcome back${session.user?.name ? `, ${session.user.name}` : ""}`}
            />

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {statItems.map((item) => (
                    <Link key={item.label} href={item.href}>
                        <Card className="bg-white hover:shadow-sm transition-shadow h-full">
                            <CardContent className="p-3">
                                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                                    {item.label}
                                </p>
                                <p
                                    className={`text-xl font-bold mt-0.5 ${item.accent ?? "text-slate-900"}`}
                                >
                                    {item.value}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {stats.recentApplications.length > 0 && (
                <Card className="bg-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <h2 className="text-sm font-semibold text-slate-900">
                                Recent applications
                            </h2>
                            <Link href="/admin/applications">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-purple-700"
                                >
                                    View all
                                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                                </Button>
                            </Link>
                        </div>
                        <ul className="divide-y divide-slate-100">
                            {stats.recentApplications.map((app) => (
                                <li key={String(app._id)}>
                                    <Link
                                        href="/admin/applications"
                                        className="flex items-center justify-between gap-3 py-2 hover:bg-slate-50 -mx-2 px-2 rounded-md transition-colors"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">
                                                {app.name}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {app.jobTitle}
                                            </p>
                                        </div>
                                        <span
                                            className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                                STATUS_COLORS[
                                                    app.status as keyof typeof STATUS_COLORS
                                                ] ??
                                                "bg-slate-100 text-slate-700"
                                            }`}
                                        >
                                            {STATUS_LABELS[
                                                app.status as keyof typeof STATUS_LABELS
                                            ] ?? app.status}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
