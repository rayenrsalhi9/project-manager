import type { BarChartProps } from "./types"
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const BarChartComponent = ({
  members,
  projectTasks,
}: BarChartProps) => {

  // Calculate task distribution per member
  const memberTaskData = members
    .filter(m => m.role === "member")
    .map(member => {
      const assignedTasks = projectTasks.filter(task => task.assigned_to === member.user_id)
      const completedTasks = assignedTasks.filter(task => task.status === "finished").length
      const remainingTasks = assignedTasks.filter(task => task.status !== "finished").length
      
      return {
        name: member.full_name,
        completed: completedTasks,
        remaining: remainingTasks,
      }
  })

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle>Tasks progress per member</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={memberTaskData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                value, 
                name === 'completed' ? 'Completed Tasks' : 'Remaining Tasks'
              ]}
              labelFormatter={(label) => `Member: ${label}`}
            />
            <Legend 
              formatter={(value) => 
                value === 'completed' ? 'Completed Tasks' : 'Remaining Tasks'
              }
            />
            <Bar 
              dataKey="completed" 
              fill="#4ade80" 
              name="completed"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="remaining" 
              fill="#f59e0b" 
              name="remaining"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default BarChartComponent