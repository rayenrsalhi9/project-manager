import type { Task } from "./types"
import { useOutletContext } from "react-router-dom"

export interface SortableTaskItemProps {
  task: Task
  index: number
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  compact?: boolean
}
import { getMatchingFullName } from "./utils"
import type { Member } from "@/layout/ProjectLayout"
import { cn } from "@/lib/utils"

import {
    GripVertical, 
    Edit2,
    Trash2,
    CalendarIcon,
    Users
} from 'lucide-react'

import { Card, CardContent } from "@/components/ui/card"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { format } from "date-fns"

export default function SortableTaskItem({
  task,
  index,
  onEditTask,
  onDeleteTask,
  compact = false,
}: SortableTaskItemProps) {

  const {members} = useOutletContext<{members: Member[]}>()

  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className={cn("group", isDragging && "opacity-50 scale-105")}>
      <Card className={cn(
        "rounded-xl border hover:border-primary/50 transition-all duration-200 hover:shadow-md",
        compact && "rounded-lg"
      )}>
        <CardContent className={cn(
          "transition-all duration-200",
          compact ? "p-3" : "p-5"
        )}>
          {compact ? (
            // Compact single-line version
            <div className="flex items-center gap-3">
              {/* Drag Handle */}
              <button
                className="p-1 rounded hover:bg-muted/80 transition-colors cursor-grab active:cursor-grabbing flex-shrink-0"
                {...attributes}
                {...listeners}
                title="Drag to reorder"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Task Number */}
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              </div>

              {/* Task Title */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-foreground truncate">{task.title}</h3>
                {task.description && (
                  <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                )}
              </div>

              {/* Task Metadata - Horizontal */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {task.assigned_to && (
                  <div className="flex items-center gap-1 text-xs">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="px-2 py-0.5 bg-secondary rounded text-secondary-foreground">
                      {getMatchingFullName(members, task.assigned_to)}
                    </span>
                  </div>
                )}
                
                {task.deadline && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{format(task.deadline, "MMM d")}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => onEditTask(task)}
                  className="p-1 rounded hover:bg-muted transition-colors"
                  title="Edit task"
                >
                  <Edit2 className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1 rounded hover:bg-destructive/10 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </button>
              </div>
            </div>
          ) : (
            // Full multi-line version (existing code)
            <div className="flex items-start gap-4">
              {/* Drag Handle */}
              <button
                className="mt-1 p-2 rounded-md hover:bg-muted/80 transition-colors cursor-grab active:cursor-grabbing flex-shrink-0"
                {...attributes}
                {...listeners}
                title="Drag to reorder"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </button>

              {/* Task Number Badge */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>

              {/* Task Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-lg text-foreground leading-tight break-words">{task.title}</h3>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => onEditTask(task)}
                      className="p-2 rounded-md hover:bg-muted transition-colors"
                      title="Edit task"
                    >
                      <Edit2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2 rounded-md hover:bg-destructive/10 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>

                {task.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed break-words">{task.description}</p>
                )}

                {/* Task Metadata */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  {task.assigned_to && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="px-3 py-1 bg-secondary rounded-full text-secondary-foreground font-medium">
                        {getMatchingFullName(members, task.assigned_to)}
                      </span>
                    </div>
                  )}

                  {task.deadline && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Due {format(task.deadline, "MMM d, yyyy")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}