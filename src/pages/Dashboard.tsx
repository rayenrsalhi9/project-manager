import { useActionState, useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Plus, Users } from "lucide-react"

import DashboardSkeleton from "@/components/DashboardSkeleton"

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
import { toast } from "sonner"

type PrevState = {
  success: boolean
  message?: string
  error?: string
}

export default function Dashboard() {

  const { user } = useAuth()

  const [createOpen, setCreateOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)
  
  const [createState, createAction, createPending] = useActionState(
    async (_prevState: PrevState | null, formData: FormData) => {
      try {
        const projectName = formData.get('project-name') as string
        const projectDescription = formData.get('project-description') as string
        
        console.log('Creating project:', { projectName, projectDescription })
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Simulate error for testing
        if (projectName === 'error') {
          return { success: false, error: 'Project name cannot be "error"' }
        }
        
        // Return success state
        toast.success('Project created successfully', {
          style: {
            background: '#E8F5E9',
            border: '1px solid #81C784',
            color: '#2E7D32'
          }
        })
        return { success: true, message: 'Project created successfully!' }
      } catch (err) {
        console.error(`An error occured creating a project:${err}`)
        return { success: false, error: 'Failed to create project. Please try again.' }
      }
    }, null
  )

  const [joinState, joinAction, joinPending] = useActionState(
    async (_prevState: PrevState | null, formData: FormData) => {
      try {
        const secretCode = formData.get('secret-code') as string
        
        console.log('Joining project with code:', secretCode)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Simulate error for testing
        if (secretCode === 'error') {
          return { success: false, error: 'Invalid secret code' }
        }
        
        // Return success state
        toast.success('Project found successfully!', {
          style: {
            background: '#E8F5E9',
            border: '1px solid #81C784',
            color: '#2E7D32'
          }
        })
        return { success: true, message: 'Project joined successfully!' }
      } catch (err) {
        console.error(`An error occured creating a project:${err}`)
        return { success: false, error: 'Failed to join project. Please try again.' }
      }
    },
    null
  )

  // Close dialogs when actions complete successfully
  useEffect(() => {
    if (createState?.success) {
      setCreateOpen(false)
    }
  }, [createState])

  useEffect(() => {
    if (joinState?.success) {
      setJoinOpen(false)
    }
  }, [joinState])

  if (!user) return <DashboardSkeleton />

  return (
    <section className="w-full pt-4 px-8">
      
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">
            Welcome, <span className="text-gray-500"> {user?.fullName} </span>
          </h1>
          
          <div className="flex gap-2">
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form action={createAction} className="space-y-4">
                  <DialogHeader>
                    <DialogTitle>Create a new project</DialogTitle>
                    <DialogDescription>Fill in the details below to create your new project</DialogDescription>
                  </DialogHeader>
                  
                  {
                    createState?.error 
                      ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                          {createState.error}
                        </div>
                      ) 
                      : null
                  }
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="project-name" className="block text-sm font-medium mb-2">
                        Project Name
                      </label>
                      <input
                        id="project-name"
                        name="project-name"
                        type="text"
                        placeholder="Enter project name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="project-description" className="block text-sm font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        id="project-description"
                        name="project-description"
                        placeholder="Enter project description"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      type="submit"
                      disabled={createPending}
                    >
                      {createPending ? 'Creating...' : 'Create project'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Join project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form action={joinAction} className="space-y-4">
                  <DialogHeader>
                    <DialogTitle>Join Project</DialogTitle>
                    <DialogDescription>Enter the secret code to join an existing project</DialogDescription>
                  </DialogHeader>
                  
                  {
                  joinState?.error 
                    ? (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                        {joinState.error}
                      </div>
                    )
                    : null
                  }
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="secret-code" className="block text-sm font-medium mb-2">
                        Secret Code
                      </label>
                      <input
                        id="secret-code"
                        name="secret-code"
                        type="text"
                        placeholder="Enter secret code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      type="submit"
                      disabled={joinPending}
                    >
                      {joinPending ? 'Joining...' : 'Join project'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
    </section>
  )
}