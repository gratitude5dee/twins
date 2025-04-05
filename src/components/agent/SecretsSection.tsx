
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface Secret {
  key: string;
  value: string;
}

const SecretsSection: React.FC = () => {
  // Initial state includes the Web Search API Key as a default item
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

  const handleValueChange = (index: number, value: string) => {
    const updatedSecrets = [...secrets];
    updatedSecrets[index].value = value;
    setSecrets(updatedSecrets);
  };

  const addSecret = () => {
    if (newSecretKey.trim()) {
      setSecrets([...secrets, { key: newSecretKey.trim(), value: "" }]);
      setNewSecretKey("");
    }
  };

  const removeSecret = (index: number) => {
    // Don't allow removing the first item (WEB_SEARCH_API_KEY)
    if (index === 0) return;
    
    const updatedSecrets = [...secrets];
    updatedSecrets.splice(index, 1);
    setSecrets(updatedSecrets);
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
                {index !== 0 && (
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
                placeholder={secret.key === "WEB_SEARCH_API_KEY" ? "Enter Web Search API Key..." : "Enter value..."}
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
          defaultValue="en_US-male-medium"
        />
      </div>
    </div>
  );
};

export default SecretsSection;
