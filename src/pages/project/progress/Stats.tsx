import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, TrendingUp, Clock, Calendar as CalendarIcon } from "lucide-react"
import type { StatsProps } from "./types"
import { cn } from "@/lib/utils"

const Stats = ({
    totalTasks,
    finishedTasks,
    inProgressTasks,
    completionRate,
    overdueTasks,
}: StatsProps) => {

    const cards = [
        {
            title: "Total Tasks",
            value: totalTasks,
            description: `${finishedTasks} task${finishedTasks === 1 ? "" : "s"} completed`,
            descriptionStyle: "text-green-700 dark:text-green-200",
            icon: CheckCircle2,
        },
        {
            title: "In Progress",
            value: inProgressTasks,
            description: "Currently in progress",
            icon: Clock,
            className: "border-amber-500 bg-amber-50 text-amber-900 dark:bg-transparent dark:text-amber-200",
        },
        {
            title: "Overdue",
            value: overdueTasks,
            description: "Past deadline",
            icon: CalendarIcon,
            className: "border-red-500 bg-red-50 text-red-900 dark:bg-transparent dark:text-red-200",
        },
        {
            title: "Completion Rate",
            value: `${completionRate}%`,
            description: `${finishedTasks} of ${totalTasks} tasks finished`,
            icon: TrendingUp,
            progress: completionRate,
            className: "border-green-500 bg-green-50 text-green-900 dark:bg-transparent dark:text-green-200",
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <Card
                    key={index}
                    className={cn(
                        "rounded-2xl h-fit",
                        card.className
                    )}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className="h-4 w-4 text-black dark:text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className={cn(
                            "text-xs text-muted-foreground",
                            card.descriptionStyle
                        )}>{card.description}</p>
                        {card.progress ? (
                            <div className="w-full bg-muted-foreground/20 rounded-full h-2.5 mt-4">
                                <div
                                    className="bg-green-900 h-2.5 rounded-full dark:bg-green-200"
                                    style={{ width: `${card.progress}%` }}
                                ></div>
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default Stats