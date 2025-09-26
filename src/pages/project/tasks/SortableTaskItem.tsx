import type { SortableTaskItemProps } from "./types"
import { useOutletContext } from "react-router-dom"
import { getMatchingFullName } from "./utils"
import type { Member } from "@/layout/ProjectLayout"

import {
    GripVertical, 
    ArrowRight, 
    ArrowLeft, 
    ArrowDown, 
    Edit2,
    Trash2,
    CalendarIcon
} from 'lucide-react'

import { Card, CardContent } from "@/components/ui/card"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { format } from "date-fns"

export default function SortableTaskItem({
  task,
  index,
  totalTasks,
  tasksPerRow,
  onEditTask,
  onDeleteTask,
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

  const row = Math.floor(index / tasksPerRow)
  const col = index % tasksPerRow
  const isEvenRow = row % 2 === 0
  const isLastInRow = col === tasksPerRow - 1 || index === totalTasks - 1
  const isLastTask = index === totalTasks - 1

  // Determine connection type (-> or <-)
  const needsRightArrow = isEvenRow && !isLastInRow && !isLastTask
  const needsLeftArrow = !isEvenRow && col > 0
  const needsDownConnection = isLastInRow && !isLastTask

  return (
    <div ref={setNodeRef} style={style} className={`group relative ${isDragging && "opacity-50"}`}>
      <div className="flex items-center mt-4">
        {/* Task Node */}
        <Card className="w-64 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border-2">
          <CardContent className="p-2">
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

                <div className="space-y-2">
                  {task.deadline && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarIcon className="h-3 w-3" />
                      <span>Due {format(task.deadline, "MMM d, yyyy")}</span>
                    </div>
                  )}
                  
                  {task.assigned_to && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="font-medium">Assigned to:</span>
                      <span className="px-2 py-1 bg-secondary rounded-full text-secondary-foreground">
                        {getMatchingFullName(members, task.assigned_to)}
                      </span>
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