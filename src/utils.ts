import DOMPurify from 'dompurify'
import { supabase } from './supabase';
import type { NotificationType } from './context/AuthContext';

type ValidationFields = {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

type ValidationOptions = {
    requireEmail?: boolean;
    requirePassword?: boolean;
    requirePasswordConfirmation?: boolean;
    requireName?: boolean;
    customEmailRegex?: RegExp;
    customPasswordRegex?: RegExp;
    minPasswordLength?: number;
}

type ProjectFunctionResponse = {
    success: boolean
    error?: string
    message?: string
    data?: {id: number} 
}

export type UserProject = {
    id: number,
    name: string,
    description: string,
    role: string[]
}

export type UserTask = {
    id: string
    title: string
    description: string
    project_id: number
    created_by: string
    assigned_to: string
    status: string
    created_at: string
    updated_at: string
    deadline: string
}

export function validateFields(
    fields: ValidationFields,
    options: ValidationOptions = {}
): string | null {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

    const {
        requireEmail = true,
        requirePassword = true,
        requirePasswordConfirmation = true,
        requireName = true,
        customEmailRegex = emailRegex,
        customPasswordRegex = passwordRegex,
        minPasswordLength = 8
    } = options

    const sanitizedFields: ValidationFields = {
        fullName: fields.fullName ? sanitizeField(fields.fullName) : fields.fullName,
        email: fields.email ? sanitizeField(fields.email) : fields.email,
        password: fields.password,
        confirmPassword: fields.confirmPassword
    }

    const { email, password, confirmPassword, fullName } = sanitizedFields;

    // checking required fields
    if (requireEmail && !email?.trim()) {
        return 'Email is required';
    }

    if (requirePassword && !password?.trim()) {
        return 'Password is required';
    }

    if (requirePasswordConfirmation && !confirmPassword?.trim()) {
        return 'Password confirmation is required';
    }

    if (requireName && !fullName?.trim()) {
        return 'Name is required';
    }

    // validate email format
    if (email && !customEmailRegex.test(email.trim())) {
        return 'Please enter a valid email address';
    }

    // validate password strength
    if (password) {
        if (password.length < minPasswordLength) {
            return `Password must be at least ${minPasswordLength} characters long`;
        }

        if (!customPasswordRegex.test(password)) {
            return 'Password must contain at least one lowercase letter, one uppercase letter,  one number, and be at least 8 characters long';
        }
    }

    // check password and password confirmation match
    if (requirePasswordConfirmation && password && confirmPassword) {
        if (password !== confirmPassword) {
        return 'Passwords do not match';
        }
    }

    // if all tests passed, return null
    return null

}

function sanitizeField(field: string): string {
    if (!field) return ''
    return DOMPurify.sanitize(field.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        ALLOW_DATA_ATTR: false, 
        USE_PROFILES: {html: false}, 
        FORBID_TAGS: ['style', 'script'], 
        FORBID_ATTR: ['style', 'on*'], 
        KEEP_CONTENT: true
    })
}

