
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Bot } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center min-h-[70vh] py-16 px-4 text-center">
        <div className="h-24 w-24 rounded-full gradient-bg flex items-center justify-center mb-6">
          <Bot className="h-12 w-12 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-2">404 - Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link to="/">
              Return to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/create-agent">
              Create an Agent
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
