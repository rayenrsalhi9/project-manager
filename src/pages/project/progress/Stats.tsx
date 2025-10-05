import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, TrendingUp, Clock, Calendar as CalendarIcon } from "lucide-react"
import type { StatsProps } from "./types"

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
            description: `${finishedTasks} completed`,
            icon: CheckCircle2,
        },
        {
            title: "Completion Rate",
            value: `${completionRate}%`,
            description: `${finishedTasks} of ${totalTasks} tasks finished`,
            icon: TrendingUp,
            progress: completionRate,
        },
        {
            title: "In Progress",
            value: inProgressTasks,
            description: "Currently in progress",
            icon: Clock,
        },
        {
            title: "Overdue",
            value: overdueTasks,
            description: "Past deadline",
            icon: CalendarIcon,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <Card key={index} className="rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-xs text-muted-foreground">{card.description}</p>
                        {card.progress ? (
                            <div className="w-full bg-muted-foreground/20 rounded-full h-2.5 mt-4">
                                <div
                                    className="bg-foreground h-2.5 rounded-full"
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