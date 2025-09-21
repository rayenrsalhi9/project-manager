import { useAuth } from "@/context/AuthContext"
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
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {project.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))
          )}
        </div>

    </section>
  )
}