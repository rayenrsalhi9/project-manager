import { useAuth} from "@/context/AuthContext";
import { formatNotificationTime } from "@/utils";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Notifications = () => {

    const {notifications} = useAuth()

    const getInitials = (name: string = 'Anonymous User') => {
        return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }

    return (
        <section className="max-w-2xl mx-auto px-4 py-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
                <Home className="w-5 h-5" />
                <span>Return to dashboard page</span>
            </Link>
            <h1 className="text-2xl font-semibold mb-6">All Notifications</h1>
            <div className="space-y-4">
            {notifications.map((notification) => (
                <Link 
                    to={`/notifications/${notification.id}`}
                    key={notification.id}
                    className="block hover:shadow-lg transition-all duration-200 hover:border-primary/20 cursor-pointer"
                >
                    <Card 
                        key={notification.id}
                        className="hover:shadow-lg transition-all duration-200 hover:border-primary/20 cursor-pointer"
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                                <Avatar className="w-10 h-10 bg-primary/10">
                                    <AvatarFallback className="text-sm font-medium text-primary">
                                        {getInitials(notification.admin)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold leading-tight text-foreground">
                                                {notification.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-foreground/70 font-medium mt-2">
                                                {notification.project}
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                            {formatNotificationTime(notification.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
            {notifications.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">No notifications yet</p>
                    </CardContent>
                </Card>
            )}
        </div>
    </section>
    )
};

export default Notifications;