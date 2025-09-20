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
    <section className="min-h-screen pt-4 px-8">
      <div className="max-w-2xl rounded-lg space-y-4">
        {/* Skeleton for the welcome heading */}
        <Skeleton className="h-10 w-64" />
        {/* Skeleton for the email */}
        <Skeleton className="h-6 w-48" />
      </div>
    </section>
  )
}