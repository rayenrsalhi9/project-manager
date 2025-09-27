import { useAuth } from "@/context/AuthContext"
import { useOutletContext } from "react-router-dom"
import type { Member } from "@/layout/ProjectLayout"

import TasksReadOnly from "@/pages/project/TasksReadOnly"
import Tasks from "@/pages/project/Tasks"

export default function TasksProtected() {

    const {user} = useAuth()
    const {members} = useOutletContext<{members: Member[]}>()

    const userRole = members.find(member => member.user_id === user?.id)?.role || 'member'

    if (userRole === 'admin') {
        return <Tasks />
    }
    return <TasksReadOnly />
}
