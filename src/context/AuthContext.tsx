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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthContextProvider = ({children}: AuthContextProviderProps) => {
    // states
    const [session, setSession] = useState<Session | null | undefined>(undefined)
    const [user, setUser] = useState<UserType | null>(null)

    // initial session state
    async function getInitialState(): Promise<void> {
        try {
            const { error } = await supabase.auth.getSession()
            if (error) throw error
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
            console.log(`An error occured: ${(err as Error).message}`)
            return {success: false, error: 'An unexpected error occured, try again later'}
        }
    }

    async function signUserOut(): Promise<AuthResult> {
        try {
            const {error} = await supabase.auth.signOut()
            if (error) {
                console.log(`An error occured: ${error.message}`)
                return {success: false, error: error.message}
            }
            return {success: true}
        } catch (err) {
            console.log(`An error occured: ${(err as Error).message}`)
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
            console.log(`An error occured: ${(err as Error).message}`)
            return {success: false, error: 'An unexpected error occured, try again later'}
        }
    }

    async function getUserDetails(userId: string) {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('id, *')
                .eq('id', userId)
            if (error) throw error
            if (data) setUser({
                fullName: data[0].full_name, 
                email: session?.user?.email || ''
            })
        } catch(err) {
            console.log(`Error fetching user: ${(err as Error).message}`)
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
        if (!session) {
            setUser(null)
            return
        }
        getUserDetails(session.user.id)
    }, [session])

    return (
        <AuthContext.Provider value={{ session,signUserIn, signUserOut, signUserUp, user}}>
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