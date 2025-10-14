import { useAuth } from "@/context/AuthContext"
import { Link, useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { supabase } from "@/supabase"
import type { UserProject } from "@/utils"

import { Button } from "@/components/ui/button"
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

export default function Dashboard() {

  const { user, session } = useAuth()
  const [searchParams] = useSearchParams()

  const [userProjects, setUserProjects] = useState<UserProject[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  
  const filter = searchParams.get('filter') || 'all'

  // Fetch user projects
  async function getUserProjects(userId: string) {
    try {
      setLoadingProjects(true)
      
      const { data, error } = await supabase
        .from('projects')
        .select(
          `
          id,
          name,
          description,
          ...project_members!inner(
          role
          )
          `,
        )
        .eq(
          'project_members.user_id',
          userId
        )
      
      if (error) throw error
      if (data) setUserProjects(data)
    } catch(err) {
      console.error(`Error fetching projects: ${(err as Error).message}`)
    } finally {
      setLoadingProjects(false)
    }
  }

  useEffect(() => {
    if (!session?.user?.id) return
    getUserProjects(session.user.id)
  }, [session?.user.id])
  
  const filteredProjects = userProjects.filter(project => {
    switch (filter) {
      case 'created':
        return project.role[0] === 'admin'
      case 'joined':
        return project.role[0] !== 'admin'
      default:
        return true
    }
  })

  const createdProjectCount = userProjects.filter(project => project.role[0] === 'admin').length
  const joinedProjectCount = userProjects.filter(project => project.role[0] !== 'admin').length

  if (!session) throw new Error('No active session found. Please login to continue.')
  if (!user) return <DashboardSkeleton />
  if (loadingProjects) return <DashboardSkeleton />

  return (
    <section className="py-8 max-w-4xl mx-auto">
      
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
          <h1 className="text-xl sm:text-2xl font-semibold">
            Welcome, <span className="text-blue-500"> {user?.full_name} </span>
          </h1>
          
          <div className="flex gap-2">
            <CreateProjectDialog />
            <JoinProjectDialog />
          </div>
        </div>

        <div className="flex gap-2 mt-12 mb-12 justify-center">
          <Link
            to="?filter=all"
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 px-3 ${
              filter === 'all' 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'border border-input hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            All projects ({userProjects.length})
          </Link>
          <Link
            to="?filter=created"
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 px-3 ${
              filter === 'created' 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'border border-input hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            Created projects ({createdProjectCount})
          </Link>
          <Link
            to="?filter=joined"
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 px-3 ${
              filter === 'joined' 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'border border-input hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            Joined projects ({joinedProjectCount})
          </Link>
        </div>

        

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredProjects.length === 0 ? (
            <EmptyState />
          ) : (
            filteredProjects.map((project, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 relative group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-xl font-semibold flex-1 truncate">
                      {project.name}
                    </CardTitle>
                    {project.role[0] === 'admin' ? (
                      <Badge variant="default" className="text-xs px-2 py-1 flex-shrink-0">
                        <span className="flex items-center gap-1">
                          Admin
                        </span>
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs px-2 py-1 flex-shrink-0">
                        <span className="flex items-center gap-1">
                          Member
                        </span>
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed mb-6 line-clamp-1">
                    {project.description}
                  </CardDescription>
                  
                  <Button 
                    asChild 
                    variant="default"
                    className="block w-fit ml-auto"
                  >
                    <Link to={`./projects/${project.id}`}>View project</Link>
                  </Button>
                  
                </CardContent>
              </Card>
            ))
          )}
        </div>

    </section>
  )
}