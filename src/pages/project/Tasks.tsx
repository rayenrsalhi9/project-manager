import type { Task } from "./tasks/types"
import type { Member } from "@/layout/ProjectLayout"
import { useState } from "react"
import { useOutletContext } from "react-router-dom"

import AssignmentStep from "./tasks/AssignmentStep"
import CreateTasksStep from "./tasks/CreateTasksStep"

export default function TaskManager() {

  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const {projectTasks, members} = useOutletContext<{projectTasks: Task[], members: Member[]}>()
  const [tasks, setTasks] = useState<Task[]>(setUpTasks)
  console.log(tasks)

  function setUpTasks(): Task[] {
    return projectTasks.map(task => {
      const fullName = members.find(member => member.user_id === task.assigned_to)?.full_name
      const userId = task.assigned_to
      return {
        ...task, 
        assigned_to: {full_name: fullName, user_id: userId}
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