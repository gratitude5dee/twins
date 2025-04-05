
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Brain, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Layout from '@/components/Layout';
import AgentCard from '@/components/AgentCard';
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Agent name must be at least 2 characters.",
  }).max(50, {
    message: "Agent name cannot exceed 50 characters."
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(150, {
    message: "Description cannot exceed 150 characters."
  }),
  instructions: z.string().min(20, {
    message: "Instructions must be at least 20 characters.",
  }).max(2000, {
    message: "Instructions cannot exceed 2000 characters."
  }),
  icon: z.string().default("bot"),
});

const CreateAgent = () => {
  const { toast } = useToast();
  const [previewAgent, setPreviewAgent] = useState({
    id: uuidv4(),
    name: "AI Assistant",
    description: "A helpful AI assistant that can answer questions and provide information.",
    icon: "sparkles",
    instructions: "You are a helpful AI assistant. Answer questions accurately and concisely.",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      instructions: "",
      icon: "bot",
    },
  });

  const watchedValues = form.watch();

  // Update preview when form values change
  React.useEffect(() => {
    setPreviewAgent(prev => ({
      ...prev,
      name: watchedValues.name || "Unnamed Agent",
      description: watchedValues.description || "No description provided",
      icon: watchedValues.icon || "bot",
      instructions: watchedValues.instructions || "No instructions provided yet",
    }));
  }, [watchedValues]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // This would typically send the data to an API
    console.log(values);
    
    toast({
      title: "Agent created!",
      description: `Your agent "${values.name}" has been created successfully.`,
    });
  }

  const iconOptions = [
    { value: "bot", label: "Robot" },
    { value: "brain", label: "Brain" },
    { value: "sparkles", label: "Sparkles" },
    { value: "code", label: "Code" },
    { value: "database", label: "Database" },
    { value: "globe", label: "Globe" },
    { value: "message", label: "Message" },
    { value: "support", label: "Support" },
    { value: "security", label: "Security" },
    { value: "business", label: "Business" },
  ];

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col space-y-4 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Create Your AI Agent</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Design your custom AI agent by defining its name, purpose, and capabilities. The more detailed your instructions, the better your agent will perform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agent Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Research Assistant" {...field} />
                          </FormControl>
                          <FormDescription>
                            A clear, concise name for your AI agent.
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
                            <Input 
                              placeholder="e.g., An AI assistant that helps with research and summarizes articles" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            A brief description of what your agent does.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an icon" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {iconOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center">
                                    <div className="w-5 h-5 mr-2">
                                      <AgentIcon iconName={option.value} size={20} />
                                    </div>
                                    <span>{option.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose an icon that represents your agent's purpose.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="instructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instructions</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide detailed instructions about what your agent should do, how it should respond, and any specific knowledge it should have..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Detailed instructions for your agent. Be specific about its capabilities, personality, and any limitations.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline">
                        Save as Draft
                      </Button>
                      <Button type="submit" className="gradient-bg hover:opacity-90">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Create Agent
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="sticky top-8">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <AgentCard agent={previewAgent} isPreview={true} />
              
              <div className="mt-8 space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <h4 className="font-medium flex items-center mb-2">
                    <Brain className="w-4 h-4 mr-2" />
                    AI Agent Tips
                  </h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Be specific in your instructions about your agent's purpose and capabilities.</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Include guidelines on how your agent should respond to different types of questions.</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Specify any knowledge domains your agent should be an expert in.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateAgent;
