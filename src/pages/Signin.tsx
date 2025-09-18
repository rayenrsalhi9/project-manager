import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function Signin() {
  return (
    <section className="h-screen bg-background">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <form className="min-w-sm border-muted flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
            <h1 className="text-xl font-semibold">Welcome back!</h1>
            <p className="text-muted-foreground text-sm">Sign in and continue where you left off</p>
            <div className="flex w-full flex-col gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="e.g. name@example.com"
                className="text-sm"
                required
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="********"
                className="text-sm"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>Don't have an account?</p>
            <Link
              to="/signup"
              className="text-primary font-medium hover:underline"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
