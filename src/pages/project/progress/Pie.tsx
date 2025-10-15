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
  submittedTasks,
  totalTasks,
}: PieChartProps) => {

  const completionRateData = [
    { name: "Finished", value: finishedTasks, color: "#4ade80" },
    { name: "In Progress", value: inProgressTasks, color: "#f59e0b" },
  ]

  const statusData = [
    { name: "Overdue", value: overdueTasks, color: "#dc2626" },
    { name: "Due Today", value: dueTodayTasks, color: "#f59e0b" },
    { name: "Due Tomorrow", value: dueTomorrowTasks, color: "#2563eb" },
    { name: "Remaining", value: remainingTasks, color: "#60a5fa" },
  ]

  const submissionRateData = [
    { name: "Submitted", value: submittedTasks, color: "#3b82f6" },
    { name: "Not Submitted", value: totalTasks - submittedTasks, color: "#ef4444" },
  ]

  return (
    <section className="flex flex-col gap-4">
      {/* Task Completion Rate */}
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
                outerRadius={75}
                innerRadius={35}
                label={({ percent }: any) => `${(percent * 100).toFixed(2)}%`}
              >
                {completionRateData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Task Status */}
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
                outerRadius={75}
                innerRadius={35}
                label={({ percent }: any) => percent > 0 ? `${(percent * 100).toFixed(2)}%` : ''}
              >
                {statusData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Task Submission Rate */}
      <Card className="my-6">
        <CardHeader>
          <CardTitle>Task Submission Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Legend />
              <Pie
                data={submissionRateData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={35}
                label={({ percent }: any) => `${(percent * 100).toFixed(1)}%`}
              >
                {submissionRateData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              {submittedTasks} out of {totalTasks} tasks submitted
            </p>
          </div>
        </CardContent>
      </Card>
      
    </section>
  )

}

export default pieChart