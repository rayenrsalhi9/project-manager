import { useState, useEffect } from "react";
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
    const [projectTimeline, setProjectTimeline] = useState<TimelineType[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const params = useParams()
    if (!params.projectId) throw {message: 'Cannot find any project'}

    const projectId = parseInt(params.projectId)
    if(!projectId) throw {message: 'Cannot find any project'}

    useEffect(() => {
        let isMounted = true
        const fetchUpdates = async () => {
            try {
                const { data, error } = await supabase
                    .from('project_updates')
                    .select('*')
                    .eq('project_id', projectId)
                    .order('created_at', {
                        ascending: false,
                    })

                if (error) throw error
                
                if (isMounted) setProjectTimeline(data)
            } catch(err) {
                console.log(`Error fetching timeline: ${(err as Error).message}`)
            } finally {
                if(isMounted) setLoading(false)
            }
        }

        fetchUpdates()

        return () => { isMounted = false }

    }, [projectId])

    return {projectTimeline, loading}
}