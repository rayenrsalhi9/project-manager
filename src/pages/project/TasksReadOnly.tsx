import { useOutletContext } from "react-router-dom"
import type { Task } from "./tasks/types"
import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Users, Clock, CheckCircle2, Loader } from "lucide-react"
import { format, isPast, isToday } from "date-fns"
import { cn } from "@/lib/utils"
import type { Member } from "@/layout/ProjectLayout"
import { getMatchingFullName } from "./tasks/utils"
import { Button } from "@/components/ui/button"


interface TaskCardProps {
  task: Task
  index: number
  totalTasks: number
  members: Member[]
}

function TaskCard({ task, index, totalTasks, members }: TaskCardProps) {
  // Simplified status indicator - only show finished status
  const StatusIndicator = () => {
    const status = task.status || 'in_progress'
    if (status === 'finished') {
      return (
        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-xs font-medium">Done</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400">
        <Loader className="h-4 w-4" />
        <span className="text-xs font-medium">In Progress</span>
      </div>
    )
  }
  // Simplified deadline indicator - returns just the text and icon
  const DeadlineIndicator = () => {
    if (!task.deadline) return null
    
    const deadline = new Date(task.deadline)
    const isOverdue = isPast(deadline) && !isToday(deadline)
    const isDueToday = isToday(deadline)
    
    let text = format(deadline, "MMM d")
    let iconColor = "text-muted-foreground"
    
    if (isOverdue) {
      text = `Overdue • ${text}`
      iconColor = "text-red-500"
    } else if (isDueToday) {
      text = `Today • ${text}`
      iconColor = "text-orange-500"
    }
    
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className={cn("h-3 w-3", iconColor)} />
        <span>{text}</span>
      </div>
    )
  }

  // Simplified card styling - only highlight overdue tasks
  const getCardBorder = () => {
    if (!task.deadline) return 'border-border'
    
    const deadline = new Date(task.deadline)
    const isOverdue = isPast(deadline) && !isToday(deadline)
    
    return isOverdue ? 'border-red-200 dark:border-red-800' : 'border-border'
  }

  const assignedMember = task.assigned_to ? getMatchingFullName(members, task.assigned_to) : null

  return (
    <div className="group relative">
      <Card className={cn("w-full rounded-lg shadow-sm border", getCardBorder())}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            {/* Task Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                  {index + 1}
                </span>
                <h3 className="font-medium text-foreground leading-tight">{task.title}</h3>
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
                  {task.description}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <DeadlineIndicator />
                {assignedMember && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{assignedMember}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <StatusIndicator />
          </div>
        </CardContent>
      </Card>

      {/* Connection Arrow */}
      {index < totalTasks - 1 && (
        <div className="flex items-center justify-center my-3">
          <div className="w-0.5 h-3 bg-border"></div>
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

  const [filter, setFilter] = useState<'all' | 'overdue' | 'today'>('all')

  // Filter tasks based on selected filter
  const filteredTasks = useMemo(() => {
    if (filter === 'all') return projectTasks
    
    return projectTasks.filter(task => {
      if (!task.deadline) return false
      
      const deadline = new Date(task.deadline)
      switch (filter) {
        case 'overdue':
          return isPast(deadline) && !isToday(deadline)
        case 'today':
          return isToday(deadline)
        default:
          return true
      }
    })
  }, [projectTasks, filter])

  // Task statistics
  const taskStats = useMemo(() => {
    const total = projectTasks.length
    const overdue = projectTasks.filter(t => t.deadline && isPast(new Date(t.deadline)) && !isToday(new Date(t.deadline))).length
    const dueToday = projectTasks.filter(t => t.deadline && isToday(new Date(t.deadline))).length
    
    return { total, overdue, dueToday }
  }, [projectTasks])

  // This component is read-only for non-admin users
  // No edit/delete functionality needed

  if (projectTasks.length === 0) {
    return (
      <section className="w-full max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto">
            <CalendarIcon className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">No Tasks Yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Tasks will appear here once they are created. Start by adding your first task to get started.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full max-w-3xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Tasks</h2>
          <p className="text-sm text-muted-foreground">
            {taskStats.total} total • {taskStats.dueToday} due today • {taskStats.overdue} overdue
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Tasks
          </Button>
          <Button
            variant={filter === 'overdue' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('overdue')}
          >
            Overdue Tasks
          </Button>
          <Button
            variant={filter === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('today')}
          >
            Tasks Due Today
          </Button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tasks found</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              index={projectTasks.findIndex(t => t.id === task.id)}
              totalTasks={filteredTasks.length}
              members={members}
            />
          ))
        )}
      </div>
    </section>
  )
}
