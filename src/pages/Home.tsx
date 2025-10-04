import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, type JSX } from "react";
import { useAuth } from "@/context/AuthContext";
import { generateText } from "@/services/aiService";

export default function Home():JSX.Element {

  const {session} = useAuth()

  const handleClick = async () => {
    const text = await generateText();
    console.log(text);
  }

  // useEffect(() => {
  //   handleClick();
  // }, []);

  return (
    <section className="relative overflow-hidden py-6 min-h-dvh max-w-4xl mx-auto px-4">
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
        <img
          alt="background"
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
          className="[mask-image:radial-gradient(75%_75%_at_center,white,transparent)] opacity-90"
        />
      </div>
      <div className="relative z-10 container">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg"
                alt="logo"
                className="h-16"
              />
            </div>
            <div>
              <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl leading-normal">
                Simplify teamwork. Empower your projects.
              </h1>
              <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                Organize tasks, share resources, and track progress — all in one simple platform built for teams, students, and startups.
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild className="shadow-sm transition-shadow hover:shadow">
                <Link to={session ? '/dashboard' : '/signin'}>Get Started</Link>
              </Button>
              <Button variant="outline" asChild className="group">
                <Link to="/about" className="flex items-center justify-center">
                  See How It Works{" "}
                  <ExternalLink className="ml-2 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};