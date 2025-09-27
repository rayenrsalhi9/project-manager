import type { Task } from "./tasks/types"
import type { Member } from "@/layout/ProjectLayout"
import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"

import AssignmentStep from "./tasks/AssignmentStep"
import CreateTasksStep from "./tasks/CreateTasksStep"

export default function Tasks() {

  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const {projectTasks, members} = useOutletContext<{projectTasks: Task[], members: Member[]}>()
  const [tasks, setTasks] = useState<Task[]>([])

  // Use useEffect to ensure data is available before processing
  useEffect(() => {
    if (projectTasks && members) {
      setTasks(projectTasks)
    }
  }, [projectTasks, members])

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