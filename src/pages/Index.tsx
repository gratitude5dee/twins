
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, GlassCard } from '@/components/ui/card';
import { Brain, Bot, Code, Sparkles, ArrowRight, Bot as BotIcon, Workflow, MessageSquare, Database } from 'lucide-react';
import Layout from '@/components/Layout';
import { useMousePosition } from '@/hooks/use-mouse-position';

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition(heroRef);
  const [isLoaded, setIsLoaded] = useState(false);

  // Enhanced parallax effect with depth perception
  const calculateParallax = (depth: number = 1) => {
    const x = (mousePosition.elementX - 0.5) * depth * -25; // Increased intensity
    const y = (mousePosition.elementY - 0.5) * depth * -25;
    return `translate3d(${x}px, ${y}px, 0) scale(${1 + depth * 0.01})`; // Added subtle scale
  };

  // Simulate loading for entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      {/* Hero Section with Enhanced Mouse Parallax */}
      <section 
        ref={heroRef} 
        className="py-16 md:py-32 relative overflow-hidden"
        style={{perspective: '1000px'}} // Add perspective for 3D effect
      >
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div className={`space-y-8 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium backdrop-blur-sm border border-primary/20 transition-all hover:bg-primary/20 cursor-default">
                introducing agency
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Create <span className="gradient-text font-display">Knowledge Workers</span> Tailored to Your Needs
              </h1>
              <p className="text-lg text-muted-foreground max-w-[600px] leading-relaxed">
                Leverage the power of artificial intelligence to build custom AI agents that help with research, content creation, data analysis, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="gradient" className="interactive-button relative overflow-hidden group shadow-glow">
                  <Link to="/create-agent" className="flex items-center">
                    <span className="relative z-10 flex items-center">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Create Your Agent
                    </span>
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="interactive-button backdrop-blur-sm bg-background/50 border-white/20">
                  <Link to="/documentation" className="flex items-center">
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] h-[450px] rounded-lg overflow-hidden perspective" 
                style={{
                  transform: calculateParallax(0.3),
                  transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
              >
                {/* Animated background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 animate-pulse-slow"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgTCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <GlassCard 
                    className="p-8 max-w-[400px] transition-all duration-700 shadow-xl border border-white/20 backdrop-blur-md bg-background/40 hover:shadow-glow-blue" 
                    style={{
                      transform: calculateParallax(1.2),
                      opacity: isLoaded ? 1 : 0,
                      scale: isLoaded ? 1 : 0.95,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-float shadow-md">
                        <BotIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Research Assistant</h3>
                        <p className="text-xs text-muted-foreground">AI Agent</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-background/50 p-3 rounded-lg text-sm shadow-subtle border border-white/10">
                        "I need you to find the latest research on renewable energy trends and summarize the key points."
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg text-sm shadow-subtle border border-white/10 animate-fade-in">
                        "I've analyzed 25 recent publications on renewable energy. The key trends include a 40% increase in solar efficiency, growing adoption of green hydrogen, and significant policy shifts in major economies..."
                      </div>
                    </div>
                  </GlassCard>
                </div>
                {/* Floating elements for depth */}
                <div className="absolute left-[10%] top-[10%] w-12 h-12 rounded-full bg-primary/10 backdrop-blur-sm animate-float opacity-70" style={{animationDelay: '0s'}}></div>
                <div className="absolute right-[15%] top-[20%] w-8 h-8 rounded-full bg-secondary/20 backdrop-blur-sm animate-float opacity-60" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute left-[25%] bottom-[15%] w-10 h-10 rounded-full bg-accent/10 backdrop-blur-sm animate-float opacity-50" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Abstract background elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[60%] bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-gradient-to-t from-accent/10 to-transparent rounded-full blur-3xl opacity-20 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        </div>
      </section>

      {/* Features Section with Enhanced Cards */}
      <section className="py-20 bg-muted/20 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2VGaWx0ZXIpIiBvcGFjaXR5PSIwLjAzIi8+PC9zdmc+')] opacity-50"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Features & Capabilities</h2>
            <p className="text-muted-foreground text-lg">Powerful tools to help you create and manage your AI agents</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards */}
            {featureCards.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-card-gradient backdrop-blur-sm overflow-hidden group transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] hover:shadow-primary/5 border border-white/10"
              >
                <CardHeader>
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                    {feature.icon}
                  </div>
                  <CardTitle className="transition-colors group-hover:text-primary">{feature.title}</CardTitle>
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

      {/* CTA Section with Enhanced Visuals */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgTCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="container px-4 md:px-6 relative">
          <div className="rounded-2xl p-8 md:p-16 gradient-bg shadow-2xl transform transition-all hover:shadow-glow relative overflow-hidden z-10 border border-white/10">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNzUiIG51bU9jdGF2ZXM9IjIiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2VGaWx0ZXIpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-50"></div>
            
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4 text-white">Ready to Create Your AI Agent?</h2>
                <p className="text-white/90 mb-8 max-w-[500px] text-lg">
                  Get started in minutes. No coding required. Just describe what you want your agent to do and watch it come to life.
                </p>
                <Button asChild size="lg" variant="secondary" className="font-medium interactive-button group relative overflow-hidden backdrop-blur-sm">
                  <Link to="/create-agent" className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span>Start Building Now</span>
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Link>
                </Button>
              </div>
              
              <div className="hidden lg:flex justify-end">
                <div className="relative">
                  <div className="absolute -left-8 -top-8 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm animate-float"></div>
                  <div className="absolute -right-12 -bottom-12 w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm animate-float" style={{animationDelay: '1s'}}></div>
                  <div className="w-72 h-72 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center animate-tilt shadow-lg border border-white/20">
                    <Bot className="h-28 w-28 text-white drop-shadow-lg" />
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
const featureCards = [{
  icon: <Bot className="h-6 w-6" />,
  title: "Custom AI Agents",
  description: "Create AI agents tailored to your specific needs and use cases.",
  content: "Build specialized AI assistants for research, content creation, customer support, and more."
}, {
  icon: <Brain className="h-6 w-6" />,
  title: "Advanced Instructions",
  description: "Configure detailed instructions to guide your agent's behavior.",
  content: "Define personality, knowledge domains, response style, and conversation flow."
}, {
  icon: <Workflow className="h-6 w-6" />,
  title: "Agent Templates",
  description: "Start with pre-built templates for common use cases.",
  content: "Choose from a variety of templates and customize them to your specific requirements."
}, {
  icon: <MessageSquare className="h-6 w-6" />,
  title: "Conversational Interface",
  description: "Engage with your agents through a natural chat interface.",
  content: "Interact with your AI agents using natural language in a user-friendly chat environment."
}, {
  icon: <Database className="h-6 w-6" />,
  title: "Knowledge Management",
  description: "Upload documents and data to enhance your agent's knowledge.",
  content: "Give your agents access to your proprietary data, documentation, and knowledge base."
}, {
  icon: <Code className="h-6 w-6" />,
  title: "API Integration",
  description: "Connect your agents to external services and data sources.",
  content: "Integrate with APIs to access real-time data and perform actions in other systems."
}];

export default Index;
