import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CalendarDays, Mail, User, Edit, Trash2, Home } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function Profile() {
  
    const {user: userData} = useAuth()

    const formatDate = (dateString: string = '') => {
        return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        })
    }

    const getInitials = (name: string = 'Anonymous User') => {
        return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }

    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    return (
        <div className="min-h-[100dvh] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
            <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <Home className="w-5 h-5" />
            <span>Return to dashboard page</span>
            </Link>
            <Card className="w-full">
        <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
            <Avatar className="h-20 w-20 border-2 border-border">
                <AvatarFallback className="text-lg font-semibold bg-muted text-muted-foreground">
                {getInitials(userData?.full_name)}
                </AvatarFallback>
            </Avatar>
            </div>
            <CardTitle className="text-xl font-semibold text-foreground">{userData?.full_name}</CardTitle>

            <div className="flex gap-2 justify-center mt-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <Edit className="h-4 w-4" />
                Edit Profile
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-destructive hover:text-destructive bg-transparent"
                onClick={() => setShowDeleteDialog(true)}
            >
                <Trash2 className="h-4 w-4" />
                Delete Profile
            </Button>
            </div>
        </CardHeader>

        <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex-shrink-0">
                <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground truncate">{userData?.email}</p>
            </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex-shrink-0">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Member Since</p>
                <p className="text-sm text-muted-foreground">{formatDate(userData?.created_at)}</p>
            </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex-shrink-0">
                <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Status</p>
                <Badge variant="secondary" className="mt-1">
                Active
                </Badge>
            </div>
            </div>
        </CardContent>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete Profile</DialogTitle>
                <DialogDescription>
                Are you sure you want to delete your profile? This action cannot be undone and will permanently remove all
                your data.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
                </Button>
                <Button variant="destructive" onClick={() => setShowDeleteDialog(false)}>
                Delete Profile
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
            </Card>
        </div>
        </div>
    )
}