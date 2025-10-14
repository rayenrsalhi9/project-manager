import { useAuth } from "@/context/AuthContext";
import { useOutletContext, Navigate } from "react-router-dom";
import type { Member } from "@/layout/ProjectLayout";
import Submissions from "@/pages/project/Submissions";
import Spinner from "./Spinner";

const SubmissionsProtected = () => {

    const { user, isLoading, isAuthLoading } = useAuth();
    
    // Loading state handling
    if (isLoading || isAuthLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-muted-foreground">Loading submissions access...</p>
                </div>
            </div>
        )
    }

    if (!user) throw new Error("No user available");

    const { members } = useOutletContext<{members: Member[]}>()
    
    // Loading state handling for members
    if (!members) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-muted-foreground">Loading project members...</p>
                </div>
            </div>
        )
    }

    const userRole = members.find(m => m.user_id === user.id)?.role
    if (!userRole) throw new Error('No role available')

    return userRole === 'admin' ? <Submissions /> : <Navigate to="/dashboard" />
  
}

export default SubmissionsProtected