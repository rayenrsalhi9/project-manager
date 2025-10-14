import { useAuth } from "@/context/AuthContext"
import { Link, useSearchParams } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/supabase"
import {format} from "date-fns"
import { cn } from "@/lib/utils"

import DashboardSkeleton from "@/components/DashboardSkeleton"
import EmptyState from "@/components/EmptyState"
import CreateProjectDialog from "@/components/dialogs/CreateProjectDialog"
import JoinProjectDialog from "@/components/dialogs/JoinProjectDialog"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, ArrowRight } from "lucide-react"

type UserProject = {
  id: string
  name: string
  description: string
  created_at: string
  role: string
}

export default function Dashboard() {

  const { user, session } = useAuth()
  const [searchParams] = useSearchParams()

  const [userProjects, setUserProjects] = useState<UserProject[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const filter = searchParams.get('filter') || 'all'

  // Fetch user projects
  async function getUserProjects(userId: string) {
    try {
      setLoadingProjects(true)
      
      const { data, error } = await supabase
        .rpc('get_user_projects', { user_id_param: userId })
      
      if (error) throw error
      setUserProjects(data || [])

    } catch(err) {
      setError((err as Error).message)
      console.error(`Error fetching projects: ${(err as Error).message}`)
    } finally {
      setLoadingProjects(false)
    }
  }

  useEffect(() => {
    if (!session?.user?.id) return
    getUserProjects(session.user.id)
  }, [session?.user.id])

  const getInitials = (name: string = 'Anonymous User') => {
      return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  
  const filteredProjects = useMemo(() => {
    return userProjects.filter(project => {
      switch (filter) {
        case 'created':
          return project.role[0] === 'admin'
        case 'joined':
          return project.role[0] !== 'admin'
        default:
          return true
      }
    })
  }, [userProjects, filter])

  const createdProjectCount = useMemo(() => {
    return filteredProjects.filter(project => project.role === 'admin').length
  }, [filteredProjects])

  const joinedProjectCount = useMemo(() => {
    return filteredProjects.filter(project => project.role === 'member').length
  }, [filteredProjects])

  if (!session) throw new Error('No active session found. Please login to continue.')
  if (!user) return <DashboardSkeleton />
  if (loadingProjects) return <DashboardSkeleton />
  if (error) throw new Error(error)

  return (
    <section className="py-8 max-w-4xl mx-auto">
      
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <span className="text-lg font-semibold text-primary">
                {getInitials(user?.full_name)}
              </span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
                Welcome back, <span className="text-blue-500">{user?.full_name}</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your projects and collaborations
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <CreateProjectDialog />
            <JoinProjectDialog />
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 mb-8 w-full">
          <Link
            to="?filter=all"
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              filter === "all"
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            All Projects <span className="ml-1 text-xs">{userProjects.length}</span>
          </Link>
          <Link
            to="?filter=created"
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              filter === "created"
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            Created <span className="ml-1 text-xs">{createdProjectCount}</span>
          </Link>
          <Link
            to="?filter=joined"
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              filter === "joined"
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            Joined <span className="ml-1 text-xs">{joinedProjectCount}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredProjects.length === 0 ? (
            <EmptyState />
          ) : (
            filteredProjects.map((project) => (
              <Card key={project.id} className="group border border-border/60 bg-card/50 transition-all duration-300 hover:border-border hover:bg-card hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    {/* Role Badge */}
                    {project.role === 'admin' ? (
                      <Badge variant="default" className="text-xs font-medium px-2.5 py-1">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3 w-3" />
                          Admin
                        </span>
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs font-medium px-2.5 py-1">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3 w-3" />
                          Member
                        </span>
                      </Badge>
                    )}

                    <span className="flex items-center gap-1.5 rounded-full bg-secondary/80 px-2.5 py-1 text-xs text-muted-foreground w-fit">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(project.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>

                  <CardTitle className="text-lg font-semibold text-foreground line-clamp-2 leading-tight flex-1">
                    {project.name}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  {/* Description */}
                  {project.description && (
                    <CardDescription className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </CardDescription>
                  )}

                  <Link to={`./projects/${project.id}`} className="flex items-center justify-center w-fit ml-auto bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-primary/90">
                    View project
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                  
                </CardContent>
              </Card>
            ))
          )}
        </div>

    </section>
  )
}