import type { AssignmentStepProps, Task } from "./types"
import { useMemo } from "react"
import { useOutletContext, useParams, useNavigate } from "react-router-dom"
import { processTasks, getMatchingFullName, processTaskChanges, hasChanges } from "./utils"
import type { Member } from "@/layout/ProjectLayout"
import { format } from "date-fns"
import { useAuth } from "@/context/AuthContext"

import { ChevronLeft, Users, CalendarIcon } from 'lucide-react'
import { toast } from "sonner"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AssignmentStep({
  tasks, 
  setTasks, 
  setCurrentStep
}: AssignmentStepProps) {

  const {session} = useAuth()
  const adminId = session?.user?.id || ""

  const {projectId} = useParams()
  if (!projectId) {
    throw new Error("Project ID is required")
  }

  const navigate = useNavigate()

  const {members, projectTasks} = useOutletContext<
    {members: Member[], projectTasks: Task[]}
  >()
  const teamMembers = members.filter(member => member.role !== 'admin')

  const {unassignedTasks, assignedTasks} = useMemo(() => {
    const unassigned = tasks.filter((task) => !task.assigned_to)
    const assigned = tasks.filter((task) => task.assigned_to)
    return {unassignedTasks: unassigned, assignedTasks: assigned}
  }, [tasks])

  const handleBackToTasks = () => {
    setCurrentStep(1)
  }

  const handleAssignTask = (taskId: string, member: string) => {
    setTasks(tasks.map((task) => (
      task.id === taskId 
        ? { ...task, assigned_to: member} 
        : task
    )))
  }

  const handleCompleteSetup = async () => {
    try {
      if (unassignedTasks.length > 0) {
        throw new Error("All tasks must be assigned before completing setup")
      }

      // Check if any changes have been made
      if (!hasChanges(tasks, projectTasks)) {
        toast.info("No changes were made", {
          duration: 3000,
          style: {
            background: '#f9fafb',
            border: '1px solid #d1d5db',
            color: '#1f2937'
          }
        })
        return
      }

      const {newCreatedTasks, updatedTasks, deletedTasks} = processTasks(tasks, projectTasks)
      
      // Process all task changes (create, update, delete)
      const result = await processTaskChanges(
        newCreatedTasks, 
        updatedTasks, 
        deletedTasks, 
        projectId, 
        adminId
      )

      if (!result.success) {
        throw new Error(result.error || "Failed to process task changes")
      }

      toast.success("Tasks setup completed successfully!", {
          duration: 3000,
          style: {
            background: '#f9fafb',
            border: '1px solid #d1d5db',
            color: '#1f2937'
          }
        })
      navigate(`/dashboard/projects/${projectId}`)
    } catch (error) {
      console.error("Error completing setup:", error)
      toast.error(error instanceof Error ? error.message : "Failed to complete setup", {
        duration: 5000,
        style: {
          background: '#f3f4f6',
          border: '1px solid #9ca3af',
          color: '#374151',
        }
      })
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-1 text-foreground">
            Assign Tasks to Team Members
          </h2>
          <p className="text-muted-foreground text-sm">
            Step 2: Assign each task to a project member
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBackToTasks} className="rounded-xl bg-transparent">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
          <Button onClick={handleCompleteSetup} disabled={unassignedTasks.length > 0} className="rounded-xl">
            Complete Setup
          </Button>
        </div>
      </div>

      {unassignedTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Unassigned Tasks ({unassignedTasks.length})</h3>
          <div className="grid gap-4">
            {unassignedTasks.map((task) => (
              <Card key={task.id} className="rounded-2xl border-2 border-dashed border-muted-foreground/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{task.title}</h4>
                      {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                      {task.deadline && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <CalendarIcon className="h-3 w-3" />
                          <span>Due {format(task.deadline, "MMM d, yyyy")}</span>
                        </div>
                      )}
                    </div>
                    <Select onValueChange={(value) => handleAssignTask(task.id, value)}>
                      <SelectTrigger className="w-48 rounded-xl">
                        <SelectValue placeholder="Assign to..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {teamMembers.map((member) => (
                          <SelectItem key={member.user_id} value={member.user_id}>
                            {member.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {assignedTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Assigned Tasks ({assignedTasks.length})</h3>
          <div className="grid gap-4">
            {assignedTasks.map((task) => (
              <Card key={task.id} className="rounded-2xl border-2 border-gray-300 bg-gray-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{task.title}</h4>
                      {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          {
                          task.assigned_to && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full font-medium">
                                {getMatchingFullName(members, task.assigned_to)}
                              </span>
                            </div>
                          )
                          }
                        {
                        task.deadline && (
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            <span>Due {format(task.deadline, "MMM d, yyyy")}</span>
                          </div>
                        )
                        }
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignTask(task.id, "")}
                      className="rounded-xl text-xs"
                    >
                      Reassign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}