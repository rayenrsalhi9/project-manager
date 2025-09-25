import type { Task } from "./tasks/types"
import type { Member } from "@/layout/ProjectLayout"
import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"

import AssignmentStep from "./tasks/AssignmentStep"
import CreateTasksStep from "./tasks/CreateTasksStep"

export default function TaskManager() {

  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const {projectTasks, members} = useOutletContext<{projectTasks: Task[], members: Member[]}>()
  const [tasks, setTasks] = useState<Task[]>([])
  console.log(tasks)

  // Use useEffect to ensure data is available before processing
  useEffect(() => {
    if (projectTasks && members) {
      setTasks(setUpTasks(projectTasks, members))
    }
  }, [projectTasks, members])

  function setUpTasks(tasks: Task[], membersList: Member[]): Task[] {
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return []
    }

    if (!membersList || !Array.isArray(membersList) || membersList.length === 0) {
      // If no members available, return tasks with assigned_to as undefined
      return tasks.map(task => ({
        ...task,
        assigned_to: undefined
      }))
    }

    return tasks.map(task => {
      // Handle cases where task.assigned_to might be a string or already an object
      const assignedUserId = typeof task.assigned_to === 'string' 
        ? task.assigned_to 
        : task.assigned_to?.user_id

      if (!assignedUserId) {
        return {
          ...task,
          assigned_to: undefined
        }
      }

      const member = membersList.find(member => member.user_id === assignedUserId)
      
      return {
        ...task,
        assigned_to: member 
          ? { full_name: member.full_name, user_id: member.user_id }
          : undefined
      }
    })
  }

  if (currentStep === 2) {
    return (
      <AssignmentStep
        tasks={tasks}
        setTasks={setTasks}
        setCurrentStep={setCurrentStep}
      />
    )
  }

  return (
    <CreateTasksStep 
      tasks={tasks} 
      setTasks={setTasks} 
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
    />
  )
}