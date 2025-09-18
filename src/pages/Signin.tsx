import { useActionState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { JSX } from "react";


export default function Signin():JSX.Element {

  const {signUserIn} = useAuth()
  const navigate = useNavigate()

  const [error, handleSubmit, isPending] = useActionState(
    async(_prevState: string | null, formData: FormData): Promise<string | null> => {
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      if (!email || !password) return 'All fields must be filled'

      const {success, data, error: loginError} = await signUserIn(email, password)
      if (loginError) return loginError
      if (success && data) {
        navigate('/dashboard')
        return null
      }
      return 'Sign in failed, please try again.'
    }, null
  )

  return (
    <section className="h-screen bg-background">
      <div className="flex h-full items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <form 
            action={handleSubmit}
            className="border-muted flex flex-col gap-6 rounded-lg border p-8 shadow-sm"
            aria-label="sign in form"
            aria-describedby="form-description"
          >
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Welcome back!</h1>
              <p className="text-muted-foreground text-sm mt-2">Sign in and continue where you left off</p>
            </div>

            <div 
              id="form-description" 
              className="absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap border-0"
              aria-hidden="false"
            >
              Use this form to sign in to your account. Enter your email and password.
            </div>
            
            {
              error ? 
              <p 
                className="text-destructive text-sm text-center" 
                id="signin-error"
                role="alert"
              >
                {error}
              </p> 
              : null
            }

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="e.g. name@example.com"
                  className={`mt-2 ${error ? 'border-red-500' : ''}`}
                  required
                  aria-required="true"
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'signin-error' : undefined}
                  disabled={isPending}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="********"
                  className={`mt-2 ${error ? 'border-red-500' : ''}`}
                  required
                  aria-required="true"
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'signin-error' : undefined}
                  disabled={isPending}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className={`w-full cursor-pointer ${isPending ? 'opacity-80 cursor-not-allowed' : ''}`}
              disabled={isPending}
              aria-busy={isPending}
            >
              {isPending ? 'Signing in...' : 'Sign in'}
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
