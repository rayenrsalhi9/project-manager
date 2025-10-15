import { useAuth } from "@/context/AuthContext";
import { useOutletContext, Navigate } from "react-router-dom";
import type { Member } from "@/layout/ProjectLayout";
import Submissions from "@/pages/project/Submissions";
import Spinner from "./Spinner";

const SubmissionsProtected = () => {

    const { user, isLoading, isAuthLoading } = useAuth();
    const { members } = useOutletContext<{members: Member[]}>();
    
    // Handle loading states gracefully
    if (isLoading || isAuthLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-muted-foreground">Loading submissions access...</p>
                </div>
            </div>
        )
    }

    // If no user is available after loading, navigate to dashboard
    if (!user) {
        return <Navigate to="/dashboard" />;
    }

    if (!members || members.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-muted-foreground">Loading project members...</p>
                </div>
            </div>
        )
    }

    const userRole = members.find(m => m.user_id === user.id)?.role || 'member';

    return userRole === 'admin' ? <Submissions /> : <Navigate to="/dashboard" />
  
}

export default SubmissionsProtected