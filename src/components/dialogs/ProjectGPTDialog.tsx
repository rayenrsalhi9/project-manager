import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Bot, Loader2 } from "lucide-react"

interface ProjectGPTDialogProps {
  onSubmit?: (input: string) => void
  isLoading?: boolean
}

export default function ProjectGPTDialog({ 
  onSubmit,
  isLoading = false 
}: ProjectGPTDialogProps) {
  const [open, setOpen] = useState(false)
  const [userInput, setUserInput] = useState("")

  const handleSubmit = () => {
    if (!userInput.trim() || isLoading) return
    
    // Call the onSubmit callback if provided
    onSubmit?.(userInput)
    
    // Reset and close dialog (can be modified based on parent component needs)
    setUserInput("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-2xl">
          <Bot className="h-4 w-4 mr-2" />
          Ask ProjectGPT
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Ask ProjectGPT
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Describe your project idea and let ProjectGPT generate a comprehensive list of tasks for you. 
            Be as detailed as possible - include your project goals, features, target audience, and any specific requirements. 
            ProjectGPT will analyze your description and create actionable tasks that you can review, edit, and organize.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="projectgpt-input" className="text-sm font-medium">
              Project Description
            </Label>
            <Textarea
              id="projectgpt-input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Describe your project idea... (e.g., 'I want to build a mobile app for fitness tracking with user authentication, workout logging, and progress visualization')"
              className="rounded-xl resize-none min-h-[120px]"
              rows={5}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !userInput.trim()}
              className="rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Tasks'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}