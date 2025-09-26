import { supabase } from "@/supabase"

import type { Task } from "./types"
import type { Member } from "@/layout/ProjectLayout"

export const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export const validateTask = (task: Omit<Task, 'id'>): Record<string, string> => {

    const errors: Record<string, string> = {}

    if (!task.title.trim()) {
        errors['title'] = "Title is required"
    }
    if (!task.description.trim()) {
        errors['description'] = "Description is required"
    }

    if (task.deadline && new Date(task.deadline) < new Date(new Date())) {
        errors['deadline'] = "Deadline must be in the future"
    }

    return errors
}

const formatDateToTimestamtz = (date: Date | undefined): string => {
    if (!date) {
        return ''
    }
    return date.toISOString();
}

export const getMatchingFullName = (members: Member[], memberId: string): string => {
    const member = members.find(member => member.user_id === memberId)
    return member?.full_name || ''
}

export const handleTasksSubmit = async (
    tasks: Task[], 
    projectId: string,
    adminId: string,
) => {

    for (const task of tasks) {
        const errors = validateTask(task)
        if (Object.keys(errors).length > 0) {
            throw errors
        }
    }

    const supabaseTasksArr = tasks.map(task => ({
        title: task.title,
        description: task.description,
        deadline: formatDateToTimestamtz(task.deadline),
        project_id: projectId,
        created_by: adminId,
        assigned_to: task.assigned_to
    }))

    try {
        const { error } = await supabase
            .from('tasks')
            .insert(supabaseTasksArr)
        if (error) throw error
        return { success: true, message: 'Tasks successfully set up'}
    } catch (error) {
        console.error('Error inserting tasks:', (error as Error).message)
        return { success: false, error: (error as Error).message }
    }

}

export const processTasks = (tasks: Task[], projectTasks: Task[]) => {

    // get the list of IDs of both lists 
    const projectTasksIDs = projectTasks.map(el => el.id)
    const tasksIDs = tasks.map(el => el.id)

    // find new tasks created
    const newCreatedTasks = tasks.filter(el => 
        !projectTasksIDs.includes(el.id)
    )

    // find deleted tasks
    const deletedTasks = projectTasks.filter(el => 
        !tasksIDs.includes(el.id)
    )

    // find updated tasks
    const updatedTasks = tasks
        .filter(el => 
            projectTasksIDs.includes(el.id) && tasksIDs.includes(el.id)
        )
        .filter(el => 
            hasTaskChanged(el, projectTasks)
        )

    console.log('new tasks: ', newCreatedTasks)
    console.log('deleted tasks: ', deletedTasks)
    console.log('updated tasks: ', updatedTasks)
}

const hasTaskChanged = (task: Task, projectsArr: Task[]) => {

    const targetTask = projectsArr.find((el: Task) => el.id === task.id)
    if (!targetTask) return 

    return (
        task.title !== targetTask.title ||
        task.description !== targetTask.description ||
        task.deadline !== targetTask.deadline ||
        task.assigned_to !== targetTask.assigned_to ||
        JSON.stringify(task) !== JSON.stringify(targetTask)
    )
}