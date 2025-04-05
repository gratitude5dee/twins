
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Bot, Filter, Plus, Search, Tag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

type DigitalTwin = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  tags: string[] | null;
  status: string | null;
  created_at: string;
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const { data: twins = [], isLoading } = useQuery({
    queryKey: ['digital-twins', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('digital_twins')
        .select('*')
        .eq('owner_id', user.id);

      if (error) {
        console.error('Error fetching twins:', error);
        return [];
      }
      return data as DigitalTwin[];
    },
    enabled: !!user,
  });

  // Extract unique tags from all twins
  useEffect(() => {
    if (twins.length > 0) {
      const allTags = twins.flatMap(twin => twin.tags || []);
      const uniqueTagsArray = Array.from(new Set(allTags));
      setUniqueTags(uniqueTagsArray);
    }
  }, [twins]);

  // Filter twins based on search term and active tag
  const filteredTwins = twins.filter(twin => {
    const matchesSearch = 
      twin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (twin.description && twin.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = !activeTag || (twin.tags && twin.tags.includes(activeTag));
    
    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="h-12 w-64 mb-8">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardFooter>
                  <Skeleton className="h-4 w-20" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold tracking-tight">Your Digital Twins</h1>
            <Button asChild className="gradient-bg hover:opacity-90">
              <Link to="/create-twin">
                <Plus className="mr-2 h-4 w-4" />
                Create New Twin
              </Link>
            </Button>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Manage and interact with your digital twins. Create new ones or continue conversations with existing ones.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your twins..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>

        {uniqueTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge 
              variant={activeTag === null ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setActiveTag(null)}
            >
              All
            </Badge>
            {uniqueTags.map(tag => (
              <Badge 
                key={tag} 
                variant={activeTag === tag ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardFooter>
                  <Skeleton className="h-4 w-20" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredTwins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTwins.map(twin => (
              <Link key={twin.id} to={`/chat/${twin.id}`}>
                <Card className="overflow-hidden h-full hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-48 bg-muted relative">
                    {twin.image_url ? (
                      <img 
                        src={twin.image_url} 
                        alt={twin.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        <Bot className="h-16 w-16 text-muted-foreground/40" />
                      </div>
                    )}
                    {twin.status && (
                      <div className="absolute top-2 right-2">
                        <Badge variant={twin.status === 'active' ? "default" : "secondary"}>
                          {twin.status}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <h2 className="text-xl font-bold">{twin.name}</h2>
                    <p className="text-muted-foreground line-clamp-2">
                      {twin.description || "No description"}
                    </p>
                  </CardHeader>
                  <CardFooter className="flex flex-wrap gap-2">
                    {twin.tags && twin.tags.length > 0 ? (
                      twin.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No tags</span>
                    )}
                    {twin.tags && twin.tags.length > 3 && (
                      <Badge variant="outline">+{twin.tags.length - 3}</Badge>
                    )}
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Bot className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No digital twins found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || activeTag 
                ? "Try adjusting your search or filters" 
                : "Create your first digital twin to get started"}
            </p>
            {!searchTerm && !activeTag && (
              <Button asChild className="gradient-bg hover:opacity-90">
                <Link to="/create-twin">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Twin
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
