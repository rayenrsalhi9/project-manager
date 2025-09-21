import { Link } from "react-router-dom"

export default function Project() {
  return (
    <section className="w-full pt-4 px-8">
        <Link to=".." className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
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
            <span>Return to Dashboard</span>
          </Link>
      <h1>Project page will go here</h1>
    </section>
  )
}
