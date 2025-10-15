import type { Member } from "@/layout/ProjectLayout"
import type { Task } from "@/pages/project/tasks/types"

export type StatsProps = {
    totalTasks: number
    finishedTasks: number
    inProgressTasks: number
    completionRate: number
    submissionRate: number
    overdueTasks: number
    submittedTasks: number
}

export type PieChartProps = {
    finishedTasks: number
    inProgressTasks: number
    overdueTasks: number
    dueTodayTasks: number
    dueTomorrowTasks: number
    remainingTasks: number
    submittedTasks: number
    totalTasks: number
}

export type BarChartProps = {
    members: Member[]
    projectTasks: Task[]
}
