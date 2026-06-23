import { Skeleton } from "@/components/skeletons/Skeleton";

export function JobCardSkeleton() {
    return (
        <div className="career-card p-6">
            <div className="mb-3 flex justify-between">
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="mb-3 h-6 w-3/4" />
            <div className="mb-4 flex flex-wrap gap-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="mb-4 h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
    );
}

export function JobsGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <JobCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function JobsFiltersSkeleton() {
    return (
        <div className="mb-10 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_11rem_11rem]">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
        </div>
    );
}

export function JobsPageSkeleton() {
    return (
        <>
            <div className="mb-12 space-y-3">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-5 w-96 max-w-full" />
            </div>
            <JobsFiltersSkeleton />
            <JobsGridSkeleton count={6} />
        </>
    );
}
