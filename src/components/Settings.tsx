
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SettingsProps {
  onClose: () => void;
}

const Settings = ({ onClose }: SettingsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Settings panel would contain configuration options for the chat interface.
        </p>
      </div>
    </div>
  );
};

export default Settings;
