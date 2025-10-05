import { Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type {JSX} from "react";
import { useAuth } from "@/context/AuthContext";

export default function Home():JSX.Element {

  const {session} = useAuth()

  return (
    <section className="container mx-auto px-4 py-20 md:py-32"> 
        <div className="mx-auto max-w-4xl text-center"> 
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm"> 
            <Zap className="h-4 w-4" /> 
            <span>Built for modern teams</span> 
          </div> 
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl"> 
              Simplify teamwork. 
              <br /> 
              <span className="text-muted-foreground">
                <span className="text-amber-500">Empower </span> 
                your projects.
              </span> 
            </h1>
            <p className="mb-8 max-w-3xl mx-auto text-pretty text-base text-muted-foreground md:text-lg"> 
              Organize tasks, share resources, and track progress — all in one simple platform built for teams, 
              students, and startups. 
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row"> 
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to={session ? '/dashboard' : '/signin'}>
                  Get Started
                </Link>
              </Button> 
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent" asChild>
                <Link to="/about">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  See How It Works 
                </Link>
              </Button> 
            </div> 
          </div>  
      </section>
  );
};