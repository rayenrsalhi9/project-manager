import type { StatsProps } from "./types"

import { 
  ResponsiveContainer, 
  PieChart, 
  Pie,  
  Legend,
  Cell
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const pieChart = ({finishedTasks,inProgressTasks,
}: Pick<StatsProps, "finishedTasks" | "inProgressTasks">) => {

  const data = [
    { name: "Finished", value: finishedTasks, color: "#4ade80" },
    { name: "In Progress", value: inProgressTasks, color: "#f59e0b" },
  ]

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle>Task Completion Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Legend />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
            >
              {data.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )

}

export default pieChart