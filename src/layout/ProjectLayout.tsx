import { useEffect, useState } from "react"
import { Outlet, Link, NavLink, useParams } from "react-router-dom"
import { Home } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/supabase"

export type Member = {
  user_id: string
  full_name: string
  role: string
  created_at: string
}

export type Project = {
  name: string
  description: string
  invite_code: string
  created_at: string
}

export default function ProjectLayout() {

  const {session} = useAuth()
  const {projectId} = useParams()
  const [error, setError] = useState<Error | null>(null)

  const[members, setMembers] = useState<Member[]>([])
  const [projectInfo, setProjectInfo] = useState<Project | null>(null)

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
            user_id,
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

    async function getProjectInfo() {
      try {
        const {data, error} = await supabase
          .from('projects')
          .select('invite_code, name, description, created_at')
          .eq('id', projectId)
          .single()
        if(error) throw error
        setProjectInfo(data)
      } catch(err) {
        console.error(`An error occured: ${(err as Error).message}`)
        setError(err as Error)
      }
    }

    isUserAMember()
    getProjectMembers()
    getProjectInfo()

  }, [projectId, session])

  return (
    <section className="max-w-4xl mx-auto">
        <header>
            <Link to=".." className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 mt-4">
                <Home className="w-5 h-5" />
                <span className="text-sm">Return to Dashboard</span>
            </Link>
            
            <nav className="flex space-x-6 border-b border-gray-200 mb-6">
                <NavLink
                    to="."
                    end
                    className={({ isActive }) =>
                        `pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            isActive
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`
                    }
                >
                    Overview
                </NavLink>
                <NavLink
                    to="members"
                    className={({ isActive }) =>
                        `pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            isActive
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`
                    }
                >
                    Members
                </NavLink>
                <NavLink
                    to="tasks"
                    className={({ isActive }) =>
                        `pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            isActive
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`
                    }
                >
                    Tasks
                </NavLink>
                <NavLink
                    to="info"
                    className={({ isActive }) =>
                        `pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            isActive
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`
                    }
                >
                    Project details
                </NavLink>
            </nav>
        </header>
        <Outlet context={{members, projectInfo}} />
    </section>
  )
}
