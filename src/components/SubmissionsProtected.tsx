import { useAuth } from "@/context/AuthContext";
import { useOutletContext, Navigate } from "react-router-dom";
import type { Member } from "@/layout/ProjectLayout";
import Submissions from "@/pages/project/Submissions";

const SubmissionsProtected = () => {

    const { user } = useAuth();
    if (!user) throw new Error("No user available");

    const { members } = useOutletContext<{members: Member[]}>()
    if (!members) throw new Error('No members available')

    const userRole = members.find(m => m.user_id === user.id)?.role
    if (!userRole) throw new Error('No role available')

    return userRole === 'admin' ? <Submissions /> : <Navigate to="/dashboard" />
  
}

export default SubmissionsProtected