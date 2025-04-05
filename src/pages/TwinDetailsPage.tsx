
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MessageCircle, Pencil, Share2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type TwinDetail = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  status: string | null;
  created_at: string;
  tags: string[] | null;
  features: Record<string, any> | null;
  model_data: Record<string, any> | null;
  processing_status: string | null;
  owner_id: string;
  updated_at: string;
  parent_id: string | null;
  related_twin_ids: string[] | null;
};

type Category = {
  id: string;
  name: string;
};

const TwinDetailsPage = () => {
  const { twinId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [twin, setTwin] = useState<TwinDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [twinCategories, setTwinCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchTwin = async () => {
      if (!twinId || !user) return;

      try {
        setLoading(true);
        // Fetch the twin data
        const { data: twinData, error: twinError } = await supabase
          .from('digital_twins')
          .select('*')
          .eq('id', twinId)
          .eq('owner_id', user.id)
          .single();

        if (twinError) throw twinError;
        if (!twinData) {
          toast({
            title: "Twin not found",
            description: "The digital twin you requested could not be found.",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }

        // Use the RPC function to fetch twin categories
        const { data: categoryJoins, error: categoryJoinsError } = await supabase
          .rpc('get_twin_categories', { twin_id_param: twinId });

        if (!categoryJoinsError && categoryJoins) {
          const categoryIds = categoryJoins.map(item => item.category_id);
          setTwinCategories(categoryIds);
          
          if (categoryIds.length > 0) {
            // Fetch category details using the RPC function
            const { data: categoryData, error: categoriesError } = await supabase
              .rpc('get_categories_by_ids', { category_ids_param: categoryIds });
            
            if (!categoriesError && categoryData) {
              setCategories(categoryData);
            }
          }
        }

        // Since the database might not have these fields yet, provide defaults
        const twinWithDefaults: TwinDetail = {
          ...twinData,
          features: twinData.features || null,
          model_data: twinData.model_data || null,
          processing_status: twinData.processing_status || 'pending'
        };

        setTwin(twinWithDefaults);
      } catch (error: any) {
        console.error('Error fetching twin:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load twin details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTwin();
  }, [twinId, user, navigate, toast]);

  const handleStartChat = () => {
    navigate(`/chat/${twinId}`);
  };

  const handleEdit = () => {
    navigate(`/edit-twin/${twinId}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this digital twin?')) return;
    
    try {
      const { error } = await supabase
        .from('digital_twins')
        .delete()
        .eq('id', twinId);
      
      if (error) throw error;
      
      toast({
        title: "Twin deleted",
        description: "Your digital twin has been successfully deleted.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete twin",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-2">
              <ArrowLeft size={18} />
            </Button>
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid gap-6 md:grid-cols-[1fr_300px]">
            <Skeleton className="h-96 rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-52 rounded-lg" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!twin) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Twin Not Found</h2>
          <p className="mb-6">The digital twin you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-2">
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-2xl font-bold">{twin.name}</h1>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleEdit}>
              <Pencil size={16} className="mr-2" />
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={handleStartChat}>
              <MessageCircle size={16} className="mr-2" />
              Chat
            </Button>
            <Button size="sm" variant="destructive" onClick={handleDelete}>
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div>
            <Card className="mb-6 overflow-hidden">
              {twin.image_url ? (
                <div className="relative aspect-video bg-muted">
                  <img 
                    src={twin.image_url} 
                    alt={twin.name}
                    className="w-full h-full object-cover"
                  />
                  {twin.processing_status && (
                    <div className="absolute top-4 right-4">
                      <Badge variant={twin.processing_status === 'completed' ? 'default' : 'secondary'}>
                        {twin.processing_status === 'completed' ? 'Ready' : 
                         twin.processing_status === 'processing' ? 'Processing' : 
                         twin.processing_status === 'error' ? 'Error' : 'Pending'}
                      </Badge>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
            </Card>

            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="model">Model Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {twin.description || <span className="text-muted-foreground">No description provided</span>}
                  </CardContent>
                </Card>
                
                {twin.tags && twin.tags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {twin.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <CardTitle>Extracted Features</CardTitle>
                    <CardDescription>Features extracted from the image during processing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {twin.features ? (
                      <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96">
                        {JSON.stringify(twin.features, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-muted-foreground">No feature data available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="model">
                <Card>
                  <CardHeader>
                    <CardTitle>Model Data</CardTitle>
                    <CardDescription>Technical data for the digital twin model</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {twin.model_data ? (
                      <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96">
                        {JSON.stringify(twin.model_data, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-muted-foreground">No model data available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
                  <p>{new Date(twin.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                  <Badge variant={twin.status === 'active' ? 'default' : 'secondary'}>
                    {twin.status || 'Unknown'}
                  </Badge>
                </div>
                {categories.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <Badge key={category.id} variant="outline">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Share</CardTitle>
                <CardDescription>Share this digital twin with others</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>
                  <Share2 size={16} className="mr-2" />
                  Share Digital Twin
                </Button>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Sharing capabilities coming soon
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TwinDetailsPage;
