
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Secret {
  key: string;
  value: string;
}

interface SecretsSectionProps {
  onSecretsChange?: (secrets: Record<string, string>) => void;
}

const SecretsSection: React.FC<SecretsSectionProps> = ({ onSecretsChange }) => {
  const { user } = useAuth();
  
  // Initial state includes common required secrets
  const [secrets, setSecrets] = useState<Secret[]>([
    { key: "WEB_SEARCH_API_KEY", value: "" },
    { key: "TWITTER_PASSWORD", value: "" },
    { key: "TWITTER_EMAIL", value: "" },
    { key: "TWITTER_2FA_SECRET", value: "" },
    { key: "POST_IMMEDIATELY", value: "true" },
    { key: "ENABLE_ACTION_PROCESSING", value: "true" },
    { key: "MAX_ACTIONS_PROCESSING", value: "10" },
    { key: "POST_INTERVAL_MAX", value: "180" },
    { key: "POST_INTERVAL_MIN", value: "90" },
    { key: "TWITTER_SPACES_ENABLE", value: "false" },
    { key: "ACTION_TIMELINE_TYPE", value: "foryou" },
    { key: "TWITTER_POLL_INTERVAL", value: "120" }
  ]);

  const [newSecretKey, setNewSecretKey] = useState("");
  const [voiceModel, setVoiceModel] = useState("en_US-male-medium");

  const handleValueChange = (index: number, value: string) => {
    const updatedSecrets = [...secrets];
    updatedSecrets[index].value = value;
    setSecrets(updatedSecrets);
    
    // Convert secrets array to record/object for easier consumption by parent
    const secretsObject = updatedSecrets.reduce((acc, secret) => {
      acc[secret.key] = secret.value;
      return acc;
    }, {} as Record<string, string>);
    
    onSecretsChange?.(secretsObject);
  };

  const addSecret = () => {
    if (newSecretKey.trim()) {
      setSecrets([...secrets, { key: newSecretKey.trim(), value: "" }]);
      setNewSecretKey("");
    }
  };

  const removeSecret = (index: number) => {
    // Skip removing core secrets (indexes 0-10)
    if (index < 0) return;
    
    const updatedSecrets = [...secrets];
    updatedSecrets.splice(index, 1);
    setSecrets(updatedSecrets);
    
    // Update parent component if needed
    const secretsObject = updatedSecrets.reduce((acc, secret) => {
      acc[secret.key] = secret.value;
      return acc;
    }, {} as Record<string, string>);
    
    onSecretsChange?.(secretsObject);
  };

  // Function to save secrets to Supabase when the form is submitted
  const saveSecretsToSupabase = async (twinId: string) => {
    if (!user) return false;
    
    try {
      // Convert secrets array to a proper object format for storage
      const secretsObject = secrets.reduce((acc, secret) => {
        if (secret.value) { // Only store non-empty secrets
          acc[secret.key] = secret.value;
        }
        return acc;
      }, {} as Record<string, string>);
      
      // Add voice model if set
      if (voiceModel) {
        secretsObject.VOICE_MODEL = voiceModel;
      }
      
      const { error } = await supabase
        .from('agent_secrets')
        .insert([{
          twin_id: twinId,
          owner_id: user.id,
          secrets: secretsObject
        }]);
        
      if (error) {
        console.error("Error saving secrets:", error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Exception saving secrets:", err);
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Add secrets</h2>
        <p className="text-muted-foreground mb-6">
          These are required to connect with your model, clients and plugins.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {secrets.map((secret, index) => (
            <React.Fragment key={index}>
              <div className="bg-black/20 p-3 rounded-md flex items-center">
                <span className="text-blue-300 font-medium">{secret.key}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ml-1 cursor-help">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Required for {secret.key.replace(/_/g, " ").toLowerCase()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {index > 11 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="ml-auto h-8 w-8 p-0" 
                    onClick={() => removeSecret(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Input 
                className="bg-black/20 p-3 rounded-md"
                placeholder={`Enter value...`}
                value={secret.value}
                onChange={(e) => handleValueChange(index, e.target.value)}
                type={secret.key.includes("PASSWORD") || secret.key.includes("SECRET") || secret.key.includes("API_KEY") ? "password" : "text"}
              />
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Additional secrets</h3>
        <p className="text-muted-foreground mb-4">
          In case you need to add secrets that are not listed above.
        </p>
        
        <div className="flex gap-2">
          <Input 
            placeholder="Add secret key..." 
            value={newSecretKey} 
            onChange={(e) => setNewSecretKey(e.target.value)}
          />
          <Button onClick={addSecret} disabled={!newSecretKey.trim()}>
            <Plus className="h-4 w-4 mr-1" /> Add secret
          </Button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-xl font-semibold mb-2">
          Voice model <span className="text-muted-foreground font-normal text-sm">Optional</span>
        </h3>
        <Input 
          className="bg-black/20 p-3 rounded-md"
          placeholder="Enter voice model identifier..." 
          value={voiceModel}
          onChange={(e) => setVoiceModel(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SecretsSection;
