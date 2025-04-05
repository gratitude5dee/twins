
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Bot, Code, Sparkles, ArrowRight, Bot as BotIcon, Workflow, MessageSquare, Database } from 'lucide-react';
import Layout from '@/components/Layout';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Introducing AgentForge
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Create <span className="gradient-text">AI Agents</span> Tailored to Your Needs
              </h1>
              <p className="text-lg text-muted-foreground max-w-[600px]">
                Leverage the power of artificial intelligence to build custom AI agents that help with research, content creation, data analysis, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="gradient-bg hover:opacity-90">
                  <Link to="/create-agent">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Create Your Agent
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/documentation">
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] h-[400px] bg-muted rounded-lg overflow-hidden">
                <div className="absolute inset-0 gradient-bg opacity-20 animate-pulse-slow"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-8 bg-background/80 backdrop-blur-sm rounded-xl shadow-xl border border-border max-w-[400px]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full gradient-bg flex items-center justify-center">
                        <BotIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Research Assistant</h3>
                        <p className="text-xs text-muted-foreground">AI Agent</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        "I need you to find the latest research on renewable energy trends and summarize the key points."
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg text-sm">
                        "I've analyzed 25 recent publications on renewable energy. The key trends include a 40% increase in solar efficiency, growing adoption of green hydrogen, and significant policy shifts in major economies..."
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Features & Capabilities</h2>
            <p className="text-muted-foreground text-lg">Powerful tools to help you create and manage your AI agents</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <Bot className="h-6 w-6" />
                </div>
                <CardTitle>Custom AI Agents</CardTitle>
                <CardDescription>Create AI agents tailored to your specific needs and use cases.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Build specialized AI assistants for research, content creation, customer support, and more.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <Brain className="h-6 w-6" />
                </div>
                <CardTitle>Advanced Instructions</CardTitle>
                <CardDescription>Configure detailed instructions to guide your agent's behavior.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Define personality, knowledge domains, response style, and conversation flow.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <Workflow className="h-6 w-6" />
                </div>
                <CardTitle>Agent Templates</CardTitle>
                <CardDescription>Start with pre-built templates for common use cases.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Choose from a variety of templates and customize them to your specific requirements.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <CardTitle>Conversational Interface</CardTitle>
                <CardDescription>Engage with your agents through a natural chat interface.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Interact with your AI agents using natural language in a user-friendly chat environment.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <Database className="h-6 w-6" />
                </div>
                <CardTitle>Knowledge Management</CardTitle>
                <CardDescription>Upload documents and data to enhance your agent's knowledge.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Give your agents access to your proprietary data, documentation, and knowledge base.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <Code className="h-6 w-6" />
                </div>
                <CardTitle>API Integration</CardTitle>
                <CardDescription>Connect your agents to external services and data sources.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Integrate with APIs to access real-time data and perform actions in other systems.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="rounded-2xl p-6 md:p-12 gradient-bg text-white">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Create Your AI Agent?</h2>
                <p className="opacity-90 mb-6 max-w-[500px]">
                  Get started in minutes. No coding required. Just describe what you want your agent to do.
                </p>
                <Button asChild size="lg" variant="secondary" className="font-medium">
                  <Link to="/create-agent">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Building Now
                  </Link>
                </Button>
              </div>
              
              <div className="hidden lg:flex justify-end">
                <div className="relative">
                  <div className="absolute -left-6 -top-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm"></div>
                  <div className="absolute -right-8 -bottom-8 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm"></div>
                  <div className="w-64 h-64 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Bot className="h-24 w-24 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
