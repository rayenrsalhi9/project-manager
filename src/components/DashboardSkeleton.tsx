import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export default function DashboardSkeleton() {
  return (
    <section className="w-full pt-4 px-8">
      {/* Header section skeleton */}
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Projects grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Create 6 skeleton cards to simulate a typical project layout */}
        {[...Array(6)].map((_, index) => (
          <div key={index} className="rounded-lg border border-gray-200 p-6 space-y-4">
            {/* Card header skeleton */}
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-6 w-32 flex-1" />
              <Skeleton className="h-5 w-12" />
            </div>
            
            {/* Card content skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}