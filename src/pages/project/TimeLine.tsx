import type { TimelineType } from "@/hooks/useTimeline"
import { useTimeline } from "@/hooks/useTimeline"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Users, UserPlus, FolderPlus } from "lucide-react"
import { cn } from "@/lib/utils"

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

function TimelineSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Timeline items skeleton */}
      <div className="space-y-3">
        {[...Array(2)].map((_, index) => (
          <Card key={index} className="border border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Avatar skeleton */}
                <Skeleton className="h-10 w-10 rounded-full" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  
                  {/* Content skeleton */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function TimeLine() {

  const {projectTimeline, loading, error} = useTimeline()

  if (error) throw error
  if(loading) return <TimelineSkeleton />

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return `Just now`
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
    }
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`
    }
    
    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`
    }
    
    const diffInYears = Math.floor(diffInDays / 365)
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`
  }

  const getIcon = (type: TimelineType["type"]) => {
    switch (type) {
      case "member_joined":
        return <UserPlus className="h-4 w-4" />
      case "project_created":
        return <FolderPlus className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const highlightUsername = (content: TimelineType['content']) => {
    const pattern = /^"?([^"]+?)\s+((?:joined|created|left|updated|modified)\s+(?:the\s+)?project[^"]*)/i;
  
    const match = content.trim().match(pattern);
    
    if (!match) {
      // Return original content if no match found
      return content;
    }
    
    const username = match[1];
    const actionPart = match[2];

    return(
      <>
        <span className="font-semibold">{username}</span>{" "}
        <span className="text-muted-foreground">{actionPart}</span>
      </>
    )
  }

  if (projectTimeline.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Project Timeline</h1>
          <p className="text-gray-600">Track the progress and updates of your project</p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">No timeline updates yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Project Updates</h2>
      </div>

      <div className="space-y-3">
        {projectTimeline.map((item) => (
          <Card key={item.id} className="border border-border bg-card hover:bg-accent/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border-2 border-border">
                  <AvatarImage src="/placeholder.svg" alt="user avatar" />
                  <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                    AU
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 rounded-full bg-muted">{getIcon(item.type)}</div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(item.created_at)}
                    </span>
                  </div>

                  <div className="text-sm leading-relaxed">
                    {highlightUsername(item.content)}
                  </div>
                  
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">{"That's all the recent updates"}</p>
      </div>
    </div>
  )
}
