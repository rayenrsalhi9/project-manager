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
          <h1 className="text-xl font-bold">
            Welcome, <span className="text-gray-500"> {user?.fullName} </span>
          </h1>
          
          <div className="flex gap-2">
            {/* Create Project Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Project</DialogTitle>
                  <DialogDescription>
                    Here is your dialog text
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="default">Create</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Join Project Dialog */}
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
                  <DialogDescription>
                    Here is your dialog text
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="default">Join</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
    </section>
  )
}