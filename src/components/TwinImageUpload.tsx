
import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface TwinImageUploadProps {
  onImageUploaded: (url: string, path: string) => void;
  existingImageUrl?: string;
}

const TwinImageUpload: React.FC<TwinImageUploadProps> = ({
  onImageUploaded,
  existingImageUrl,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(existingImageUrl || null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }
    
    // Size validation (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setUploading(true);
      
      // Create a preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${uuidv4()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('twin_images')
        .upload(filePath, file);
      
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('twin_images')
        .getPublicUrl(data.path);
      
      onImageUploaded(publicUrl, data.path);
      
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded.",
      });
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading your image.",
        variant: "destructive",
      });
      // Clear preview on error
      if (preview && !existingImageUrl) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      } else if (existingImageUrl) {
        setPreview(existingImageUrl);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    if (preview && !existingImageUrl) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onImageUploaded('', '');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Twin Image</p>
        {preview && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={handleRemoveImage}
            disabled={uploading}
          >
            <X size={16} className="mr-1" /> Remove
          </Button>
        )}
      </div>
      
      {preview ? (
        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center h-64 border-dashed cursor-pointer hover:bg-secondary/30 transition-colors">
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer" htmlFor="twin-image-upload">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 text-muted-foreground mb-2" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG or WEBP (MAX. 10MB)
              </p>
            </div>
            <input
              id="twin-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </Card>
      )}
      
      {uploading && (
        <div className="w-full bg-secondary rounded-full h-2.5 mt-2">
          <div className="bg-primary h-2.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      )}
    </div>
  );
};

export default TwinImageUpload;
