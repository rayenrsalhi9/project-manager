export type StatsProps = {
    totalTasks: number
    finishedTasks: number
    inProgressTasks: number
    completionRate: number
    overdueTasks: number
}

export type PieChartProps = {
    finishedTasks: number
    inProgressTasks: number
    overdueTasks: number
    dueTodayTasks: number
    dueTomorrowTasks: number
    remainingTasks: number
}
