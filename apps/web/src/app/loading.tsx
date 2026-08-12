import { Skeleton } from "@coffee-daily/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container flex min-h-[calc(100vh-var(--cd-header-h))] flex-col gap-6 py-16">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="aspect-square" />
        <Skeleton className="aspect-square" />
        <Skeleton className="aspect-square" />
      </div>
    </div>
  );
}
