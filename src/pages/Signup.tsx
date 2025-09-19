import { useActionState } from "react";
import { Link } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup():JSX.Element {

  const {signUserUp} = useAuth()
  const navigate = useNavigate()

  const [error, handleSubmit, isPending] = useActionState(
    async(_prevState: string | null, formData: FormData): Promise<string | null> => {
      
      const fullName = formData.get('full-name') as string
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      const confirmPassword = formData.get('confirm-password') as string
      
      if (!fullName || !email || !password || !confirmPassword) {
        return 'All fields are required'
      }
      if (password !== confirmPassword) {
        return 'Passwords do not match'
      }

      const {success, data, error} = await signUserUp(fullName, email, password)

      if (error) return error
      if (success && data) navigate('/dashboard')

      return 'An error occured, please try again.'
    }, null
  )

  return (
    <section className="bg-background h-screen">
      <div className="flex h-full items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <form 
            className="border-muted flex flex-col gap-6 rounded-lg border p-8 shadow-sm"
            action={handleSubmit}
            aria-label="sign in form"
            aria-describedby="form-description"
          >
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Create an account</h1>
              <p className="text-muted-foreground text-sm mt-2">Create an account to access all features</p>
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
                <Label htmlFor="full-name">Full name</Label>
                <Input
                    name="full-name"
                    id="full-name"
                    type="text"
                    placeholder="e.g. John Doe"
                    className={`mt-2 ${error ? 'border-red-500' : ''}`} 
                    required
                    aria-required="true"
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? 'signin-error' : undefined}
                    disabled={isPending}
                />
              </div>
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
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                    name="confirm-password"
                    id="confirm-password"
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
              {isPending ? 'Creating account...' : 'Create Account'}
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