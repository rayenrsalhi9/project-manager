import { MenuIcon, LogOut, User, Settings, CreditCard, HelpCircle } from "lucide-react";
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

import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

export default function Navbar() {

  const {signUserOut, user} = useAuth()
  const navigate = useNavigate()

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
        style: {
          background: '#FEE2E2',
          border: '1px solid #EF4444',
          color: '#991B1B',
        },
      })
    } else if (success) {
      navigate("/signin")
    } else {
      toast.error('Unexpected error occured', {
        duration: 5000,
        style: {
          background: '#FEE2E2',
          border: '1px solid #EF4444',
          color: '#991B1B',
        },
      })
    }
  }

  return (
    <section className="py-4">
      <div className="container">
        <nav className="flex items-center justify-between">
          <Link
            to='../home'
            className="flex items-center gap-2"
          >
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
              className="max-h-8"
              alt="Shadcn UI Navbar"
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

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <MenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="max-h-screen overflow-auto">
              <SheetHeader>
                <SheetTitle>
                  <a
                    href="https://www.shadcnblocks.com"
                    className="flex items-center gap-2"
                  >
                    <img
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
                      className="max-h-8"
                      alt="Shadcn UI Navbar"
                    />
                    <span className="text-lg font-semibold tracking-tighter">
                      ProjectRoom
                    </span>
                  </a>
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
                        className="w-full flex items-center gap-2 cursor-pointer"
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
        </nav>
      </div>
    </section>
  );
}