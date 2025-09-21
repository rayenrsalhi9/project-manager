import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "@/supabase"

type TimeLine = {
    id: number,
    posted_by: string
    project_id: number,
    content: string
    created_at: string
}

export default function TimeLine() {

    const [projectTimeline, setProjectTimeline] = useState<TimeLine[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const params = useParams()
    if (!params.projectId) throw {message: 'Cannot find any project'}

    const projectId = parseInt(params.projectId)
    if(!projectId) throw {message: 'Cannot find any project'}

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const { data, error } = await supabase
                    .from('project_updates')
                    .select(
                        `
                        id,
                        project_id,
                        posted_by,
                        content,
                        created_at
                        `,
                    )
                    .eq('project_id', projectId)
                    .order('created_at', {
                        ascending: false,
                    })

                if (error) throw error
                
                setProjectTimeline(data)
            } catch(err) {
                console.log(`Error fetching timeline: ${(err as Error).message}`)
            } finally {
                setLoading(false)
            }
        }
        fetchUpdates()
    }, [projectId])

    if(loading) return <h1>Loading...</h1>

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (projectTimeline.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Project Timeline</h1>
          <p className="text-gray-600">Track the progress and updates of your project</p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">No timeline updates yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Project Timeline</h1>
        <p className="text-gray-600">Track the progress and updates of your project</p>
      </div>
      
      <div className="space-y-6">
        {projectTimeline.map(timeline => (
          <div key={timeline.id} className="flex items-start space-x-4">
            {/* Small timeline point */}
            <div className="flex-shrink-0 w-2 h-2 bg-black rounded-full mt-2"></div>
            
            {/* Date and content */}
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">
                {formatDate(timeline.created_at)}
              </div>
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {timeline.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
