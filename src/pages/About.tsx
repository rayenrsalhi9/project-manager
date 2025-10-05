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

  const features = [
    {
      icon: Clock,
      title: "Save Time",
      description: "Streamline project management and reduce time spent on coordination by up to 40%."
    },
    {
      icon: MessageCircle,
      title: "Effective Communication",
      description: "Keep everyone aligned with real-time updates and centralized project discussions."
    },
    {
      icon: RefreshCw,
      title: "Sync Work",
      description: "Ensure seamless collaboration with synchronized task updates and shared resources."
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      description: "Monitor project status and team performance with intuitive dashboards and reports."
    }
  ]

  return (
    <section className="py-8 max-w-4xl mx-auto px-4">
      <div className="container">
        <Link to="/home" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <Home className="w-5 h-5" />
            <span>Return to home page</span>
        </Link>
        <div className="mb-10 grid gap-5 text-center md:grid-cols-2 md:text-left">
          <h1 className="text-4xl font-semibold">About Our Platform</h1>
          <p className="text-muted-foreground leading-6">
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
            <h2 className="text-3xl font-semibold">Why Choose Our Platform</h2>
            <p className="max-w-xl text-muted-foreground leading-6">
              Experience the perfect blend of simplicity and power for effective team collaboration.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center gap-1 text-center">
                <feature.icon className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
