import { useEffect, useState } from "react"
import { Outlet, Link, useParams } from "react-router-dom"
import { Home } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/supabase"

export type Member = {
  full_name: string
  role: string
  created_at: string
}

export default function ProjectLayout() {

  const {session} = useAuth()
  const {projectId} = useParams()
  const [error, setError] = useState<Error | null>(null)

  const[members, setMembers] = useState<Member[]>([])

  if(!session) throw new Error("No session available")
  if(!projectId) throw new Error("No project available")
  if(error) throw error

  useEffect(() => {

    async function isUserAMember() {
      try {
        const {error} = await supabase
          .from("project_members")
          .select("*")
          .eq("project_id", projectId)
          .eq("user_id", session?.user?.id)
          .single()
        if(error) throw new Error("You do not have access to this project.")
      } catch (err) {
        console.error("Error checking project membership:", (err as Error).message)
        setError(err as Error)
      }
    }

    async function getProjectMembers() {
      try {
        const { data, error } = await supabase
          .from('project_members')
          .select(
            `
            role,
            created_at,
            ...user_profiles!inner(
              full_name
            )
            `,
          )
          .eq('project_id', projectId)
        if(error) throw error
        setMembers(data)
      } catch (err) {
        console.error("Error fetching project members:", (err as Error).message)
        setError(err as Error)
      }
    }

    isUserAMember()
    getProjectMembers()

  }, [projectId, session])

  return (
    <section className="max-w-4xl mx-auto">
        <header>
            <Link to=".." className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 mt-4">
                <Home className="w-5 h-5" />
                <span className="text-sm">Return to Dashboard</span>
            </Link>
        </header>
        <Outlet context={{members}} />
    </section>
  )
}
