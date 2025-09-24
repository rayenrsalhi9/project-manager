import type { Task } from "./tasks/types"
import { useState } from "react"

import AssignmentStep from "./tasks/AssignmentStep"
import CreateTasksStep from "./tasks/CreateTasksStep"

export default function TaskManager() {

  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design User Interface',
      description: 'Create wireframes and mockups for the main dashboard',
      deadline: new Date()
    },
    {
      id: '2',
      title: 'Implement Authentication', 
      description: 'Set up user login and registration system',
      deadline: new Date()
    },
    {
      id: '3',
      title: 'Database Setup',
      description: 'Configure and initialize the database schema',
      deadline: new Date()
    }
  ])

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