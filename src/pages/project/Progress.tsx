import type { Task } from "./tasks/types"
import { useOutletContext } from "react-router-dom"
import { isPast, isToday } from "date-fns"
import Stats from "./progress/Stats"
import PieChart from "./progress/Pie"

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
            <Stats
                totalTasks={totalTasks}
                finishedTasks={finishedTasks}
                inProgressTasks={inProgressTasks}
                completionRate={completionRate}
                overdueTasks={overdueTasks}
            />

            {/* Pie Chart Visualization */}
            <PieChart
                totalTasks={totalTasks}
                finishedTasks={finishedTasks}
                inProgressTasks={inProgressTasks}
            />
        </section>
    )
}

export default Progress