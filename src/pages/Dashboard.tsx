import { useAuth } from "@/context/AuthContext"
import LoadingSpinner from "@/components/Spinner"

export default function Dashboard() {

  const {user} = useAuth()

  if (!user) return <LoadingSpinner />

  return (
    <section>
      <h1>Welcome, {user?.fullName}</h1>
      <p>{user?.email}</p>
    </section>
  )
}