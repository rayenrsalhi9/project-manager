export type Task = {
  id: string
  title: string
  description: string
  deadline: Date | undefined
  assigned_to?: {full_name: string, user_id: string} | undefined
  // Made optional since it's assigned in step 2 of task form
}

export type SortableTaskItemProps = {
  task: Task
  index: number
  totalTasks: number
  tasksPerRow: number
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

export type CreateTasksStepProps = {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  currentStep: 1 | 2
  setCurrentStep: React.Dispatch<React.SetStateAction<1 | 2>>
}

export type AssignmentStepProps = {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  setCurrentStep: React.Dispatch<React.SetStateAction<1 | 2>>
}