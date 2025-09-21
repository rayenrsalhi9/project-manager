import { useAuth } from "@/context/AuthContext"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

import DashboardSkeleton from "@/components/DashboardSkeleton"
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
  const { user, session, userProjects } = useAuth()

  if (!session) throw new Error('No active session found. Please login to continue.')

  if (!user) return <DashboardSkeleton />

  return (
    <section className="w-full pt-4 px-8">
      
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">
            Welcome, <span className="text-gray-500"> {user?.fullName} </span>
          </h1>
          
          <div className="flex gap-2">
            <CreateProjectDialog />
            <JoinProjectDialog />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {userProjects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No projects yet. Create your first project to get started!</p>
            </div>
          ) : (
            userProjects.map((project, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 relative group border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-xl font-semibold text-gray-900 flex-1 truncate">
                      {project.name}
                    </CardTitle>
                    {project.role[0] === 'admin' && (
                      <Badge variant="black" className="text-xs px-2 py-1 flex-shrink-0">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                          Admin
                        </span>
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-1">
                    {project.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      {project.role[0] === 'admin' ? 'Owner' : 'Collaborator'}
                    </div>
                    <Button 
                      asChild 
                      className="bg-foreground text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:bg-black"
                    >
                      <Link to=".">Open Project</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

    </section>
  )
}