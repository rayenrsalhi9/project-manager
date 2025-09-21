import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from '../supabase'
import type { AuthError, Session, User} from '@supabase/supabase-js';
import type { JSX } from "react";

type AuthContextProviderProps = {
    children: JSX.Element
}

type AuthResult = {
  success: boolean;
  error?: string;
  data?: { user: User | null; session: Session | null };
}

type UserType = {
    fullName: string
    email: string
}

type AuthContextType = {
    session: Session | null | undefined
    signUserIn: (email: string, password: string) => Promise<AuthResult>
    signUserOut: () => Promise<AuthResult>
    signUserUp: (fullName: string, email: string, password: string) => Promise<AuthResult>
    user: UserType | null
    userProjects: UserProject[]
}

type UserProject = {
    name: string,
    description: string,
    role: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthContextProvider = ({children}: AuthContextProviderProps) => {
    // states
    const [session, setSession] = useState<Session | null | undefined>(undefined)
    const [user, setUser] = useState<UserType | null>(null)
    const [userProjects, setUserProjects] = useState<UserProject[]>([])

    // initial session state
    async function getInitialState(): Promise<void> {
        try {
            const { data, error } = await supabase.auth.getSession()
            if (error) throw error
            if (data?.session) setSession(data.session)
        } catch (err) {
            console.error('Auth initialization error: ', (err as AuthError).message)
        }
    }

    // auth functions (login, signup, signout)
    async function signUserIn(email: string, password: string): Promise<AuthResult> {
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) return {success: false, error: error.message}
            return {success: true, data}
        } catch(err) {
            console.error(`An error occured: ${(err as Error).message}`)
            return {success: false, error: 'An unexpected error occured, try again later'}
        }
    }

    async function signUserOut(): Promise<AuthResult> {
        try {
            const {error} = await supabase.auth.signOut()
            if (error) {
                console.error(`An error occured: ${error.message}`)
                return {success: false, error: error.message}
            }
            return {success: true}
        } catch (err) {
            console.error(`An error occured: ${(err as Error).message}`)
            return {success: false, error: (err as Error).message}
        }
    }

    async function signUserUp(fullName: string, email: string, password: string): Promise<AuthResult> {
        try {
            const {data, error} = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            })
            if (error) return {success: false, error: error.message}
            return {success: true, data}
        } catch(err) {
            console.error(`An error occured: ${(err as Error).message}`)
            return {success: false, error: 'An unexpected error occured, try again later'}
        }
    }

    async function getUserDetails(userId: string) {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('id, full_name, created_at')
                .eq('id', userId)
                .single()
                
            if (error) throw error
        
            if (data) setUser({
                email: session?.user?.email || '', 
                fullName: data.full_name
            })
        } catch(err) {
            console.error(`Error fetching user: ${(err as Error).message}`)
        }          
    }

    async function getUserProjects(userId: string) {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select(
                    `
                    name,
                    description,
                    ...project_members!inner(
                    role
                    )
                    `,
                )
                .eq(
                    'project_members.user_id',
                    userId
                )
            if (error) throw error
            console.log(data)
            if (data) setUserProjects(data)
        } catch(err) {
            console.error(`Error fetching projects: ${(err as Error).message}`)
        }
    } 

    useEffect(() => {

        getInitialState()
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
        
    }, [])

    useEffect(() => {
        if (!session?.user?.id) {
            setUser(null)
            setUserProjects([])
            return
        }
        getUserDetails(session.user.id)
        getUserProjects(session.user.id)
    }, [session?.user?.id])

    return (
        <AuthContext.Provider value={{ session,signUserIn, signUserOut, signUserUp, user, userProjects}}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthContextProvider')
    }
    return context
}