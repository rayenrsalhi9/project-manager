import { Outlet, Link } from "react-router-dom"
import { Home } from "lucide-react"

export default function ProjectLayout() {
  return (
    <section className="max-w-4xl mx-auto">
        <header>
            <Link to=".." className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 mt-4">
                <Home className="w-5 h-5" />
                <span className="text-sm">Return to Dashboard</span>
            </Link>
        </header>
        <Outlet />
    </section>
  )
}
