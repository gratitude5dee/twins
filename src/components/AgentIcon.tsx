
import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, Briefcase, Brain, Code, Database, Globe, HeartHandshake, MessageSquare, Shield, Sparkles } from 'lucide-react';

type AgentIconProps = {
  iconName: string;
  size?: number;
  className?: string;
};

const AgentIcon = ({ iconName, size = 24, className }: AgentIconProps) => {
  const iconMap: Record<string, React.ReactNode> = {
    bot: <Bot size={size} />,
    brain: <Brain size={size} />,
    code: <Code size={size} />,
    database: <Database size={size} />,
    sparkles: <Sparkles size={size} />,
    globe: <Globe size={size} />,
    message: <MessageSquare size={size} />,
    support: <HeartHandshake size={size} />,
    security: <Shield size={size} />,
    business: <Briefcase size={size} />,
  };

  const defaultIcon = <Bot size={size} />;
  
  return (
    <div className={cn('flex items-center justify-center', className)}>
      {iconMap[iconName] || defaultIcon}
    </div>
  );
};

export default AgentIcon;
