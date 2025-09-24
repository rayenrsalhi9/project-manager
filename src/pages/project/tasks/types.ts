export type Task = {
  id: string
  title: string
  description: string
  deadline: Date | undefined
  assignedMember?: string
  // Made optional since it's assigned in step 2 of task form
}

export type SortableTaskItemProps = {
  task: Task
  index: number
  totalTasks: number
  tasksPerRow: number
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  showAssignment?: boolean 
  // Added prop to control assignment display
}