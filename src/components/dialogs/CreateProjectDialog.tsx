import { useActionState, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Plus } from "lucide-react"
import { createNewProject } from "@/utils"
import { toast } from "sonner"

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
import { supabase } from "@/supabase"

type PrevState = {
  success: boolean
  message?: string
  error?: string
}

export default function CreateProjectDialog() {

  const { session } = useAuth()
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)

  if (!session) throw new Error('No active session found. Please login to continue.')

  const [createState, createAction, createPending] = useActionState(
    async (_prevState: PrevState | null, formData: FormData) => {
      try {
        const name = formData.get('project-name') as string
        const description = formData.get('project-description') as string
        
        const { success, error, message } = await createNewProject(
          { name, description },
          session?.user?.id
        )
        
        if (!success && error) {
          console.error(error)
          return { success, error }
        }

        if (success && message) {

          const {data: project, error} = await supabase
          .from('projects')
          .select('id')
          .eq('created_by', session?.user?.id)
          .order('created_at', { ascending: false })
          .limit(1)

          if (error) {
            console.error(error)
            return { success: false, error: 'Failed to access project. Please try again.' }
          }
          

          if (project?.length) {
            toast.success('Project created successfully', {
              style: {
                background: '#f9fafb',
                border: '1px solid #d1d5db',
                color: '#1f2937'
              }
            })
            navigate(`/dashboard/projects/${project[0].id}`)
            return { success, message }
          }

          return {
            success: false,
            error: 'Failed to create project. Please try again.'
          }
        }

        return {
          success: false,
          error: 'Unexpected error occurred, please try again later.'
        }

      } catch (err) {
        console.error(`Error creating a project:${err}`)
        return { success: false, error: 'Failed to create project. Please try again.' }
      }
    }, null
  )

  // Close dialog when action completes successfully
  useEffect(() => {
    if (createState?.success) {
      setCreateOpen(false)
    }
  }, [createState])

  return (
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
                <div className="bg-gray-100 border border-gray-300 text-gray-900 px-4 py-3 rounded-md text-sm">
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
  )
}