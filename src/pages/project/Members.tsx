import { useOutletContext } from "react-router-dom"
import type { Member } from "@/layout/ProjectLayout"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function Team() {

    const {members} = useOutletContext<{members: Member[]}>()

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
        };
        return new Date(date).toLocaleDateString(undefined, options);
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4">
            <div className="space-y-12 pt-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                {
                    members.map((member, index) => (
                    <div key={index} className="flex flex-col items-center text-center space-y-4">
                        <Avatar className="w-20 h-20 border-2 border-foreground">
                            <AvatarFallback className="text-xl font-bold bg-background text-foreground border-2 border-foreground">
                                {
                                    member.full_name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                }
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-foreground leading-tight">
                                {member.full_name}
                            </h3>
                            <div className="space-y-1">
                                <Badge variant={member.role === "admin" ? "default" : "secondary"} className="text-xs font-medium mb-2">
                                    {member.role}
                                </Badge>
                                <p className="text-sm text-muted-foreground">
                                    Joined {formatDate(member.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
                }
                </div>
            </div>
        </div>
    )
}
