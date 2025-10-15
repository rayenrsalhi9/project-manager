import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, Calendar as CalendarIcon, Percent } from "lucide-react"
import type { StatsProps } from "./types"
import { cn } from "@/lib/utils"

const Stats = ({
    totalTasks,
    finishedTasks,
    inProgressTasks,
    completionRate,
    submissionRate,
    overdueTasks,
    submittedTasks,
}: StatsProps) => {

    const cards = [
        {
            title: "Total Tasks",
            value: totalTasks,
            description: `${submittedTasks} submitted out of ${totalTasks} total`,
            descriptionStyle: "text-gray-700 dark:text-gray-300",
            icon: CheckCircle2,
            progress: totalTasks > 0 ? Math.round((submittedTasks / totalTasks) * 100) : 0,
        },
        {
            title: "In Progress",
            value: inProgressTasks,
            description: "Currently in progress",
            icon: Clock,
            className: "border-gray-300 bg-white text-black dark:bg-black dark:text-white",
        },
        {
            title: "Overdue",
            value: overdueTasks,
            description: "Past deadline",
            icon: CalendarIcon,
            className: "border-gray-300 bg-white text-black dark:bg-black dark:text-white",
        },
        {
            title: "Completion Rate",
            value: `${completionRate}%`,
            description: `${finishedTasks} of ${totalTasks} tasks finished`,
            icon: Percent,
            progress: completionRate,
            className: "border-gray-300 bg-white text-black dark:bg-black dark:text-white",
        }, 
        {
            title: "Submission Rate",
            value: `${submissionRate}%`,
            description: `${submittedTasks} of ${totalTasks} tasks submitted`,
            icon: Percent,
            progress: submissionRate,
            className: "border-gray-300 bg-white text-black dark:bg-black dark:text-white",
        }, 
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
                        <CardTitle className="text-sm font-medium text-black dark:text-white">{card.title}</CardTitle>
                        <card.icon className="h-4 w-4 text-black dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black dark:text-white">{card.value}</div>
                        <p className={cn(
                            "text-xs text-gray-600 dark:text-gray-400",
                            card.descriptionStyle
                        )}>{card.description}</p>
                        {card.progress ? (
                            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2.5 mt-4">
                                <div
                                    className="h-2.5 rounded-full bg-black dark:bg-white"
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