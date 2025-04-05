
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useAppState } from "@/hooks/useAppState";
import emitter from "@/lib/eventEmitter";

export default function DeleteConversationModal() {
  const [conversationToDeleteId, setConversationToDeleteId] = useState("");
  const { conversationId, setConversationId } = useAppState();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleDeleteConversation = (cid: string) => {
      setConversationToDeleteId(cid);
    };
    
    emitter.on("deleteConversation", handleDeleteConversation);
    
    return () => {
      emitter.off("deleteConversation", handleDeleteConversation);
    };
  }, []);

  const handleClickDelete = async () => {
    setIsDeleting(true);
    
    try {
      // In a real implementation, you would call your API to delete the conversation
      console.log(`Deleting conversation: ${conversationToDeleteId}`);
      
      // If we're deleting the current conversation, reset the current conversation
      if (conversationToDeleteId === conversationId) {
        setConversationId("");
      }
      
      toast({
        title: `Conversation deleted!`,
      });
      
      setConversationToDeleteId("");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast({
        variant: "destructive",
        title: "Error deleting conversation",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) setConversationToDeleteId("");
  };

  return (
    <Dialog open={Boolean(conversationToDeleteId)} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete conversation</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Do you really want to delete this conversation?
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={isDeleting} variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="gap-2"
            disabled={isDeleting}
            onClick={handleClickDelete}
            variant="destructive"
          >
            {isDeleting && <span className="animate-spin">⟳</span>}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
