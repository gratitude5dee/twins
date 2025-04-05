import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, GlassCard } from '@/components/ui/card';
import { Brain, Bot, Code, Sparkles, ArrowRight, Bot as BotIcon, Workflow, MessageSquare, Database } from 'lucide-react';
import Layout from '@/components/Layout';
import { useMousePosition } from '@/hooks/use-mouse-position';

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition(heroRef);
  
  // Calculate parallax effect for hero elements
  const calculateParallax = (depth: number = 1) => {
    const x = (mousePosition.elementX - 0.5) * depth * -20;
    const y = (mousePosition.elementY - 0.5) * depth * -20;
    return `translate(${x}px, ${y}px)`;
  };

  return (
    <Layout>
      {/* Hero Section with Mouse Parallax */}
      <section ref={heroRef} className="py-16 md:py-24 relative overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium transition-all hover:bg-muted/80">
                introducing agency
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Create <span className="gradient-text">AI Agents</span> Tailored to Your Needs
              </h1>
              <p className="text-lg text-muted-foreground max-w-[600px]">
                Leverage the power of artificial intelligence to build custom AI agents that help with research, content creation, data analysis, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" variant="gradient" className="interactive-button">
                  <Link to="/create-agent">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Create Your Agent
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="interactive-button">
                  <Link to="/documentation">
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div 
                className="relative w-full max-w-[500px] h-[400px] bg-muted rounded-lg overflow-hidden glass"
                style={{ transform: calculateParallax(0.5) }}
              >
                <div className="absolute inset-0 gradient-bg opacity-20 animate-pulse-slow"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <GlassCard 
                    className="p-8 max-w-[400px] transition-all duration-500 hover:shadow-glow-blue"
                    style={{ transform: calculateParallax(1.2) }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full gradient-bg flex items-center justify-center animate-float">
                        <BotIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Research Assistant</h3>
                        <p className="text-xs text-muted-foreground">AI Agent</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-muted/50 p-3 rounded-lg text-sm shadow-subtle border border-white/10">
                        "I need you to find the latest research on renewable energy trends and summarize the key points."
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg text-sm shadow-subtle border border-white/10 fade-in">
                        "I've analyzed 25 recent publications on renewable energy. The key trends include a 40% increase in solar efficiency, growing adoption of green hydrogen, and significant policy shifts in major economies..."
                      </div>
                    </div>
                  </GlassCard>
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
            {/* Feature Cards */}
            {featureCards.map((feature, index) => (
              <Card key={index} className="bg-card-gradient overflow-hidden group">
                <CardHeader>
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="rounded-2xl p-6 md:p-12 gradient-bg text-white shadow-xl transform transition-all hover:scale-[1.01]">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Create Your AI Agent?</h2>
                <p className="opacity-90 mb-6 max-w-[500px]">
                  Get started in minutes. No coding required. Just describe what you want your agent to do.
                </p>
                <Button asChild size="lg" variant="secondary" className="font-medium interactive-button">
                  <Link to="/create-agent">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Building Now
                  </Link>
                </Button>
              </div>
              
              <div className="hidden lg:flex justify-end">
                <div className="relative">
                  <div className="absolute -left-6 -top-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm animate-float"></div>
                  <div className="absolute -right-8 -bottom-8 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm animate-float" style={{animationDelay: '1s'}}></div>
                  <div className="w-64 h-64 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-tilt">
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

// Feature card data
const featureCards = [
  {
    icon: <Bot className="h-6 w-6" />,
    title: "Custom AI Agents",
    description: "Create AI agents tailored to your specific needs and use cases.",
    content: "Build specialized AI assistants for research, content creation, customer support, and more."
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Advanced Instructions",
    description: "Configure detailed instructions to guide your agent's behavior.",
    content: "Define personality, knowledge domains, response style, and conversation flow."
  },
  {
    icon: <Workflow className="h-6 w-6" />,
    title: "Agent Templates",
    description: "Start with pre-built templates for common use cases.",
    content: "Choose from a variety of templates and customize them to your specific requirements."
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Conversational Interface",
    description: "Engage with your agents through a natural chat interface.",
    content: "Interact with your AI agents using natural language in a user-friendly chat environment."
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: "Knowledge Management",
    description: "Upload documents and data to enhance your agent's knowledge.",
    content: "Give your agents access to your proprietary data, documentation, and knowledge base."
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "API Integration",
    description: "Connect your agents to external services and data sources.",
    content: "Integrate with APIs to access real-time data and perform actions in other systems."
  }
];

export default Index;
