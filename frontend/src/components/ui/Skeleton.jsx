import { cn } from "../../utils/cn.js";

export const Skeleton = ({ className }) => (
  <div
    className={cn(
      "animate-pulse rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]",
      className
    )}
  />
);

export const JobCardSkeleton = () => (
  <div className="panel space-y-4 p-5">
    <div className="flex gap-3">
      <Skeleton className="h-11 w-11 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-5/6" />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <div className="flex justify-between pt-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-9 w-24 rounded-lg" />
    </div>
  </div>
);

export const JobGridSkeleton = ({ count = 6 }) => (
  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <JobCardSkeleton key={i} />
    ))}
  </div>
);

export default Skeleton;
