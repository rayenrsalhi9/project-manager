import icon from '/src/favicon/android-chrome-192x192.png'
import { MenuIcon, LogOut, User, Settings, CreditCard, HelpCircle, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from '@/lib/utils';

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatNotificationTime } from "../utils";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Navbar() {

  const {signUserOut, user, notifications} = useAuth()
  const navigate = useNavigate()

  const getUnsubmittedNotifications = () => {
    return notifications.filter((notification) => !notification.is_submitted).length
  }

  const getInitials = (name: string = 'Anonymous User') => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  async function handleSignOut() {
    const {success, error: signoutError} = await signUserOut()
    if (!success && signoutError) {
      toast.error(signoutError, {
        duration: 5000,
        className: 'toast-error',
      })
    } else if (success) {
      navigate("/signin")
    } else {
      toast.error('Unexpected error occured', {
        duration: 5000,
        className: 'toast-error',
      })
    }
  }

  return (
    <section className="w-full max-w-4xl mx-auto py-4">
      <>
        <nav className="flex items-center justify-between">
          <Link
            to='../home'
            className="flex items-center gap-2"
          >
             <img
              src={icon}
              className="max-h-8"
              alt="ProjectRoom icon"
            />
            <span className="text-lg font-semibold tracking-tighter">
              ProjectRoom
            </span>
          </Link>
          
          {
            user ?
            <div className="hidden items-center gap-4 lg:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                    <Bell className="h-4 w-4" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                        {(() => getUnsubmittedNotifications() > 9 ? '9+' : getUnsubmittedNotifications())()}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Notifications</p>
                      {notifications.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {getUnsubmittedNotifications()} unsubmitted
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px]">
                      <div className="p-2">
                        {notifications.map((notification) => (
                          <Link
                            key={notification.id}
                            to={`/notifications/${notification.id}`}
                            className="block"
                          >
                            <div className={cn(
                              'mb-2 p-3 rounded-lg hover:shadow-md transition-shadow cursor-pointer',
                              notification.is_submitted ? 'bg-muted' : 'bg-accent'
                            )}>
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className="text-sm font-medium leading-tight">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-foreground font-medium mt-1">
                                    {notification.project}
                                  </p>
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatNotificationTime(notification.created_at)}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                  {notifications.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/notifications" className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground">
                          See all notifications
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarFallback className="text-sm font-semibold bg-muted text-muted-foreground">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.full_name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/billing" className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Billing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/help" className="flex items-center">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Help & Support
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> : null
          }

          <div className="flex items-center gap-2 lg:hidden">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                    <Bell className="h-4 w-4" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                        {getUnsubmittedNotifications() > 9 ? '9+' : getUnsubmittedNotifications()}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Notifications</p>
                      {notifications.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {getUnsubmittedNotifications() > 9 ? '9+' : getUnsubmittedNotifications()} unsubmitted
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px]">
                      <div className="p-2">
                        {notifications.map((notification) => (
                          <Link
                            key={notification.id}
                            to={`/notifications/${notification.id}`}
                            className={`mb-2 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer block ${notification.is_submitted ? 'bg-muted' : 'bg-accent'}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-sm font-medium leading-tight">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-foreground font-medium mt-1">
                                  {notification.project}
                                </p>
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatNotificationTime(notification.created_at)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                  {notifications.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/notifications" className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground">
                          See all notifications
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            <SheetContent side="top" className="max-h-screen overflow-auto">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center gap-2">
                     <img src={icon} className="max-h-8" alt="ProjectRoom icon" />
                    <span className="text-lg font-semibold tracking-tighter">
                      ProjectRoom
                    </span>
                  </div>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Navigation menu for mobile devices
                </SheetDescription>
              </SheetHeader>
                
                {
                  user ?
                  <>
                    <div className="flex items-center gap-3 p-2 bg-accent">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarFallback className="text-sm font-semibold bg-muted text-muted-foreground">
                          {getInitials(user.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{user.full_name || 'User'}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link to="/profile" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <Link to="/settings" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <Link to="/billing" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                        <CreditCard className="h-4 w-4" />
                        Billing
                      </Link>
                      <Link to="/help" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                        <HelpCircle className="h-4 w-4" />
                        Help & Support
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center gap-2 py-6 rounded-none cursor-pointer text-red-600 bg-red-50 hover:text-red-700"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  </> : null
                }

            </SheetContent>
          </Sheet>
          </div>
        </nav>
      </>
    </section>
  );
}