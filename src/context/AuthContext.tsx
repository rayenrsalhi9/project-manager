import { createContext, useContext, useState, useEffect } from "react";
import {supabase} from '../supabase'

const AuthContext = createContext({session: null})

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined)

    async function getInitialState() {
        try {
            const {data, error} = await supabase.auth.getSession()
            if (error) throw error.message
            setSession(data.session)
        } catch(err) {
            console.log(`An error occured: ${err}`)
        }
    }

    useEffect(() => {
        getInitialState()
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    return(
        <AuthContext.Provider value={{session}}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext)
}