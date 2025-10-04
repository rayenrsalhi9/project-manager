import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-2">
          <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-6xl font-bold text-foreground">
            404
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            The path you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          <Link to="/" className="inline-block">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-foreground hover:bg-foreground/90 text-background cursor-pointer"
            >
              <Home className="w-4 h-4 mr-2" />
              Return to Home Page
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;