import { Skeleton } from "@/components/skeletons/Skeleton";
import PageShell from "@/components/PageShell";

export function JobDetailSkeleton() {
    return (
        <PageShell>
            <div className="border-b border-[var(--career-border)] bg-[var(--career-bg-subtle)]">
                <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                    <Skeleton className="mb-6 h-4 w-36" />
                    <Skeleton className="mb-4 h-6 w-28 rounded-md" />
                    <Skeleton className="mb-6 h-10 w-2/3 max-w-lg" />
                    <div className="flex flex-wrap gap-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="space-y-10">
                    <div className="space-y-3">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-6 w-36" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
                <Skeleton className="mt-12 h-11 w-48 rounded-md" />
            </div>
        </PageShell>
    );
}

export function ApplicationFormSkeleton() {
    return (
        <PageShell>
            <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
                <Skeleton className="mb-6 h-4 w-40" />
                <div className="career-card p-6 md:p-10">
                    <Skeleton className="mb-2 h-4 w-24" />
                    <Skeleton className="mb-8 h-8 w-2/3" />
                    <div className="mb-8 flex gap-2">
                        <Skeleton className="h-10 flex-1 rounded-md" />
                        <Skeleton className="h-10 flex-1 rounded-md" />
                        <Skeleton className="h-10 flex-1 rounded-md" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-between">
                        <Skeleton className="h-11 w-28 rounded-md" />
                        <Skeleton className="h-11 w-24 rounded-md" />
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
