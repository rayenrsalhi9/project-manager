import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "react-router-dom";
import { supabase } from "@/supabase";

export type TimelineType = {
    id: number,
    posted_by: string
    project_id: number
    content: string
    created_at: string
    type: string
}

export function useTimeline() {

    const {session} = useAuth()
    if(!session) throw new Error('Cannot connect you to the app, please try again.')
    const userId = session.user.id

    const [projectTimeline, setProjectTimeline] = useState<TimelineType[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<{message: string} | null>(null)

    const params = useParams()
    if (!params.projectId) throw new Error('Cannot find any project')

    const projectId = parseInt(params.projectId)

    useEffect(() => {

        let isMounted = true

        const fetchUpdates = async () => {
            try {
                // check if user is a member
                const { data: memberData, error: memberError } = await supabase
                    .from('project_members')
                    .select('*')
                    .eq('project_id', projectId)
                    .eq('user_id', userId)
                    .single()

                if(memberError || !memberData) {
                    throw new Error('You dont make part of this project.')
                }
                
                // user is a member, fetch updates
                const { data, error } = await supabase
                    .from('project_updates')
                    .select('*')
                    .eq('project_id', projectId)
                    .order('created_at', {
                        ascending: false,
                    })

                if (error) throw error
                if (data && isMounted) setProjectTimeline(data)
            } catch(err) {
                console.log(`Error fetching timeline: ${(err as Error).message}`)
                setError((err as Error))
            } finally {
                if(isMounted) setLoading(false)
            }
        }

        fetchUpdates()

        return () => { isMounted = false }

    }, [projectId, userId])

    return {projectTimeline, loading, error}
}