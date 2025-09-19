import { useAuth } from "@/context/AuthContext"
import DashboardSkeleton from "@/components/DashboardSkeleton"

export default function Dashboard() {

  const {user} = useAuth()

  if (!user) return <DashboardSkeleton />

  return (
    <section className="min-h-screen pt-4">
      <div className="max-w-2xl rounded-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, <span className="text-gray-500"> {user?.fullName} </span>
        </h1>
      </div>
    </section>
  )
}