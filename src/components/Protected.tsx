import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "./Spinner";
import type { JSX } from "react";

type ProtectedProps = {
    children: JSX.Element
}

export default function Protected({children}: ProtectedProps) {

    const {session, isAuthLoading} = useAuth()
    const location = useLocation()

    if (session === undefined || isAuthLoading) return <div className="flex items-center justify-center min-h-screen"><Spinner /></div>
    return session 
    ? children 
    : <Navigate 
        to='/signin' 
        state={{redirectTo: location.pathname}} 
    />

}