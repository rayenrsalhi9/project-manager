import { useActionState, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Users } from "lucide-react"
import { getMatchingProject, userNotAlreadyMember, addUserToMembers } from "@/utils"
import { toast } from "sonner"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

type PrevState = {
  success: boolean
  message?: string
  error?: string
}

export default function JoinProjectDialog() {

  const { session } = useAuth()
  const navigate = useNavigate()
  const [joinOpen, setJoinOpen] = useState(false)

  if (!session) throw new Error('No active session found. Please login to continue.')

  const [joinState, joinAction, joinPending] = useActionState(
    async (_prevState: PrevState | null, formData: FormData) => {
      try {
        const secretCode = formData.get('secret-code') as string
        
        // checking project existence
        const { success, error, data } = await getMatchingProject(
          secretCode,
          session.user.id
        )

        // project does not exist, exit
        if (!success && error) {
          return { success, error }
        }

        // project existing, check if user already member
        if (success && data) {
          const { id: projectId } = data
          const userId = session.user.id

          // check user already a member
          const {
            success: userNotMemberSuccess,
            error: userNotMemberError
          } = await userNotAlreadyMember(projectId, userId)

          // user already a member, exit
          if (!userNotMemberSuccess && userNotMemberError) return {
            success: userNotMemberSuccess,
            error: userNotMemberError
          }

          // user not found in members list, add him
          if (userNotMemberSuccess) {
            // add user to members list
            const {
              success: addMemberSuccess,
              error: addMemberError,
              message: addMemberMessage
            } = await addUserToMembers(projectId, userId)

            // error occurred, return
            if (!addMemberSuccess && addMemberError) {
              console.error(addMemberError)
              return { success: addMemberSuccess, error: addMemberError }
            }

            // success, alert operation success
            if (addMemberSuccess && addMemberMessage) {
              toast.success('Project found successfully!', {
                style: {
                  background: '#f9fafb',
                  border: '1px solid #d1d5db',
                  color: '#1f2937'
                }
              })
              navigate(`/dashboard/projects/${projectId}`)
              return {
                success: addMemberSuccess,
                message: addMemberMessage
              }
            }

            // unexpected error handling
            return {
              success: false,
              error: 'Unexpected error occurred, please try again later.'
            }
          }

          // unexpected error handling
          return {
            success: false,
            error: 'Unexpected error occurred, please try again later.'
          }
        }

        // unexpected error handling
        return {
          success: false,
          error: 'Unexpected error occurred, please try again later.'
        }

      } catch (err) {
        console.error(`An error occurred creating a project:${err}`)
        return { success: false, error: 'Failed to join project. Please try again.' }
      }
    },
    null
  )

  // Close dialog when action completes successfully
  useEffect(() => {
    if (joinState?.success) {
      setJoinOpen(false)
    }
  }, [joinState])

  return (
    <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Join project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={joinAction} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Join Project</DialogTitle>
            <DialogDescription>Enter the secret code to join an existing project</DialogDescription>
          </DialogHeader>
          
          {
            joinState?.error
              ? (
                <div className="bg-gray-100 border border-gray-300 text-gray-900 px-4 py-3 rounded-md text-sm">
                  {joinState.error}
                </div>
              )
              : null
          }
          
          <div className="space-y-4">
            <div>
              <label htmlFor="secret-code" className="block text-sm font-medium mb-2">
                Secret Code
              </label>
              <input
                id="secret-code"
                name="secret-code"
                type="text"
                placeholder="Enter secret code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={joinPending}
            >
              {joinPending ? 'Joining...' : 'Join project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}