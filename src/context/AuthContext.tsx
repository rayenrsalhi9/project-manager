import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from '../supabase'
import type { JSX } from "react";
import type { Session } from '@supabase/supabase-js';

type AuthContextProviderProps = {
    children: JSX.Element
}

type AuthContextType = {
    session: Session | null | undefined;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    loading: true
})

export const AuthContextProvider = ({children}: AuthContextProviderProps) => {
    const [session, setSession] = useState<Session | null | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    async function getInitialState() {
        try {
            const { data, error } = await supabase.auth.getSession()
            if (error) throw error.message
            setSession(data.session)
        } catch (err) {
            console.error('Auth initialization error:', err)
            setSession(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getInitialState()
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ session, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthContextProvider')
    }
    return context
}