
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import AgentIcon from './AgentIcon';

export type AgentType = {
  id: string;
  name: string;
  description: string;
  icon: string;
  instructions?: string;
};

interface AgentCardProps {
  agent: AgentType;
  isPreview?: boolean;
}

const AgentCard = ({ agent, isPreview = false }: AgentCardProps) => {
  return (
    <Card className={`overflow-hidden h-full transition-all ${isPreview ? 'border-primary shadow-md' : 'hover:shadow-md'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            <AgentIcon iconName={agent.icon} />
          </div>
          {isPreview && (
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
              Preview
            </span>
          )}
        </div>
        <CardTitle className="text-lg mt-3">{agent.name || "Unnamed Agent"}</CardTitle>
        <CardDescription className="line-clamp-2 h-10">
          {agent.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Instructions:</span>
          <div className="mt-1 line-clamp-3 h-12">
            {agent.instructions ? agent.instructions : "No instructions provided yet"}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline" className="w-full">
          <Sparkles className="mr-2 h-4 w-4" />
          {isPreview ? "How It Would Look" : "Chat with Agent"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AgentCard;
