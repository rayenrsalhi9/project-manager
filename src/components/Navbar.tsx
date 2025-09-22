import { MenuIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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
    <section className="py-4 px-8 w-full mx-auto">
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
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={navigationMenuTriggerStyle()}
                >
                  Features
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={navigationMenuTriggerStyle()}
                >
                  Products
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={navigationMenuTriggerStyle()}
                >
                  Resources
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={navigationMenuTriggerStyle()}
                >
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {
            user ?
            <div className="hidden items-center gap-4 lg:flex">
              <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 cursor-pointer"
                  onClick={handleSignOut}
              >
                  <LogOut className="h-4 w-4" />
                  Sign out
              </Button>
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
              <div className="flex flex-col p-4">
                <div className="flex flex-col gap-6">
                  <a href="#" className="font-medium">
                    Features
                  </a>
                  <a href="#" className="font-medium">
                    Templates
                  </a>
                  <a href="#" className="font-medium">
                    Blog
                  </a>
                  <a href="#" className="font-medium">
                    Pricing
                  </a>
                </div>
                
                {
                  user ?
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center gap-2 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Button>
                  </div> : null
                }

              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </section>
  );
}