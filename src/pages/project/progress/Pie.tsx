import type { PieChartProps } from "./types"

import { 
  ResponsiveContainer, 
  PieChart, 
  Pie,  
  Legend,
  Cell
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const pieChart = ({
  finishedTasks,
  inProgressTasks,
  overdueTasks,
  dueTodayTasks,
  dueTomorrowTasks,
  remainingTasks,
}: PieChartProps) => {

  const completionRateData = [
    { name: "Finished", value: finishedTasks, color: "#4ade80" },
    { name: "In Progress", value: inProgressTasks, color: "#f59e0b" },
  ]

  const statusData = [
    { name: "Overdue", value: overdueTasks, color: "#f43f5e" },
    { name: "Due Today", value: dueTodayTasks, color: "#eab308" },
    { name: "Due Tomorrow", value: dueTomorrowTasks, color: "#3b82f6" },
    { name: "Remaining", value: remainingTasks, color: "#93c5fd" },
  ]

  return (
    <>
    <Card className="my-6">
      <CardHeader>
        <CardTitle>Task Completion Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Legend />
            <Pie
              data={completionRateData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(2)}%`}
            >
              {completionRateData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <Card className="my-6">
      <CardHeader>
        <CardTitle>Task Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Legend />
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              label={({ name, percent }: any) => percent > 0 ? `${name}: ${(percent * 100).toFixed(2)}%` : ''}
            >
              {statusData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    </>
  )

}

export default pieChart