
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Copy } from "lucide-react";

interface CopyToClipboardProps {
  side?: React.ComponentProps<typeof TooltipContent>["side"];
  text: string;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  side = "top",
  text,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <TooltipProvider>
      <Tooltip open={copied ? true : undefined}>
        <TooltipTrigger asChild>
          <Button
            onClick={handleCopy}
            size="sm"
            variant="ghost"
            className="relative m-0 gap-2"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className="sr-only">Copy to clipboard</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className="bg-popover text-popover-foreground"
          align="center"
          side={side}
        >
          <span>{copied ? "Copied!" : "Copy"}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyToClipboard;
