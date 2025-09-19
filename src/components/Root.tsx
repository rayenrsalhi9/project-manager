import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./Spinner";

export default function Root() {
    const {session} = useAuth()
    if (session === undefined) return <LoadingSpinner />
    return session ? <Navigate to='/dashboard' /> : <Navigate to='/home' />
}