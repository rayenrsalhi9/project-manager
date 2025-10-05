import icon from '/icon.png'
import about1 from '/about-1.jpg'
import about2 from '/about-2.jpg'
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "@/context/AuthContext";
import { Home, Clock, MessageCircle, RefreshCw, BarChart3 } from "lucide-react";

export default function About():JSX.Element {

  const {session} = useAuth()

  return (
    <section className="py-8 max-w-4xl mx-auto px-4">
      <div className="container">
        <Link to="/home" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <Home className="w-5 h-5" />
            <span>Return to home page</span>
        </Link>
        <div className="mb-10 grid gap-5 text-center md:grid-cols-2 md:text-left">
          <h1 className="text-5xl font-semibold">About Our Platform</h1>
          <p className="text-muted-foreground">
            A collaborative platform for teams, students, and startups to organize projects, assign and track tasks, share resources, and communicate effectively.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-3">
          <img
            src={about2}
            alt="Main platform image"
            className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2"
          />
          
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <div className="flex flex-col justify-between gap-6 rounded-xl bg-muted p-7 md:w-1/2 lg:w-auto">
              <img
                src={icon}
                alt="ProjectRoom icon"
                className="mr-auto h-12"
              />
              <div>
                <p className="mb-2 text-lg font-semibold">Built for Collaboration</p>
                <p className="text-muted-foreground">
                  Streamline your workflow with intuitive project organization and real-time task tracking.
                </p>
              </div>
              <Button variant="outline" className="mr-auto" asChild>
                <Link to={session ? '/dashboard' : '/signin'}>Get Started</Link>
              </Button>
            </div>
            
            <img
              src={about1}
              alt="Secondary platform image"
              className="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-muted p-8 my-8 md:p-16">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <h2 className="text-4xl font-semibold">Why Choose Our Platform</h2>
            <p className="max-w-xl text-muted-foreground">
              Experience the perfect blend of simplicity and power for effective team collaboration.
            </p>
          </div>
          
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Save Time</h3>
                <p className="text-muted-foreground">Streamline project management and reduce time spent on coordination by up to 40%</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Effective Communication</h3>
                <p className="text-muted-foreground">Keep everyone aligned with real-time updates and centralized project discussions</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <RefreshCw className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Sync Work</h3>
                <p className="text-muted-foreground">Ensure seamless collaboration with synchronized task updates and shared resources</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                <p className="text-muted-foreground">Monitor project status and team performance with intuitive dashboards and reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
