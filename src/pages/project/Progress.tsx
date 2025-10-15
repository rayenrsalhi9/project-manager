import type { Task } from "./tasks/types"
import { ChartNoAxesCombined } from "lucide-react"
import type { Member } from "@/layout/ProjectLayout"
import { useOutletContext } from "react-router-dom"
import { isPast, isToday, isTomorrow } from "date-fns"
import Stats from "./progress/Stats"
import PieChart from "./progress/Pie"
import BarChart from "./progress/BarChart"

const Progress = () => {

    const { projectTasks: tasks, members } = useOutletContext<{ projectTasks: Task[]; members: Member[] }>()

    // calculate statistics
    const totalTasks = tasks.length
    const finishedTasks = tasks.filter(task => task.status === "finished").length
    const inProgressTasks = tasks.filter(task => task.status === "in_progress").length
    const submittedTasks = tasks.filter(task => task.is_submitted).length
    const completionRate = totalTasks > 0 ? Math.round((finishedTasks / totalTasks) * 100) : 0
    const submissionRate = totalTasks > 0 ? Math.round((submittedTasks / totalTasks) * 100) : 0

    // calculate task status
    const overdueTasks = tasks.filter(task => {
        if (!task.deadline) return null
        return isPast(task.deadline) && !isToday(task.deadline)
    }).length
    const dueTodayTasks = tasks.filter(task => {
        if (!task.deadline) return null
        return isToday(task.deadline)
    }).length
    const dueTomorrowTasks = tasks.filter(task => {
        if (!task.deadline) return null
        return isTomorrow(task.deadline)
    }).length
    // calculate remaining tasks (not overdue, not today, not tomorrow)
    const remainingTasks = tasks.filter(task => {
        if (!task.deadline) return true
        return !isPast(task.deadline) && !isToday(task.deadline) && !isTomorrow(task.deadline)
    }).length

    return (
        <section className="w-full max-w-3xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
                <ChartNoAxesCombined className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold text-foreground">
                    Project Progress
                </h2>
            </div>
            <p className="text-sm text-muted-foreground">
                Track overall completion, upcoming deadlines, and team performance metrics in one place.
            </p>

            {/* Stats Overview */}
            <Stats
                totalTasks={totalTasks}
                finishedTasks={finishedTasks}
                inProgressTasks={inProgressTasks}
                completionRate={completionRate}
                submissionRate={submissionRate}
                overdueTasks={overdueTasks}
                submittedTasks={submittedTasks}
            />

            {/* Pie Chart Visualization */}
            <PieChart
                finishedTasks={finishedTasks}
                inProgressTasks={inProgressTasks}
                overdueTasks={overdueTasks}
                dueTodayTasks={dueTodayTasks}
                dueTomorrowTasks={dueTomorrowTasks}
                remainingTasks={remainingTasks}
                submittedTasks={submittedTasks}
                totalTasks={totalTasks}
            />

            {/* Bar Chart Visualization */}
            <BarChart
                members={members}
                projectTasks={tasks}
            />
        </section>
    )
}

export default Progress