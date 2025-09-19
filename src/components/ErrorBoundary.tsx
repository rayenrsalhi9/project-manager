import { useRouteError, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SupabaseError {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
  status?: number;
}

export default function ErrorBoundary() {
    const error = useRouteError() as Error & SupabaseError;
    
    // Map technical errors to user-friendly messages
    const getUserFriendlyMessage = (error: Error & SupabaseError) => {
        // Handle specific Supabase error codes
        if (error.code) {
            switch (error.code) {
                case 'PGRST116':
                    return "The requested information could not be found.";
                case '23505':
                    return "This information already exists in our system.";
                case '42P01':
                case '42703':
                    return "There's a temporary issue with our service. Please try again.";
                case 'PGRST301':
                    return "You don't have permission to access this information.";
                default:
                    break;
            }
        }
        
        // Handle HTTP status codes
        if (error.status) {
            switch (error.status) {
                case 404:
                    return "The page or information you're looking for doesn't exist.";
                case 403:
                    return "You don't have permission to access this resource.";
                case 500:
                    return "We're experiencing technical difficulties. Please try again later.";
                case 503:
                    return "Our service is temporarily unavailable. Please try again in a few minutes.";
                default:
                    break;
            }
        }
        
        // Fallback to original message if it's user-safe, otherwise use generic message
        const message = error.message || "";
        const isSafeMessage = !message.toLowerCase().includes('sql') && 
                             !message.toLowerCase().includes('database') &&
                             !message.toLowerCase().includes('pg') &&
                             !message.toLowerCase().includes('relation') &&
                             message.length < 100; // Avoid exposing long technical messages
        
        return isSafeMessage && message
            ? message
            : "We're sorry, but something unexpected happened. Please try again or contact support if the issue continues.";
    };

    const userMessage = getUserFriendlyMessage(error);
    
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center p-8 rounded-lg max-w-md w-full">
                <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-4">
                        Something went wrong
                    </h1>
                    <p className="text-gray-600 leading-relaxed">
                        {userMessage}
                    </p>
                </div>

                <div className="space-y-3">
                    <Button asChild className="w-full">
                        <Link to="/home">Return Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}