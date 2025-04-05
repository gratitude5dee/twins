import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Bot, Upload } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Twin name must be at least 2 characters.",
  }).max(50, {
    message: "Twin name cannot exceed 50 characters."
  }),
  description: z.string().max(500, {
    message: "Description cannot exceed 500 characters."
  }).optional(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateTwin = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Process tags if provided
      const tagArray = values.tags 
        ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];
        
      let imageUrl = null;
      
      // Upload image if selected
      if (imageFile) {
        setUploadProgress(10);
        
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        setUploadProgress(30);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('twin_images')
          .upload(filePath, imageFile);
          
        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`);
        }
        
        setUploadProgress(70);
        
        const { data: urlData } = supabase.storage
          .from('twin_images')
          .getPublicUrl(filePath);
          
        imageUrl = urlData.publicUrl;
        
        setUploadProgress(100);
      }
      
      // Create the digital twin
      const { data: twin, error } = await supabase
        .from('digital_twins')
        .insert([
          {
            name: values.name,
            description: values.description || null,
            owner_id: user.id,
            image_url: imageUrl,
            tags: tagArray.length > 0 ? tagArray : null,
          }
        ])
        .select()
        .single();
        
      if (error) {
        throw new Error(`Error creating twin: ${error.message}`);
      }
      
      if (twin) {
        // Create initial suggested questions
        const defaultQuestions = [
          `Tell me about ${values.name}`,
          `What can ${values.name} do?`,
          `How does ${values.name} work?`
        ];
        
        await supabase.from('suggested_questions').insert(
          defaultQuestions.map(question => ({
            twin_id: twin.id,
            question
          }))
        );
        
        toast({
          title: "Digital Twin created!",
          description: `Your twin "${values.name}" has been created successfully.`,
        });
        
        navigate(`/chat/${twin.id}`);
      } else {
        throw new Error("Failed to create digital twin");
      }
      
    } catch (error: any) {
      toast({
        title: "Error creating twin",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col space-y-4 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Create Digital Twin</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Create a new digital twin by uploading an image and providing some basic information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="w-full md:w-1/3">
                        <div className="flex flex-col items-center">
                          <div className="w-full aspect-square mb-4 bg-muted rounded-md overflow-hidden flex items-center justify-center relative">
                            {imagePreview ? (
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <Bot className="h-20 w-20 text-muted-foreground/40" />
                            )}
                            
                            {uploadProgress > 0 && uploadProgress < 100 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="w-3/4 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            className="w-full"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </Button>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            Recommended: Square JPG, PNG, or WebP, 500x500 pixels or larger
                          </p>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-2/3 space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Twin Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., My Assistant" {...field} />
                              </FormControl>
                              <FormDescription>
                                A clear, concise name for your digital twin.
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
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Optional description of what your digital twin represents or can do.
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
                                  placeholder="e.g., assistant, helper, productivity" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Optional comma-separated tags to help organize your twins.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                        Cancel
                      </Button>
                      <Button type="submit" className="gradient-bg hover:opacity-90" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Digital Twin"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="sticky top-8">
              <h3 className="text-lg font-medium mb-4">Tips for Creating Effective Twins</h3>
              
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <h4 className="font-medium mb-2">Image Selection</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose a clear, high-quality image that represents your twin. Images with distinct features work best.
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <h4 className="font-medium mb-2">Names and Description</h4>
                  <p className="text-sm text-muted-foreground">
                    Use descriptive names and detailed descriptions to help your twin understand its purpose.
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <h4 className="font-medium mb-2">Tagging Strategy</h4>
                  <p className="text-sm text-muted-foreground">
                    Add relevant tags to make it easier to find and categorize your twins as your collection grows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTwin;
