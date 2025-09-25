import type { Task, CreateTasksStepProps } from "./types"
import { useState, useMemo } from "react"
import { generateUniqueId } from "./utils"

import SortableTaskItem from "../tasks/SortableTaskItem"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger, 
    DialogDescription 
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"

import {
  CalendarIcon,
  Plus,
  Trash2,
  ChevronRight,
} from "lucide-react"

import { format } from "date-fns"
import { cn } from "@/lib/utils"

import {DndContext, closestCenter} from '@dnd-kit/core'
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'

export default function CreateTasksStep({
    tasks, setTasks, 
    currentStep, setCurrentStep
}: CreateTasksStepProps) {

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
        setTasks((tasks: Task[]) => {
            const oldIndex = tasks.findIndex((task) => task.id === active.id)
            const newIndex = tasks.findIndex((task) => task.id === over.id)

            return arrayMove(tasks, oldIndex, newIndex)
        })
        }
    }

    const handleAddTask = () => {

        if (!formData.title.trim()) return

        const newTask: Task = {
            id: generateUniqueId(),
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
            tasks.map((task: Task) =>
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

    const handleNextStep = () => {
        if (tasks.length > 0) {
        setCurrentStep(2)
        }
    }

    const handleClearAll = () => {
        setTasks([])
        setCurrentStep(1) // Reset to step 1 when clearing
    }

    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter((task: Task) => task.id !== taskId))
    }

    const createSnakeLayout = useMemo(() => {
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
    }, [tasks, tasksPerRow])

    return (
        <section className="w-full max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
            <div>
            <h2 className="text-xl font-bold text-foreground">Task Manager</h2>
            <p className="text-muted-foreground">
                Step 1: Create and organize your project tasks
            </p>
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
                        <DialogDescription>Add a new task to your project</DialogDescription>
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
                    <DialogDescription>Update task details</DialogDescription>
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

        {
            tasks.length > 0 && (
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
            )
        }

        {
            tasks.length > 0 && (
                <div className="space-y-4">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={tasks.map((task: Task) => task.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-0">
                            {createSnakeLayout.map((row, rowIndex) => (
                            <div key={rowIndex} className={cn("flex gap-2", rowIndex % 2 === 1 && "flex-row-reverse")}>
                                {row.map((task) => {
                                const originalIndex = tasks.findIndex((t: Task) => t.id === task.id)
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
            )
        }

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
