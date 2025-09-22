import { Outlet, Link } from "react-router-dom"

export default function ProjectLayout() {
  return (
    <section className="max-w-4xl mx-auto">
        <header>
            <Link to=".." className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 mt-4">
                <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
                </svg>
                <span className="text-sm">Return to Dashboard</span>
            </Link>
        </header>
        <Outlet />
    </section>
  )
}
