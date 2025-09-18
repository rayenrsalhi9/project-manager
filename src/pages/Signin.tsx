import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import type { JSX } from "react";

export default function Signin():JSX.Element {
  return (
    <section className="h-screen bg-background">
      <div className="flex h-full items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <form className="border-muted flex flex-col gap-6 rounded-lg border p-8 shadow-sm">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Welcome back!</h1>
              <p className="text-muted-foreground text-sm mt-2">Sign in and continue where you left off</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="********"
                  className="mt-1.5"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <p className="text-muted-foreground mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
