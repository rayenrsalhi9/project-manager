import type { Task } from "./types"

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

    if (task.deadline && new Date(task.deadline.setHours(0, 0, 0, 0)) < new Date(new Date().setHours(0, 0, 0, 0))) {
        errors['deadline'] = "Deadline must be in the future"
    }

    return errors
}