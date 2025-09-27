import { useOutletContext } from "react-router-dom"
import type { Task } from "./tasks/types"
import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { ArrowRight, ArrowLeft, ArrowDown } from "lucide-react"
import type { Member } from "@/layout/ProjectLayout"
import { getMatchingFullName } from "./tasks/utils"

interface TaskCardProps {
  task: Task
  index: number
  totalTasks: number
  tasksPerRow: number
  members: Member[]
}

function TaskCard({ task, index, totalTasks, tasksPerRow, members }: TaskCardProps) {
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
    <div className="group relative">
      <div className="flex items-center mt-4">
        {/* Task Node */}
        <Card className="w-64 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border-2">
          <CardContent className="p-2">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-foreground leading-tight">{task.title}</h3>
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

export default function TasksReadOnly() {
  const { projectTasks, members } = useOutletContext<{ 
    projectTasks: Task[], 
    members: Member[] 
  }>()

  const TASKS_PER_ROW = 3

  const createSnakeLayout = useMemo(() => {
    const rows: Task[][] = []
    for (let i = 0; i < projectTasks.length; i += TASKS_PER_ROW) {
      const row = projectTasks.slice(i, i + TASKS_PER_ROW)
      const rowIndex = Math.floor(i / TASKS_PER_ROW)
      // Reverse every odd row for snake pattern
      if (rowIndex % 2 === 1) {
        row.reverse()
      }
      rows.push(row)
    }
    return rows
  }, [projectTasks])

  if (projectTasks.length === 0) {
    return (
      <section className="w-full max-w-2xl mx-auto space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Project Tasks</h2>
          <p className="text-muted-foreground">No tasks have been created for this project yet.</p>
        </div>
        <Card className="rounded-2xl border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                <CalendarIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-muted-foreground">No tasks available</h3>
              <p className="text-sm text-muted-foreground">Tasks will appear here once they are created.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="w-full max-w-2xl mx-auto space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Project Tasks</h2>
        <p className="text-muted-foreground text-sm">
          View all tasks in this project
        </p>
      </div>

      <div className="space-y-0">
        {createSnakeLayout.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className={cn(
              "flex gap-2 justify-center items-start",
              rowIndex % 2 === 1 && "flex-row-reverse"
            )}
          >
            {row.map((task) => {
              const originalIndex = projectTasks.findIndex((t: Task) => t.id === task.id)
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={originalIndex}
                  totalTasks={projectTasks.length}
                  tasksPerRow={TASKS_PER_ROW}
                  members={members}
                />
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}
