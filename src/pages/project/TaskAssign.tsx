import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import type { Member } from "@/layout/ProjectLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Calendar, Check } from "lucide-react"

export default function TaskAssign() {

    const {members} = useOutletContext<{members: Member[]}>()
    const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  return (
    <>
      <form 
        className="w-full max-w-2xl mx-auto space-y-4 pb-8"
        aria-label="create task form"
        aria-describedby="form-description"
      >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-display">Create New Task</h2>
        <p className="text-muted-foreground">Assign work to your team members</p>
      </div>

      <div 
        id="form-description" 
        className="absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap border-0"
        aria-hidden="false"
      >
        Use this form to create a new task and assign it to a team member. Fill in the task details and select a team member.
      </div>

      {/* Task Details Form */}
      <Card className="form-section">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Task Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="task-name">Task Name</Label>
            <Input
              id="task-name"
              name="task-name"
              placeholder="Enter task name..."
              className="h-12 text-base"
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the task requirements..."
              className="min-h-[120px] text-base resize-none w-full px-3 py-2 border border-input rounded-md bg-background"
              required
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <div className="relative">
              <Input
                id="due-date"
                name="due-date"
                type="date"
                className="h-12 text-base pl-12"
                required
                aria-required="true"
              />
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Innovative Team Assignment Interface */}
      <Card className="form-section">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Assign to Team Member
          </CardTitle>
          <p className="text-muted-foreground">Select a team member to assign this task</p>
        </CardHeader>
        <CardContent>
          {/* Team Member Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {members.map((member: Member, index: number) => (
              <div
                key={index}
                onClick={() => setSelectedMember(member)}
                className={`assignee-card p-4 cursor-pointer hover:bg-accent/50 transition-colors border border-gray-200 rounded-lg ${selectedMember?.user_id === member.user_id ? "border-blue-500 bg-blue-50" : ''} `}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedMember(member)
                  }
                }}
                aria-pressed={selectedMember?.user_id === member.user_id}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {`${member.full_name[0]}${member.full_name[0]}`}
                      </AvatarFallback>
                    </Avatar>
                    {selectedMember?.user_id === member.user_id && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{member.full_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={member.role === "admin" ? "default" : "secondary"} className="text-xs">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Member Display */}
          {selectedMember ? (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {`${selectedMember.full_name[0]}${selectedMember.full_name[0]}`}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-primary">Task will be assigned to {selectedMember.full_name}</p>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button 
          type="submit" 
          className="px-12 py-6 font-semibold cursor-pointer"
        >
          Create Task
        </Button>
      </div>
    </form>
    </>
  )
}