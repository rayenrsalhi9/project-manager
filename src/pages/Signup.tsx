import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import type { JSX } from "react";

export default function Signup():JSX.Element {
  return (
    <section className="bg-background h-screen">
      <div className="flex h-full items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <form className="border-muted flex flex-col gap-6 rounded-lg border p-8 shadow-sm">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Create an account</h1>
              <p className="text-muted-foreground text-sm mt-2">Create an account to access all features</p>
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
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                    name="confirm-password"
                    id="confirm-password"
                    type="password"
                    placeholder="********"
                    className="mt-1.5"
                    required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
          <p className="text-muted-foreground mt-6 text-center text-sm">
            Already a user?{" "}
            <Link to="/signin" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
