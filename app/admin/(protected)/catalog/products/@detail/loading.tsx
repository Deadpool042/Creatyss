import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
      {/* Nav tabs skeleton */}
      <div className="flex gap-2 border-b border-surface-border pb-3">
        <Skeleton className="h-7 w-16 rounded-md" />
        <Skeleton className="h-7 w-16 rounded-md" />
        <Skeleton className="h-7 w-14 rounded-md" />
        <Skeleton className="h-7 w-12 rounded-md" />
      </div>

      {/* Header skeleton */}
      <div className="grid gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Form sections skeleton */}
      <div className="grid gap-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    </div>
  );
}
