
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from '@/components/Layout';
import TwinImageUpload from '@/components/TwinImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Bot } from 'lucide-react';

// Supabase URL for edge function calls
const supabaseUrl = 'https://juvfuvamiszfyinyxlxw.supabase.co';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateTwin = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imagePath, setImagePath] = useState<string>('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: "",
    },
  });

  const handleImageUploaded = (url: string, path: string) => {
    setImageUrl(url);
    setImagePath(path);
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to create a twin.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // Parse tags from comma-separated string
      const tagsArray = values.tags 
        ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      // Create the twin in the database
      const { data: twin, error } = await supabase
        .from('digital_twins')
        .insert([
          {
            name: values.name,
            description: values.description || '',
            image_url: imageUrl,
            owner_id: user.id,
            tags: tagsArray,
            status: 'active',
            processing_status: imageUrl ? 'pending' : 'not_applicable'
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Twin created!",
        description: "Your digital twin has been created successfully.",
      });

      // If there's an image, start processing
      if (imageUrl && session?.access_token) {
        try {
          // Call the edge function to start processing
          const response = await fetch(
            `${supabaseUrl}/functions/v1/process-twin-image`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
              },
              body: JSON.stringify({ twinId: twin.id })
            }
          );

          const processingResult = await response.json();
          
          if (!response.ok) {
            console.warn('Image processing request failed:', processingResult);
            toast({
              title: "Processing Warning",
              description: "Twin created, but image processing couldn't be started.",
              variant: "destructive",
            });
          }
        } catch (processingError) {
          console.error('Error starting image processing:', processingError);
          // Don't fail the entire twin creation if processing fails
          toast({
            title: "Processing Warning",
            description: "Twin created, but image processing couldn't be started.",
            variant: "destructive",
          });
        }
      }

      // Navigate to the twin details page
      navigate(`/twin/${twin.id}`);
    } catch (error: any) {
      console.error('Error creating twin:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while creating your twin.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Layout>
      <div className="container py-12 max-w-3xl">
        <div className="flex flex-col items-center mb-10">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Bot className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Create a Digital Twin</h1>
          <p className="text-muted-foreground mt-2 text-center max-w-md">
            Create a digital twin by uploading an image and providing details. The system will process your image to create an interactive representation.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TwinImageUpload onImageUploaded={handleImageUploaded} />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Digital Twin" {...field} />
                  </FormControl>
                  <FormDescription>
                    A name for your digital twin.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your digital twin..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about your digital twin.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="personal, work, family" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated tags to help organize your twins.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isCreating} 
                className="gradient-bg"
              >
                {isCreating ? "Creating..." : "Create Digital Twin"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default CreateTwin;
