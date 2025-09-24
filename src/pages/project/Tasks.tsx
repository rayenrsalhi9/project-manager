import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  CalendarIcon,
  GripVertical,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  Edit2,
  ChevronRight,
  ChevronLeft,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type Task = {
  id: string
  title: string
  description: string
  deadline: Date | undefined
  assignedMember?: string
  // Made optional since it's assigned in step 2 of task form
}

type SortableTaskItemProps = {
  task: Task
  index: number
  totalTasks: number
  tasksPerRow: number
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  showAssignment?: boolean 
  // Added prop to control assignment display
}

function SortableTaskItem({
  task,
  index,
  totalTasks,
  tasksPerRow,
  onEditTask,
  onDeleteTask,
  showAssignment = false,
}: SortableTaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const row = Math.floor(index / tasksPerRow)
  const col = index % tasksPerRow
  const isEvenRow = row % 2 === 0
  const isLastInRow = col === tasksPerRow - 1 || index === totalTasks - 1
  const isLastTask = index === totalTasks - 1

  // Determine connection type
  const needsRightArrow = isEvenRow && !isLastInRow && !isLastTask
  const needsLeftArrow = !isEvenRow && col > 0
  const needsDownConnection = isLastInRow && !isLastTask

  return (
    <div ref={setNodeRef} style={style} className={cn("group relative", isDragging && "opacity-50")}>
      <div className="flex items-center">
        {/* Task Node */}
        <Card className="w-64 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border-2">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <button
                className="mt-1 p-1 rounded hover:bg-muted transition-colors cursor-grab active:cursor-grabbing"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </button>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-foreground leading-tight">{task.title}</h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                    <button onClick={() => onEditTask(task)} className="p-1 rounded hover:bg-muted transition-colors">
                      <Edit2 className="h-3 w-3 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1 rounded hover:bg-muted transition-colors"
                    >
                      <Trash2 className="h-3 w-3 text-destructive hover:text-destructive" />
                    </button>
                  </div>
                </div>

                {task.description && <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {showAssignment && task.assignedMember && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Assigned to:</span>
                      <span className="px-2 py-1 bg-secondary rounded-full text-secondary-foreground">
                        {task.assignedMember}
                      </span>
                    </div>
                  )}

                  {task.deadline && (
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>Due {format(task.deadline, "MMM d, yyyy")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {needsRightArrow && (
          <div className="flex items-center ml-2">
            <div className="w-6 h-0.5 bg-border"></div>
            <ArrowRight className="h-4 w-4 text-muted-foreground ml-1" />
          </div>
        )}

        {needsLeftArrow && (
          <div className="flex items-center mr-2 order-first">
            <ArrowLeft className="h-4 w-4 text-muted-foreground mr-1" />
            <div className="w-6 h-0.5 bg-border"></div>
          </div>
        )}
      </div>

      {needsDownConnection && (
        <div className="flex justify-center mt-4 mb-4">
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-6 bg-border"></div>
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
            <div className="w-0.5 h-6 bg-border"></div>
          </div>
        </div>
      )}
    </div>
  )
}

function AssignmentStep({
  tasks,
  onAssignTask,
  onBack,
  onComplete,
}: {
  tasks: Task[]
  onAssignTask: (taskId: string, member: string) => void
  onBack: () => void
  onComplete: () => void
}) {
  const teamMembers = ["Alice", "Bob", "Charlie", "Diana", "Eve"]
  const unassignedTasks = tasks.filter((task) => !task.assignedMember)
  const assignedTasks = tasks.filter((task) => task.assignedMember)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Assign Tasks to Team Members</h2>
          <p className="text-muted-foreground">Step 2: Assign each task to a project member</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} className="rounded-xl bg-transparent">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
          <Button onClick={onComplete} disabled={unassignedTasks.length > 0} className="rounded-xl">
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
                    <Select onValueChange={(value) => onAssignTask(task.id, value)}>
                      <SelectTrigger className="w-48 rounded-xl">
                        <SelectValue placeholder="Assign to..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {teamMembers.map((member) => (
                          <SelectItem key={member} value={member}>
                            {member}
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
              <Card key={task.id} className="rounded-2xl border-2 border-green-200 bg-green-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{task.title}</h4>
                      {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                            {task.assignedMember}
                          </span>
                        </div>
                        {task.deadline && (
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            <span>Due {format(task.deadline, "MMM d, yyyy")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAssignTask(task.id, "")}
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

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentStep, setCurrentStep] = useState<1 | 2>(1) // Added step state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: undefined as Date | undefined,
  })

  const tasksPerRow = 2

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((task) => task.id === active.id)
        const newIndex = tasks.findIndex((task) => task.id === over.id)

        return arrayMove(tasks, oldIndex, newIndex)
      })
    }
  }

  const handleAddTask = () => {
    if (!formData.title.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      deadline: formData.deadline,
    }

    setTasks([...tasks, newTask])
    setFormData({
      title: "",
      description: "",
      deadline: undefined,
    })
    setIsDialogOpen(false)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      deadline: task.deadline,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateTask = () => {
    if (!formData.title.trim() || !editingTask) return

    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: formData.title,
              description: formData.description,
              deadline: formData.deadline,
            }
          : task,
      ),
    )

    setFormData({
      title: "",
      description: "",
      deadline: undefined,
    })
    setEditingTask(null)
    setIsEditDialogOpen(false)
  }

  const handleAssignTask = (taskId: string, member: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, assignedMember: member || undefined } : task)))
  }

  const handleNextStep = () => {
    if (tasks.length > 0) {
      setCurrentStep(2)
    }
  }

  const handleBackToTasks = () => {
    setCurrentStep(1)
  }

  const handleCompleteSetup = () => {
    console.log("Final tasks with assignments:", tasks)
    // Here you could save to database or perform other actions
  }

  const handleClearAll = () => {
    setTasks([])
    setCurrentStep(1) // Reset to step 1 when clearing
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const createSnakeLayout = () => {
    const rows: Task[][] = []
    for (let i = 0; i < tasks.length; i += tasksPerRow) {
      const row = tasks.slice(i, i + tasksPerRow)
      const rowIndex = Math.floor(i / tasksPerRow)
      // Reverse every odd row for snake pattern
      if (rowIndex % 2 === 1) {
        row.reverse()
      }
      rows.push(row)
    }
    return rows
  }

  if (currentStep === 2) {
    return (
      <AssignmentStep
        tasks={tasks}
        onAssignTask={handleAssignTask}
        onBack={handleBackToTasks}
        onComplete={handleCompleteSetup}
      />
    )
  }

  return (
    <section className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Task Manager</h2>
          <p className="text-muted-foreground">Step 1: Create and organize your project tasks</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter task description"
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-xl",
                        !formData.deadline && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.deadline ? format(formData.deadline, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.deadline}
                      onSelect={(date) => setFormData({ ...formData, deadline: date })}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-xl">
                  Cancel
                </Button>
                <Button onClick={handleAddTask} disabled={!formData.title.trim()} className="flex-1 rounded-xl">
                  Add Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Task Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description"
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-xl",
                      !formData.deadline && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? format(formData.deadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.deadline}
                    onSelect={(date) => setFormData({ ...formData, deadline: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1 rounded-xl">
                Cancel
              </Button>
              <Button onClick={handleUpdateTask} disabled={!formData.title.trim()} className="flex-1 rounded-xl">
                Update Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {tasks.length > 0 && (
        <div className="flex gap-2">
          <Button onClick={handleNextStep} className="rounded-xl">
            <ChevronRight className="h-4 w-4 mr-2" />
            Assign Tasks
          </Button>
          <Button
            onClick={handleClearAll}
            variant="outline"
            className="rounded-xl text-destructive hover:text-destructive bg-transparent"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="space-y-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-0">
                {createSnakeLayout().map((row, rowIndex) => (
                  <div key={rowIndex} className={cn("flex gap-2", rowIndex % 2 === 1 && "flex-row-reverse")}>
                    {row.map((task) => {
                      const originalIndex = tasks.findIndex((t) => t.id === task.id)
                      return (
                        <SortableTaskItem
                          key={task.id}
                          task={task}
                          index={originalIndex}
                          totalTasks={tasks.length}
                          tasksPerRow={tasksPerRow}
                          onEditTask={handleEditTask}
                          onDeleteTask={handleDeleteTask}
                          showAssignment={currentStep === 2} // Show assignment only in step 2
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {tasks.length === 0 && (
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-muted-foreground">No tasks yet</h3>
              <p className="text-sm text-muted-foreground">Click "Add Task" to create your first task</p>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}