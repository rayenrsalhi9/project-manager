import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StatsProps } from "./types"

const PieChart = ({ totalTasks, finishedTasks, inProgressTasks }: Pick<StatsProps, 'totalTasks' | 'finishedTasks' | 'inProgressTasks'>) => {
  // Calculate percentages
  const finishedPercentage = totalTasks > 0 ? (finishedTasks / totalTasks) * 100 : 0
  const inProgressPercentage = totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0
  const remainingPercentage = totalTasks > 0 ? ((totalTasks - finishedTasks - inProgressTasks) / totalTasks) * 100 : 0

  // Calculate SVG path for pie chart
  const radius = 80
  const centerX = 100
  const centerY = 100
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  const createArcPath = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle)
    const end = polarToCartesian(x, y, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    return [
      "M", x, y,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ")
  }

  // Calculate angles for each segment
  const currentAngle = 0
  const finishedAngle = (finishedPercentage / 100) * 360
  const inProgressAngle = (inProgressPercentage / 100) * 360
  const remainingAngle = (remainingPercentage / 100) * 360

  return (
    <Card className="rounded-2xl my-8">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Task Completion Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
            {/* Finished tasks - Green */}
            {finishedPercentage > 0 && (
              <path
                d={createArcPath(centerX, centerY, radius, currentAngle, currentAngle + finishedAngle)}
                fill="#16a34a"
                className="transition-all duration-300 hover:opacity-80"
              />
            )}
            
            {/* In Progress tasks - Yellow */}
            {inProgressPercentage > 0 && (
              <path
                d={createArcPath(centerX, centerY, radius, currentAngle + finishedAngle, currentAngle + finishedAngle + inProgressAngle)}
                fill="#f59e0b"
                className="transition-all duration-300 hover:opacity-80"
              />
            )}
            
            {/* Remaining tasks - Gray */}
            {remainingPercentage > 0 && (
              <path
                d={createArcPath(centerX, centerY, radius, currentAngle + finishedAngle + inProgressAngle, currentAngle + finishedAngle + inProgressAngle + remainingAngle)}
                fill="#6b7280"
                className="transition-all duration-300 hover:opacity-80"
              />
            )}
            
            {/* Center circle for aesthetic */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.6}
              fill="white"
              className="dark:fill-gray-900"
            />
          </svg>
        </div>
        
        {/* Legend */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span className="text-sm text-muted-foreground">Finished</span>
            </div>
            <span className="text-sm font-medium">{finishedTasks}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
            <span className="text-sm font-medium">{inProgressTasks}</span>
          </div>
          
          {remainingPercentage > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-sm text-muted-foreground">Not Started</span>
              </div>
              <span className="text-sm font-medium">{Math.round(remainingPercentage)}%</span>
            </div>
          )}
        </div>
        
        {/* Completion Rate */}
        <div className="mt-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round(finishedPercentage)}%
            </div>
            <div className="text-xs text-muted-foreground">Overall Completion</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PieChart