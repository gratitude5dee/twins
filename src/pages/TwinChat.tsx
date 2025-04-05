
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  Bot, 
  ChevronDown, 
  ChevronUp, 
  Mic, 
  MoreHorizontal, 
  RefreshCcw, 
  Send, 
  Sparkles, 
  User 
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface DigitalTwin {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  tags: string[] | null;
  status: string | null;
}

interface Message {
  id: string;
  content: string;
  sender_type: 'user' | 'twin';
  created_at: string;
}

interface Conversation {
  id: string;
  title: string | null;
}

interface SuggestedQuestion {
  id: string;
  question: string;
}

const TwinChat = () => {
  const { twinId } = useParams<{ twinId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Fetch digital twin details
  const { data: twin, isLoading: twinLoading } = useQuery({
    queryKey: ['digital-twin', twinId],
    queryFn: async () => {
      if (!twinId) return null;
      const { data, error } = await supabase
        .from('digital_twins')
        .select('*')
        .eq('id', twinId)
        .single();

      if (error) throw error;
      return data as DigitalTwin;
    },
    enabled: !!twinId && !!user,
  });

  // Get or create conversation
  useEffect(() => {
    const fetchOrCreateConversation = async () => {
      if (!twinId || !user) return;

      // Try to find an existing conversation
      const { data: existingConversations, error: fetchError } = await supabase
        .from('conversations')
        .select('id, title')
        .eq('twin_id', twinId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Error fetching conversation:', fetchError);
        return;
      }

      // If found, use the existing conversation
      if (existingConversations && existingConversations.length > 0) {
        setConversationId(existingConversations[0].id);
        return;
      }

      // Otherwise, create a new conversation
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert([
          {
            twin_id: twinId,
            user_id: user.id,
            title: `Conversation with ${twin?.name || 'Twin'}`,
          }
        ])
        .select()
        .single();

      if (createError) {
        console.error('Error creating conversation:', createError);
        return;
      }

      if (newConversation) {
        setConversationId(newConversation.id);
      }
    };

    fetchOrCreateConversation();
  }, [twinId, user, twin?.name]);

  // Fetch messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!conversationId,
  });

  // Fetch suggested questions
  const { data: suggestedQuestions = [], refetch: refetchSuggestions } = useQuery({
    queryKey: ['suggested-questions', twinId],
    queryFn: async () => {
      if (!twinId) return [];
      const { data, error } = await supabase
        .from('suggested_questions')
        .select('*')
        .eq('twin_id', twinId)
        .limit(3);

      if (error) throw error;
      return data as SuggestedQuestion[];
    },
    enabled: !!twinId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId || !user) throw new Error('Missing conversation or user');

      // Insert user message
      const { data: userMessage, error: userMessageError } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            content,
            sender_type: 'user',
          }
        ])
        .select()
        .single();

      if (userMessageError) throw userMessageError;

      // Insert AI response with a slight delay to simulate thinking
      // In a real app, this would call an AI service
      const twinResponse = generateMockResponse(content, twin?.name || 'Twin');
      
      const { data: twinMessage, error: twinMessageError } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            content: twinResponse,
            sender_type: 'twin',
          }
        ])
        .select()
        .single();

      if (twinMessageError) throw twinMessageError;

      return [userMessage, twinMessage];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      setMessage('');
    },
  });

  // Helper function to generate mock responses (would be replaced by real AI in production)
  const generateMockResponse = (userMessage: string, twinName: string): string => {
    const responses = [
      `As ${twinName}, I'd say that's an interesting question. Let me think about it...`,
      `I understand your query about "${userMessage.substring(0, 20)}...". Here's what I can tell you...`,
      `Based on my knowledge, I can provide some insights on this topic.`,
      `That's a great question! As a digital twin, I'm designed to help with exactly these kinds of inquiries.`,
      `I'm processing your question about "${userMessage.substring(0, 20)}...". Here's what I've found...`,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    sendMessageMutation.mutate(message);
  };

  // Use suggested question
  const handleSuggestedQuestion = (question: string) => {
    setMessage(question);
    sendMessageMutation.mutate(question);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Loading state
  if (twinLoading) {
    return (
      <Layout>
        <div className="container py-4">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Skeleton className="h-10 w-48" />
          </div>
          <div className="border rounded-lg p-4 min-h-[calc(100vh-200px)]">
            <div className="flex flex-col space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start">
                  <Skeleton className="h-8 w-8 rounded-full mr-2" />
                  <Skeleton className="h-20 w-3/4 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!twin) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Digital Twin Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The digital twin you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Header */}
        <header className="border-b sticky top-0 bg-background z-10">
          <div className="container flex items-center justify-between py-3">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3 overflow-hidden">
                  {twin.image_url ? (
                    <img src={twin.image_url} alt={twin.name} className="h-full w-full object-cover" />
                  ) : (
                    <Bot className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h1 className="font-semibold text-lg">{twin.name}</h1>
                  {twin.status && (
                    <Badge variant={twin.status === 'active' ? "default" : "secondary"} className="text-xs">
                      {twin.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Chat content */}
        <div className="flex-1 overflow-auto">
          <div className="container py-4">
            {/* Messages */}
            <div className="flex flex-col space-y-4 mb-4">
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="text-center my-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{`Chat with ${twin.name}`}</h2>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    {twin.description || `Start a conversation with ${twin.name}.`}
                  </p>
                </div>
              )}

              {/* Actual messages */}
              {messagesLoading ? (
                <div className="flex flex-col space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-start">
                      <Skeleton className="h-8 w-8 rounded-full mr-2" />
                      <Skeleton className="h-16 w-3/4 rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`flex items-start max-w-[80%] ${
                        msg.sender_type === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div 
                        className={`h-8 w-8 rounded-full flex items-center justify-center mx-2 ${
                          msg.sender_type === 'user' ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        {msg.sender_type === 'user' ? (
                          <User className="h-4 w-4 text-primary-foreground" />
                        ) : twin.image_url ? (
                          <img src={twin.image_url} alt={twin.name} className="h-full w-full object-cover rounded-full" />
                        ) : (
                          <Bot className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div>
                        <div 
                          className={`rounded-lg p-3 ${
                            msg.sender_type === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                        >
                          <p>{msg.content}</p>
                        </div>
                        <div 
                          className={`text-xs text-muted-foreground mt-1 ${
                            msg.sender_type === 'user' ? 'text-right' : 'text-left'
                          }`}
                        >
                          {format(new Date(msg.created_at), 'h:mm a')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {/* For auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions */}
            {showSuggestions && suggestedQuestions.length > 0 && (
              <div className="bg-background border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <Sparkles className="h-4 w-4 text-primary mr-2" />
                    <h3 className="font-medium">Suggested Questions</h3>
                  </div>
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => refetchSuggestions()}
                      className="h-7 w-7"
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowSuggestions(false)}
                      className="h-7 w-7"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {suggestedQuestions.map((sq) => (
                    <Button 
                      key={sq.id} 
                      variant="outline" 
                      className="justify-start h-auto py-2 px-3 text-left"
                      onClick={() => handleSuggestedQuestion(sq.question)}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-primary mr-2 flex-shrink-0" />
                      <span className="truncate">{sq.question}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Collapsed suggestions toggle */}
            {!showSuggestions && (
              <Button 
                variant="outline" 
                className="w-full mb-4 flex items-center justify-center"
                onClick={() => setShowSuggestions(true)}
              >
                <Sparkles className="h-4 w-4 text-primary mr-2" />
                <span>Show Suggested Questions</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className="border-t bg-background">
          <div className="container py-3">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="flex-shrink-0"
              >
                <Mic className="h-5 w-5 text-muted-foreground" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="pr-10"
                />
              </div>
              
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon"
                disabled={!message.trim() || sendMessageMutation.isPending}
                className="flex-shrink-0"
              >
                <Send className="h-5 w-5 text-primary" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TwinChat;
