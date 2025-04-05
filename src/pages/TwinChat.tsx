
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ClientPage } from '@/components/ClientPage';
import { AppStateProvider } from '@/contexts/AppStateProvider';

/**
 * TwinChat Component
 * 
 * IMPORTANT:
 * For chat functionality to work properly:
 * 1. The Python backend server must be running
 * 2. The VITE_SERVER_URL environment variable must be set correctly
 */
interface DigitalTwin {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  tags: string[] | null;
  status: string | null;
}

const TwinChat = () => {
  const { twinId } = useParams<{ twinId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch digital twin details
  const { data: twin, isLoading: twinLoading } = useQuery({
    queryKey: ['digital-twin', twinId],
    queryFn: async () => {
      if (!twinId) return null;
      const { data, error } = await supabase
        .from('digital_twins')
        .select('*')
        .eq('id', twinId)
        .single();

      if (error) throw error;
      return data as DigitalTwin;
    },
    enabled: !!twinId && !!user,
  });

  // Loading state
  if (twinLoading) {
    return (
      <Layout>
        <div className="container py-8 flex justify-center items-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
            <div className="h-4 bg-muted rounded w-48 mb-2"></div>
            <div className="h-3 bg-muted rounded w-32"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!twin) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Digital Twin Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The digital twin you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Header */}
        <header className="border-b sticky top-0 bg-background z-10">
          <div className="container flex items-center justify-between py-3">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3 overflow-hidden">
                  {twin.image_url ? (
                    <img src={twin.image_url} alt={twin.name} className="h-full w-full object-cover" />
                  ) : (
                    <Bot className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h1 className="font-semibold text-lg">{twin.name}</h1>
                  {twin.status && (
                    <Badge variant={twin.status === 'active' ? "default" : "secondary"} className="text-xs">
                      {twin.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Client Page with Context Provider */}
        <div className="flex-1 overflow-auto">
          <AppStateProvider 
            initialConversationId={twinId} 
            initialTwinData={twin}
          >
            <ClientPage />
          </AppStateProvider>
        </div>
      </div>
    </Layout>
  );
};

export default TwinChat;
