import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { formatNotificationTime, formatDeadlineDate, getDeadlineUrgency } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, User, Folder, ArrowLeft, AlertCircle } from "lucide-react";

const AssignedTask = () => {

    const location = useLocation()
    // used location because I passed taskId as state
    // and I need to get it from location.state

    const { taskId } = location.state
    if (!taskId) throw new Error("Task ID not found")
    
    // Find the notification/task using the task_id from submission
    const { notifications } = useAuth()
    if (!notifications) throw new Error("No notifications available")
    
    const notification = notifications.find((n) => n.id === parseInt(taskId))
    if (!notification) throw new Error("Assigned task not found")

    const getInitials = (name: string = '') => {
        return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }

    return (
        <section className="min-h-[100dvh] flex items-center justify-center py-4 bg-gradient-to-br from-background to-muted/30">
            <div className="w-full max-w-2xl px-4">
                {/* Back Navigation */}
                <Link 
                    to=".."
                    relative="path"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:gap-3 mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium">
                        Back to submission
                    </span>
                </Link>

                {/* Main Notification Card */}
                <Card className="w-full border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                    {/* Header with Avatar and Title */}
                    <CardHeader className="py-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20">
                                <AvatarFallback className="text-lg font-semibold text-primary">
                                    {getInitials(notification.admin)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <Badge variant="secondary" className="text-xs font-medium mb-1">
                                    Task Assignment
                                </Badge>
                                    
                                <CardTitle className="text-xl font-bold text-foreground leading-tight">
                                    {notification.title}
                                </CardTitle>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Task Details */}
                        <div className="space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Task Overview
                                </h3>
                                <h4 className="text-lg font-semibold text-foreground mb-2">
                                    {notification.message}
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {notification.description}
                                </p>
                            </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Project Information */}
                            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Folder className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-medium text-primary">Project</span>
                                </div>
                                <p className="text-sm font-semibold text-foreground">
                                    {notification.project}
                                </p>
                            </div>

                            {/* Admin Information */}
                            <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg p-4 border border-accent/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4 text-accent-foreground" />
                                    <span className="text-xs font-medium text-accent-foreground">Assigned By</span>
                                </div>
                                <p className="text-sm font-semibold text-foreground">
                                    {notification.admin}
                                </p>
                            </div>
                        </div>

                        {/* Date Information Section */}
                        <div className="space-y-3 pt-4 border-t border-border/50">
                            {/* Creation Date */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                    <Calendar className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Created at</p>
                                    <p className="text-sm text-foreground">
                                        {formatNotificationTime(notification.created_at)}
                                    </p>
                                </div>
                            </div>

                            {/* Deadline */}
                            {notification.deadline && (
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                        getDeadlineUrgency(notification.deadline).color === 'red'
                                            ? 'bg-red-100'
                                            : getDeadlineUrgency(notification.deadline).color === 'orange'
                                            ? 'bg-orange-100'
                                            : getDeadlineUrgency(notification.deadline).color === 'yellow'
                                            ? 'bg-yellow-100'
                                            : 'bg-green-100'
                                    }`}>
                                        <AlertCircle className={`w-4 h-4 ${
                                            getDeadlineUrgency(notification.deadline).color === 'red'
                                                ? 'text-red-600'
                                                : getDeadlineUrgency(notification.deadline).color === 'orange'
                                                ? 'text-orange-600'
                                                : getDeadlineUrgency(notification.deadline).color === 'yellow'
                                                ? 'text-yellow-600'
                                                : 'text-green-600'
                                        }`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-muted-foreground mb-1">
                                            To accomplish before
                                        </p>
                                        <div className="space-y-1">
                                            <p className={`text-sm font-semibold ${
                                                getDeadlineUrgency(notification.deadline).color === 'red'
                                                    ? 'text-red-600'
                                                    : getDeadlineUrgency(notification.deadline).color === 'orange'
                                                    ? 'text-orange-600'
                                                    : getDeadlineUrgency(notification.deadline).color === 'yellow'
                                                    ? 'text-yellow-600'
                                                    : 'text-green-600'
                                            }`}>
                                                {formatDeadlineDate(notification.deadline)}
                                            </p>
                                            <p className={`text-xs font-medium ${
                                                getDeadlineUrgency(notification.deadline).color === 'red'
                                                    ? 'text-red-500'
                                                    : getDeadlineUrgency(notification.deadline).color === 'orange'
                                                    ? 'text-orange-500'
                                                    : getDeadlineUrgency(notification.deadline).color === 'yellow'
                                                    ? 'text-yellow-500'
                                                    : 'text-green-500'
                                            }`}>
                                                {getDeadlineUrgency(notification.deadline).countdown}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!notification.deadline && (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/20">
                                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-muted-foreground mb-1">
                                            To accomplish before
                                        </p>
                                        <p className="text-sm text-muted-foreground">No deadline set</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

export default AssignedTask