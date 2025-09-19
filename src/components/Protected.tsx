import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import type { JSX } from "react";

type ProtectedProps = {
    children: JSX.Element
}

export default function Protected({children}: ProtectedProps) {

    const {session} = useAuth()
    const location = useLocation()

    if (session === undefined) return <h2>Loading...</h2>
    return session 
    ? children 
    : <Navigate 
        to='/signin' 
        state={{redirectTo: location.pathname, message: 'You must be signed in to access this page.'}} 
    />

}