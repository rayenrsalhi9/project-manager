import {useAuth} from "@/context/AuthContext";
import { useParams } from "react-router-dom";
import { formatNotificationTime, formatDeadlineDate } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Calendar, User, Folder, Clock, ArrowLeft, AlertCircle } from "lucide-react";

const Notification = () => {

    const {notificationId} = useParams()
    const {notifications} = useAuth()
    
    const notification = notifications.find((n) => n.id == notificationId)

    if (!notification) {
        throw new Error("Notification not found")
    }

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
                    to="/notifications" 
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:gap-3 mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium">
                        Back to All Notifications
                    </span>
                </Link>

                {/* Main Notification Card */}
                <Card className="w-full border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                    {/* Header with Avatar and Title */}
                    <CardHeader className="py-4">
                        <div className="flex items-start gap-4">
                            <Avatar className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20">
                                <AvatarFallback className="text-lg font-semibold text-primary">
                                    {getInitials(notification.admin)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <Badge variant="secondary" className="text-xs font-medium">
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

                        {/* Timestamp */}
                        <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/50">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                Created on {formatNotificationTime(notification.created_at)}
                            </span>
                        </div>

                        {/* Deadline */}
                        <div className="flex items-center justify-center gap-2">
                            <AlertCircle className={`w-4 h-4 ${
                                notification.deadline && new Date(notification.deadline) < new Date() 
                                    ? 'text-red-500' 
                                    : new Date(notification.deadline) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                                    ? 'text-orange-500'
                                    : 'text-muted-foreground'
                            }`} />
                            <span className={`text-sm font-medium ${
                                notification.deadline && new Date(notification.deadline) < new Date() 
                                    ? 'text-red-500' 
                                    : new Date(notification.deadline) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                                    ? 'text-orange-500'
                                    : 'text-muted-foreground'
                            }`}>
                                Deadline: {notification.deadline ? formatDeadlineDate(notification.deadline) : 'No deadline set'}
                            </span>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-border/50">
                            <Link
                                to="submit"
                                className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                Submit Task
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

export default Notification