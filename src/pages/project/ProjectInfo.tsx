import { useOutletContext } from "react-router-dom"
import type { Project } from "@/layout/ProjectLayout"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function ProjectInfo() {

    const {projectInfo} = useOutletContext<{projectInfo: Project}>()
    const [showInviteCode, setShowInviteCode] = useState(false)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
        return date.toLocaleDateString(undefined, options)
    }

    const toggleInviteCodeVisibility = () => {
        setShowInviteCode(!showInviteCode)
    }

    if (!projectInfo) {
        return (
            <section className="w-full max-w-2xl mx-auto space-y-4">
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No project information available</p>
                </div>
            </section>
        )
    }

    return (
        <section className="w-full max-w-3xl mx-auto space-y-6 pb-8">
            <div className="space-y-6">
                
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                    Project Details
                </h2>

                {/* Project Name */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Project Name</label>
                    <div className="p-3 bg-muted rounded-lg border">
                        <p className="text-foreground font-medium">{projectInfo.name}</p>
                    </div>
                </div>

                {/* Project Description */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <div className="p-3 bg-muted rounded-lg border min-h-[80px]">
                        <p className="text-foreground">
                            {projectInfo.description || "No description available"}
                        </p>
                    </div>
                </div>

                {/* Invite Code */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Invite Code</label>
                    <div className="relative">
                        <input
                            type={showInviteCode ? "text" : "password"}
                            value={projectInfo.invite_code}
                            readOnly
                            className="w-full p-3 pr-12 bg-muted rounded-lg border text-foreground font-mono"
                        />
                        <button
                            type="button"
                            onClick={toggleInviteCodeVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={showInviteCode ? "Hide invite code" : "Show invite code"}
                        >
                            {showInviteCode ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Created Date */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                    <div className="p-3 bg-muted rounded-lg border">
                        <p className="text-foreground">{formatDate(projectInfo.created_at)}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
