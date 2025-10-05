export type Task = {
  id: string
  title: string
  description: string
  deadline: Date | undefined
  assigned_to?: string
  task_index?: number
  status?: 'in_progress' | 'finished'
}

export type SortableTaskItemProps = {
  task: Task
  index: number
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