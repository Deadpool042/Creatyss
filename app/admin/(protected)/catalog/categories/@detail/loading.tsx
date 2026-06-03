import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryDetailLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
      {/* Header skeleton */}
      <div className="grid gap-2">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Main form section skeleton */}
      <div className="rounded-3xl border border-surface-border bg-card p-5 shadow-card sm:p-6">
        <div className="grid gap-5">
          {/* Section header */}
          <div className="grid gap-1.5">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>

          {/* Fields */}
          <div className="grid gap-5">
            <div className="grid gap-1.5">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div className="grid gap-1.5">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div className="grid gap-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
            <Skeleton className="h-5 w-32" />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </div>
      </div>

      {/* Image section skeleton */}
      <div className="rounded-3xl border border-surface-border bg-card p-5 shadow-card sm:p-6">
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
