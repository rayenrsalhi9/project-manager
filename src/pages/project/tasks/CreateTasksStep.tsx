import type { Task, CreateTasksStepProps } from "./types"
import { useState } from "react"
import { generateTasks } from "@/services/aiService"
import { generateUniqueId, validateTask } from "./utils"
import { useParams } from "react-router-dom"
import { supabase } from "@/supabase"
import { toast } from "sonner"

import SortableTaskItem from "../tasks/SortableTaskItem"
import ProjectGPTDialog from "@/components/dialogs/ProjectGPTDialog"

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
    tasks, setTasks, setCurrentStep
}: CreateTasksStepProps) {

    const { projectId } = useParams<{ projectId: string }>()
    if (!projectId) {
        throw new Error("Project ID is required")
    }

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false)

    const [editingTask, setEditingTask] = useState<Task | null>(null)

    const [addFormData, setAddFormData] = useState<Omit<Task, 'id'>>({
        title: "",
        description: "",
        deadline: undefined as Date | undefined,
    })
    const [editFormData, setEditFormData] = useState<Omit<Task, 'id'>>({
        title: "",
        description: "",
        deadline: undefined as Date | undefined,
    })

    const {title: addTitle, description: addDescription, deadline: addDeadline} = validateTask(addFormData)
    const {title: editTitle, description: editDescription, deadline: editDeadline} = validateTask(editFormData)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const handleDragEnd = (event: DragEndEvent) => {
        try {
            const { active, over } = event
            if (over && active.id !== over.id) {
                setTasks((tasks: Task[]) => {
                    const oldIndex = tasks.findIndex((task) => task.id === active.id)
                    const newIndex = tasks.findIndex((task) => task.id === over.id)
                    const reorderedTasks = arrayMove(tasks, oldIndex, newIndex)
                    
                    // Update task indices based on new order (1-based indexing)
                    return reorderedTasks.map((task, index) => ({
                        ...task,
                        task_index: index + 1
                    }))
                })
            }
        } catch (error) {
            console.error("Error in handleDragEnd:", error)
        }
    }

    const handleAddTask = () => {

        const errors = validateTask(addFormData)
        if (Object.keys(errors).length > 0) return

        // Calculate the next task index (1-based indexing)
        const nextIndex = tasks.length > 0 ? Math.max(...tasks.map(t => t.task_index || 0)) + 1 : 1

        const newTask: Task = {
            id: generateUniqueId(),
            title: addFormData.title,
            description: addFormData.description,
            deadline: addFormData.deadline,
            task_index: nextIndex,
        }

        setTasks([...tasks, newTask])
        setAddFormData({
            title: "",
            description: "",
            deadline: undefined,
        })
        setIsAddDialogOpen(false)
    }

    const handleEditTask = (task: Task) => {
        setEditingTask(task)
        setEditFormData({
            title: task.title,
            description: task.description,
            deadline: task.deadline,
        })
        setIsEditDialogOpen(true)
    }

    const handleUpdateTask = () => {
        if (!editFormData.title.trim() || !editingTask) return

        const errors = validateTask(editFormData)
        if (Object.keys(errors).length > 0) return

        setTasks(
            tasks.map((task: Task) =>
                task.id === editingTask.id
                ? {
                    ...task,
                    title: editFormData.title,
                    description: editFormData.description,
                    deadline: editFormData.deadline,
                    task_index: task.task_index, // Preserve existing task index
                    }
                : task,
            ),
        )

        setEditFormData({
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
        setIsClearAllDialogOpen(true)
    }

    const confirmClearAll = async () => {
        try {
            // Clear from database first
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('project_id', projectId)
            
            if (error) {
                throw error
            }
            
            // Clear local state
            setTasks([])
            setCurrentStep(1) // Reset to step 1 when clearing
            
            toast.success("All tasks have been cleared successfully", {
              style: {
                background: '#f9fafb',
                border: '1px solid #d1d5db',
                color: '#1f2937'
              }
            })
            
        } catch (error) {
            console.error("Error clearing tasks:", error)
            toast.error("Failed to clear tasks. Please try again.", {
              duration: 5000,
              style: {
                background: '#f3f4f6',
                border: '1px solid #9ca3af',
                color: '#374151',
              }
            })
        } finally {
            setIsClearAllDialogOpen(false)
        }
    }

    const handleDeleteTask = (taskId: string) => {
        setTasks((prevTasks) => {
            const filteredTasks = prevTasks.filter((task: Task) => task.id !== taskId)
            // Reindex remaining tasks to maintain sequential ordering
            return filteredTasks.map((task, index) => ({
                ...task,
                task_index: index + 1
            }))
        })
    }

    const handleProjectGPTSubmit = async (input: string) => {

        toast.info("ProjectGPT feature coming soon!", {
            duration: 5000,
            style: {
                background: '#f9fafb',
                border: '1px solid #d1d5db',
                color: '#1f2937'
            }
        })

        try {
            const tasks = await generateTasks(input)
            const {tasks: generatedTasks} = JSON.parse(tasks || '[]')
            setTasks(generatedTasks.map((task: Task, index: number) => ({
                ...task,
                id: generateUniqueId(),
                task_index: index + 1,
            })))
            toast.success("Tasks generated successfully", {
                duration: 5000,
                style: {
                    background: '#f9fafb',
                    border: '1px solid #d1d5db',
                    color: '#1f2937'
                }
            })
        } catch (error) {
            console.error("Error generating tasks:", error)
            toast.error("Failed to generate tasks. Please try again.", {
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
        <section className="w-full max-w-3xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-xl font-semibold mb-1 text-foreground">Task Manager</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
                Step 1: Create and organize your project tasks
            </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-start sm:justify-end flex-col sm:flex-row">
                <ProjectGPTDialog onSubmit={handleProjectGPTSubmit} />
                
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="rounded-2xl whitespace-nowrap">
                    <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                    Create a new task
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:max-w-md rounded-2xl mx-4">
                    <DialogHeader>
                        <DialogTitle>Create A New Task</DialogTitle>
                        <DialogDescription>Add a new task to your project</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Task Title</Label>
                            <Input
                                id="title"
                                value={addFormData.title}
                                onChange={(e) => setAddFormData({ ...addFormData, title: e.target.value })}
                                placeholder="Enter task title"
                                className="rounded-xl"
                            />
                            {
                                addTitle && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {addTitle}
                                    </p>
                                )
                            }
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                            id="description"
                            value={addFormData.description}
                            onChange={(e) => setAddFormData({ ...addFormData, description: e.target.value })}
                            placeholder="Enter task description"
                            className="rounded-xl resize-none"
                            rows={3}
                            />
                            {
                                addDescription && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {addDescription}
                                    </p>
                                )
                            }
                        </div>

                        <div className="space-y-2">
                            <Label>Due Date</Label>
                            <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal rounded-xl",
                                    !addFormData.deadline && "text-muted-foreground",
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {addFormData.deadline ? format(addFormData.deadline, "PPP") : "Pick a date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                                <Calendar
                                mode="single"
                                selected={addFormData.deadline}
                                onSelect={(date) => setAddFormData({ ...addFormData, deadline: date })}
                                />
                            </PopoverContent>
                            </Popover>
                            {
                                addDeadline && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {addDeadline}
                                    </p>
                                )
                            }
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl order-2 sm:order-none">
                                Cancel
                            </Button>
                            <Button onClick={handleAddTask} disabled={Object.keys(validateTask(addFormData)).length > 0} className="rounded-xl order-1 sm:order-none">
                                Add Task
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            </div>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="w-[95vw] sm:max-w-md rounded-2xl mx-4">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription>Update task details</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="edit-title">Task Title</Label>
                    <Input
                        id="edit-title"
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                        placeholder="Enter task title"
                        className="rounded-xl"
                    />
                    {
                        editTitle && (
                            <p className="text-red-600 text-sm mt-1">
                                {editTitle}
                            </p>
                        )
                    }
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                        id="edit-description"
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                        placeholder="Enter task description"
                        className="rounded-xl resize-none"
                        rows={3}
                    />
                    {
                        editDescription && (
                            <p className="text-red-600 text-sm mt-1">
                                {editDescription}
                            </p>
                        )
                    }
                    </div>

                    <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                "w-full justify-start text-left font-normal rounded-xl",
                                !editFormData.deadline && "text-muted-foreground",
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {editFormData.deadline ? format(editFormData.deadline, "PPP") : "Pick a date"}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                            <Calendar
                                mode="single"
                                selected={editFormData.deadline}
                                onSelect={(date) => setEditFormData({ ...editFormData, deadline: date })}
                            />
                            </PopoverContent>
                        </Popover>
                        {
                            editDeadline && (
                            <p className="text-red-600 text-sm mt-1">
                                {editDeadline}
                            </p>
                        )
                        }
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl order-2 sm:order-none">
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateTask} disabled={Object.keys(validateTask(editFormData)).length > 0} className="rounded-xl order-1 sm:order-none">
                            Update Task
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        {/* Clear All Confirmation Dialog */}
        <Dialog open={isClearAllDialogOpen} onOpenChange={setIsClearAllDialogOpen}>
            <DialogContent className="w-[95vw] sm:max-w-md rounded-2xl mx-4">
                <DialogHeader>
                    <DialogTitle>Clear All Tasks</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to clear all tasks? This action cannot be undone and will remove all tasks from this project.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsClearAllDialogOpen(false)} 
                        className="rounded-xl order-2 sm:order-none"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmClearAll} 
                        variant="destructive"
                        className="rounded-xl order-1 sm:order-none"
                    >
                        Clear All Tasks
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        {
            tasks.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button onClick={handleNextStep} className="rounded-xl order-1 sm:order-none">
                        <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                        Proceed to task assignment
                    </Button>
                    <Button
                        onClick={handleClearAll}
                        variant="outline"
                        className="rounded-xl text-destructive hover:text-destructive bg-transparent order-2 sm:order-none"
                    >
                        <Trash2 className="h-4 w-4 mr-2 flex-shrink-0" />
                        Clear all tasks
                    </Button>
                </div>
            )
        }

        {
            tasks.length > 0 && (
                <div className="space-y-2">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={tasks.map((task: Task) => task.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-1">
                                {tasks.map((task, index) => (
                                    <SortableTaskItem
                                        key={task.id}
                                        task={task}
                                        index={index}
                                        onEditTask={handleEditTask}
                                        onDeleteTask={handleDeleteTask}
                                        compact={true}
                                    />
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
