
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { Message } from "@/lib/messages";
import { normalizeMessageText, extractMessageImages } from "@/lib/messages";
import Markdown from "markdown-to-jsx";
import ErrorBoundary from "@/components/ErrorBoundary";
import CodeBlock from "@/components/CodeBlock";

interface ChatMessageProps {
  message: Message;
  isSpeaking?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isSpeaking = false }) => {
  const isUser = message.content.role === "user";
  const messageText = normalizeMessageText(message);
  const images = extractMessageImages(message);

  return (
    <div
      className={`flex items-start space-x-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-muted">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={`flex flex-col gap-3 max-w-[80%] ${
          isSpeaking ? "animate-pulse" : ""
        }`}
      >
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {images.map((imageUrl, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        )}
        
        <div 
          className={`rounded-lg px-4 py-2 ${
            isUser 
              ? "bg-primary text-primary-foreground ml-auto" 
              : "bg-muted"
          }`}
        >
          <ErrorBoundary fallback={<p>{messageText}</p>}>
            <Markdown
              options={{
                overrides: {
                  pre: {
                    component: ({ children, className, ...props }) => {
                      const codeBlock = React.Children.toArray(children).find(
                        (child) =>
                          React.isValidElement(child) && child.type === "code"
                      );
                      
                      if (React.isValidElement(codeBlock)) {
                        const { className: codeClassName, children: codeChildren } = codeBlock.props;
                        const language = codeClassName
                          ? codeClassName.replace("language-", "")
                          : undefined;
                        
                        return (
                          <CodeBlock language={language}>
                            {String(codeChildren)}
                          </CodeBlock>
                        );
                      }
                      
                      return <pre className={className} {...props}>{children}</pre>;
                    },
                  },
                  code: {
                    component: ({ children, className }) => {
                      // This is for inline code
                      if (!className) {
                        return (
                          <code className="px-1 py-0.5 bg-muted rounded text-sm">
                            {children}
                          </code>
                        );
                      }
                      // Block code is handled by the pre override
                      return <code className={className}>{children}</code>;
                    },
                  },
                },
              }}
            >
              {messageText}
            </Markdown>
          </ErrorBoundary>
        </div>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary">
            <User className="h-4 w-4 text-primary-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
