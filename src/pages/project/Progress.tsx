import type { Task } from "./tasks/types"
import { useOutletContext } from "react-router-dom"
import { isPast, isToday } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, TrendingUp, Clock, Calendar as CalendarIcon } from "lucide-react"

const Progress = () => {

    const { projectTasks: tasks } = useOutletContext<{ projectTasks: Task[] }>()

    // calculate statistics
    const totalTasks = tasks.length
    const finishedTasks = tasks.filter(task => task.status === "finished").length
    const inProgressTasks = tasks.filter(task => task.status === "in_progress").length
    const completionRate = totalTasks > 0 ? Math.round((finishedTasks / totalTasks) * 100) : 0

    // calculate overdue tasks
    const overdueTasks = tasks.filter(task => {
        if (!task.deadline) return null
        return isPast(task.deadline) && !isToday(task.deadline)
    }).length

    return (
        <section className="w-full max-w-3xl mx-auto space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
                Project Progress
            </h2>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTasks}</div>
                        <p className="text-xs text-muted-foreground">{finishedTasks} completed</p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completionRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            {finishedTasks} of {totalTasks} tasks finished
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProgressTasks}</div>
                        <p className="text-xs text-muted-foreground">Currently in progress</p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overdueTasks}</div>
                        <p className="text-xs text-muted-foreground">Past deadline</p>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

export default Progress