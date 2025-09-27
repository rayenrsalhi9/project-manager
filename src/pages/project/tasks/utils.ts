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
    try {
        // Ensure we have a valid Date object
        const validDate = date instanceof Date ? date : new Date(date);
        if (isNaN(validDate.getTime())) {
            console.warn('Invalid date provided to formatDateToTimestamtz:', date);
            return '';
        }
        return validDate.toISOString();
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
}

export const normalizeTaskDates = (tasks: Task[]): Task[] => {
    return tasks.map(task => {
        let normalizedDeadline = task.deadline;
        
        if (task.deadline) {
            try {
                // Handle both string and Date objects
                if (typeof task.deadline === 'string') {
                    normalizedDeadline = new Date(task.deadline);
                } else if (task.deadline instanceof Date) {
                    normalizedDeadline = task.deadline;
                } else {
                    console.warn('Unknown deadline format:', task.deadline);
                    normalizedDeadline = undefined;
                }
                
                // Validate the date
                if (normalizedDeadline && isNaN(normalizedDeadline.getTime())) {
                    console.warn('Invalid date found during normalization:', task.deadline);
                    normalizedDeadline = undefined;
                }
            } catch (error) {
                console.error('Error normalizing task date:', error);
                normalizedDeadline = undefined;
            }
        }
        
        return {
            ...task,
            deadline: normalizedDeadline
        };
    })
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

    return {newCreatedTasks, updatedTasks, deletedTasks}
}

export const createNewTasks = async (
    tasks: Task[], 
    projectId: string,
    adminId: string,
): Promise<{ success: boolean; error?: string }> => {
    try {
        if (!tasks || tasks.length === 0) {
            return { success: true }
        }

        if (!projectId || !adminId) {
            throw new Error('Project ID and Admin ID are required')
        }

        // Validate all tasks before creating
        for (const task of tasks) {
            const errors = validateTask(task)
            if (Object.keys(errors).length > 0) {
                throw new Error(`Validation failed for task "${task.title}": ${Object.values(errors).join(', ')}`)
            }
        }

        const supabaseTasksArr = tasks.map(task => ({
            title: task.title.trim(),
            description: task.description.trim(),
            deadline: formatDateToTimestamtz(task.deadline),
            project_id: projectId,
            created_by: adminId,
            assigned_to: task.assigned_to
        }))

        const { error } = await supabase
            .from('tasks')
            .insert(supabaseTasksArr)
        
        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Error creating new tasks:', (error as Error).message)
        return { success: false, error: (error as Error).message }
    }
}

export const updateExistingTasks = async (
    tasks: Task[]
): Promise<{ success: boolean; error?: string }> => {
    try {
        if (!tasks || tasks.length === 0) {
            return { success: true }
        }

        // Validate all tasks before updating
        for (const task of tasks) {
            if (!task.id) {
                throw new Error('Task ID is required for updates')
            }
            
            const errors = validateTask(task)
            if (Object.keys(errors).length > 0) {
                throw new Error(`Validation failed for task "${task.title}": ${Object.values(errors).join(', ')}`)
            }
        }

        const updatePromises = tasks.map(async (task) => {
            const { error } = await supabase
                .from('tasks')
                .update({
                    title: task.title.trim(),
                    description: task.description.trim(),
                    deadline: formatDateToTimestamtz(task.deadline),
                    assigned_to: task.assigned_to
                })
                .eq('id', task.id)
            
            if (error) throw error
        })

        await Promise.all(updatePromises)
        return { success: true }
    } catch (error) {
        console.error('Error updating existing tasks:', (error as Error).message)
        return { success: false, error: (error as Error).message }
    }
}

export const deleteTasks = async (
    tasks: Task[]
): Promise<{ success: boolean; error?: string }> => {
    try {
        if (!tasks || tasks.length === 0) {
            return { success: true }
        }

        const taskIds = tasks.map(task => task.id).filter(id => id)
        
        if (taskIds.length === 0) {
            throw new Error('No valid task IDs provided for deletion')
        }
        
        const { error } = await supabase
            .from('tasks')
            .delete()
            .in('id', taskIds)
        
        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Error deleting tasks:', (error as Error).message)
        return { success: false, error: (error as Error).message }
    }
}

export const processTaskChanges = async (
    newCreatedTasks: Task[],
    updatedTasks: Task[],
    deletedTasks: Task[],
    projectId: string,
    adminId: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        if (!projectId || !adminId) {
            throw new Error('Project ID and Admin ID are required')
        }

        // Create new tasks
        if (newCreatedTasks.length > 0) {
            const createResult = await createNewTasks(newCreatedTasks, projectId, adminId)
            if (!createResult.success) {
                throw new Error(createResult.error || 'Failed to create new tasks')
            }
        }

        // Update existing tasks
        if (updatedTasks.length > 0) {
            const updateResult = await updateExistingTasks(updatedTasks)
            if (!updateResult.success) {
                throw new Error(updateResult.error || 'Failed to update existing tasks')
            }
        }

        // Delete removed tasks
        if (deletedTasks.length > 0) {
            const deleteResult = await deleteTasks(deletedTasks)
            if (!deleteResult.success) {
                throw new Error(deleteResult.error || 'Failed to delete tasks')
            }
        }

        return { success: true }
    } catch (error) {
        console.error('Error processing task changes:', (error as Error).message)
        return { success: false, error: (error as Error).message }
    }
}

const hasTaskChanged = (task: Task, projectsArr: Task[]): boolean => {

    const targetTask = projectsArr.find((el: Task) => el.id === task.id)
    if (!targetTask) return false

    // Convert deadline to Date objects for consistent comparison
    const taskDeadline = task.deadline instanceof Date ? task.deadline : (task.deadline ? new Date(task.deadline) : undefined)
    const targetDeadline = targetTask.deadline instanceof Date ? targetTask.deadline : (targetTask.deadline ? new Date(targetTask.deadline) : undefined)

    return (
        task.title !== targetTask.title ||
        task.description !== targetTask.description ||
        taskDeadline?.getTime() !== targetDeadline?.getTime() ||
        task.assigned_to !== targetTask.assigned_to
    )
}

export const hasChanges = (tasks: Task[], projectTasks: Task[]): boolean => {
    // Check if there are any changes between current tasks and original project tasks
    const {newCreatedTasks, updatedTasks, deletedTasks} = processTasks(tasks, projectTasks)
    
    // If any of these arrays have items, changes were made
    return newCreatedTasks.length > 0 || updatedTasks.length > 0 || deletedTasks.length > 0
}