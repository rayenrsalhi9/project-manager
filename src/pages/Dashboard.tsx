import { useAuth } from "@/context/AuthContext"
import DashboardSkeleton from "@/components/DashboardSkeleton"
import { Plus, Users } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function Dashboard() {

  const {user} = useAuth()

  if (!user) return <DashboardSkeleton />

  return (
    <section className="w-full pt-4 px-8">
      
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">
            Welcome, <span className="text-gray-500"> {user?.fullName} </span>
          </h1>
          
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new project</DialogTitle>
                  <DialogDescription>Fill in the details below to create your new project</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="project-name" className="block text-sm font-medium mb-2">
                      Project Name
                    </label>
                    <input
                      id="project-name"
                      type="text"
                      placeholder="Enter project name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="project-description" className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      id="project-description"
                      placeholder="Enter project description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="default">Create project</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Join project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join Project</DialogTitle>
                  <DialogDescription>Enter the secret code to join an existing project</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="secret-code" className="block text-sm font-medium mb-2">
                      Secret Code
                    </label>
                    <input
                      id="secret-code"
                      type="text"
                      placeholder="Enter secret code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="default">Join project</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
    </section>
  )
}