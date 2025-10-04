import { useOutletContext } from "react-router-dom"
import type { Task } from "./tasks/types"
import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Users, Clock } from "lucide-react"
import { format, isPast, isToday, isTomorrow } from "date-fns"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
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
  // Get deadline status and styling
  const getDeadlineInfo = () => {
    if (!task.deadline) return null
    
    const deadline = new Date(task.deadline)
    const isOverdue = isPast(deadline) && !isToday(deadline)
    const isDueToday = isToday(deadline)
    const isDueTomorrow = isTomorrow(deadline)
    
    return {
      isOverdue,
      isDueToday,
      isDueTomorrow,
      formatted: format(deadline, "MMM d, yyyy")
    }
  }

  const deadlineInfo = getDeadlineInfo()
  const assignedMember = task.assigned_to ? getMatchingFullName(members, task.assigned_to) : null

  // Get status color based on deadline
  const getStatusColor = () => {
    if (!deadlineInfo) return 'border-transparent'
    if (deadlineInfo.isOverdue) return 'border-red-500/50 bg-red-50/30 dark:bg-red-950/20'
    if (deadlineInfo.isDueToday) return 'border-orange-500/50 bg-orange-50/30 dark:bg-orange-950/20'
    if (deadlineInfo.isDueTomorrow) return 'border-yellow-500/50 bg-yellow-50/30 dark:bg-yellow-950/20'
    return 'border-green-500/50 bg-green-50/30 dark:bg-green-950/20'
  }

  return (
    <div className="group relative">
      <Card className={cn("w-full rounded-xl shadow-sm", getStatusColor())}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Task Number & Title */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-foreground leading-tight truncate">{task.title}</h3>
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                  {task.description}
                </p>
              )}

              {/* Task Details */}
              <div className="space-y-2">
                {/* Deadline */}
                {deadlineInfo && (
                  <div className={cn(
                    "flex items-center gap-2 text-xs px-2 py-1 rounded-lg w-fit",
                    deadlineInfo.isOverdue && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                    deadlineInfo.isDueToday && "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
                    deadlineInfo.isDueTomorrow && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
                    !deadlineInfo.isOverdue && !deadlineInfo.isDueToday && !deadlineInfo.isDueTomorrow && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  )}>
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span className="font-medium">
                      {deadlineInfo.isOverdue ? 'Overdue' : 
                       deadlineInfo.isDueToday ? 'Due today' :
                       deadlineInfo.isDueTomorrow ? 'Due tomorrow' : 'Due'}
                      {' '}{deadlineInfo.formatted}
                    </span>
                  </div>
                )}

                {/* Assigned Member */}
                {assignedMember && (
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    Assigned to: 
                    <span className="px-2 py-1 bg-secondary/80 rounded-full text-secondary-foreground font-medium">
                      {assignedMember}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Arrow */}
      {index < totalTasks - 1 && (
        <div className="flex items-center justify-center my-4">
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-gradient-to-b from-transparent via-border to-border"></div>
            <ArrowRight className="h-4 w-4 text-muted-foreground/60 rotate-90" />
            <div className="w-0.5 h-4 bg-gradient-to-b from-border via-border to-transparent"></div>
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

  const [filter, setFilter] = useState<'all' | 'overdue' | 'today' | 'tomorrow'>('all')

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
        case 'tomorrow':
          return isTomorrow(deadline)
        default:
          return true
      }
    })
  }, [projectTasks, filter])

  // Task statistics
  const taskStats = useMemo(() => {
    const total = projectTasks.length
    const withDeadlines = projectTasks.filter(t => t.deadline).length
    const overdue = projectTasks.filter(t => t.deadline && isPast(new Date(t.deadline)) && !isToday(new Date(t.deadline))).length
    const dueToday = projectTasks.filter(t => t.deadline && isToday(new Date(t.deadline))).length
    
    return { total, withDeadlines, overdue, dueToday }
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
    <section className="w-full max-w-3xl mx-auto space-y-4 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Project Tasks</h2>
          <p className="text-muted-foreground text-sm">
            Manage and track your project tasks efficiently
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

          <div className="bg-card rounded-xl p-3 border text-center">
            <p className="text-2xl font-bold text-foreground">{taskStats.total}</p>
            <p className="text-xs text-muted-foreground">Total Tasks</p>
          </div>
      
          <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-3 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{taskStats.dueToday}</p>
            <p className="text-xs text-orange-600 dark:text-orange-400">Due Today</p>
          </div>

          <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-3 border border-red-200 dark:border-red-800 text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{taskStats.overdue}</p>
            <p className="text-xs text-red-600 dark:text-red-400">Missed Deadlines</p>
          </div>

        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className="rounded-lg"
        >
          All Tasks ({projectTasks.length})
        </Button>
        <Button
          variant={filter === 'overdue' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('overdue')}
          className="rounded-lg"
        >
          Overdue ({taskStats.overdue})
        </Button>
        <Button
          variant={filter === 'today' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('today')}
          className="rounded-lg"
        >
          Due Today ({taskStats.dueToday})
        </Button>
        <Button
          variant={filter === 'tomorrow' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('tomorrow')}
          className="rounded-lg"
        >
          Due Tomorrow
        </Button>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No tasks found</h3>
          <p className="text-muted-foreground">Try adjusting your filter or check back later.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              index={projectTasks.findIndex(t => t.id === task.id)}
              totalTasks={filteredTasks.length}
              members={members}
            />
          ))}
        </div>
      )}
    </section>
  )
}