function generateInviteCode(): string {
  const letters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
  let firstPart = '';
  for (let i = 0; i < 3; i++) {
    firstPart += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  const alphanumeric = 'ABCDEFGHIJKLMNPQRSTUVWXYZ23456789';
  let secondPart = '';
  for (let i = 0; i < 4; i++) {
    secondPart += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
  }

  return `${firstPart}-${secondPart}`;
}

export async function createNewProject(
    projectData: {name: string, description: string}, 
    userId: string
): Promise<ProjectFunctionResponse> {

    const sanitizedFields = {
        name: projectData.name ? sanitizeField(projectData.name) : projectData.name,
        description: projectData.description ? sanitizeField(projectData.description) : projectData.description
    }

    const {name, description} = sanitizedFields

    if (!name || !description) {
        return {success: false, error: 'All fields are required'}
    }

    const projectObj = {
        name, description,
        invite_code: generateInviteCode(),
        created_by: userId
    }

    try {
        const {error} = await supabase
            .from('projects')
            .insert(projectObj)

        if (error) return {success: false, error: error.message}
        return {success: true, message: 'Project created successfully'}
    } catch(err) {
        console.error(`Error creating project: ${(err as Error).message}`)
        return {success: false, error: 'Unexpected error occured, please try again later.'}
    }
}

export async function getMatchingProject(
    inviteCode: string,
    userId: string
): Promise<ProjectFunctionResponse> {
    try {
        const {data, error} = await supabase.from('projects')
            .select('id, created_by')
            .eq('invite_code', inviteCode)
            .single()

        if(error) {
            return {
                success: false, 
                error: error.code === 'PGRST116' ? 'Project not found' : error.message
            }
        }

        if (data.created_by === userId) {
            return {
                success: false,
                error: 'You cannot join a project you created.'
            }
        }

        return {success: true, data}

    } catch(err) {
        console.error(`Error getting project code: ${(err as Error).message}`)
        return {success: false, error: 'Unexpected error, please try again.'}
    }
}

export async function userNotAlreadyMember(
    projectId: number, 
    userId: string
): Promise<ProjectFunctionResponse> {

    if (!projectId || !userId) {
        return {
            success: false,
            error: 'An error occured, please try again.'
        }
    }

    try {
        const {data, error} = await supabase
            .from('project_members')
            .select('user_id')
            .eq('user_id', userId)
            .eq('project_id', projectId)
            .maybeSingle()

        if (error) {
            return {success: false, error: 'Database error occurred'}
        }

        if (data) {
            return {
                success: false, 
                error: 'You are already a member of this project.'
            }
        }

        return {success: true}

    } catch(err) {
        console.error(`Error checking member existance: ${(err as Error).message}`)
        return {success: false, error: 'Unexpected error, please try again.'}
    }
}

export async function addUserToMembers(projectId: number, userId: string) {

    if (!projectId || !userId) {
        return {success: false, message: 'Could not join project, please try again.'}
    }

    const memberObj = {
        project_id: projectId,
        user_id: userId,
        role: 'member'
    }

    try {
        const {error} = await supabase
            .from('project_members')
            .insert(memberObj)

        if (error) return {success: false, error: error.message}
        return {success: true, message: 'Successfully joined project'}
    } catch(err) {
        console.error(`Error joining project: ${(err as Error).message}`)
        return {success: false, error: 'Unexpected error occured, please try again later.'}
    }

}

export function formatNotificationTime(timestamp: string): string {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diffInMs = now.getTime() - notificationDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInMinutes < 1) {
        return "just now";
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}min ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    } else {
        const day = notificationDate.getDate();
        const month = notificationDate.toLocaleString('en-US', { month: 'short' });
        const year = notificationDate.getFullYear();
        return `${day} ${month} ${year}`;
    }
}

export async function formatNotifications(notifications: UserTask[]): Promise<NotificationType[]> {

    return await Promise.all(notifications.map(async (notification) => {

        const {error: adminError, data: adminName} = await 
            getAdminName(notification.created_by)
        if (adminError) throw adminError

        const {error: projectError, data: projectName} = await 
            getProjectName(notification.project_id)
        if (projectError) throw projectError
        return ({
            id: notification.id,
            created_at: notification.created_at,
            title: `${adminName.full_name || 'An admin'} has assigned you to a new task`,
            message: notification.title,
            description: notification.description,
            project: projectName.name || 'A project',
            admin: adminName.full_name || 'An admin',
            project_id: notification.project_id,
            status: notification.status,
            assigned_to: notification.assigned_to,
            created_by: notification.created_by,
            deadline: notification.deadline
        })
    }))

}

async function getAdminName(userId: string) {
    const {data, error} = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', userId)
        .single()
    if (error) return {error}
    return {data}
}

async function getProjectName(projectId: number) {
    const {data, error} = await supabase
        .from('projects')
        .select('name')
        .eq('id', projectId)
        .single()
    if (error) return {error}
    return {data}
}