import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  FileImage, 
  Loader2, 
  Plus, 
  Tag, 
  Trash2, 
  UploadCloud 
} from 'lucide-react';

type Step = 'details' | 'personality' | 'knowledge' | 'confirmation';

const CreateTwin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [twinName, setTwinName] = useState('');
  const [twinDescription, setTwinDescription] = useState('');
  const [twinImage, setTwinImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [bio, setBio] = useState('');
  const [lore, setLore] = useState('');
  const [knowledge, setKnowledge] = useState('');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [creativity, setCreativity] = useState<number>(0.5);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setTwinImage(file);
    setPreviewImage(URL.createObjectURL(file));
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: 1,
  });

  // Mutation to create the digital twin
  const createTwinMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // 1. Upload image if it exists
      let imageUrl = null;
      if (twinImage) {
        const imagePath = `avatars/${user.id}/${Date.now()}-${twinImage.name}`;
        const { error: uploadError } = await supabase.storage
          .from('twin-avatars')
          .upload(imagePath, twinImage, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          throw new Error('Failed to upload image');
        }

        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/twin-avatars/${imagePath}`;
      }

      // 2. Create the digital twin record
      const { data, error } = await supabase
        .from('digital_twins')
        .insert([
          {
            owner_id: user.id,
            name: twinName,
            description: twinDescription,
            image_url: imageUrl,
            tags: tags,
            bio: bio,
            lore: lore,
            knowledge: knowledge,
            temperature: temperature,
            creativity: creativity,
            is_public: isPublic,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Twin creation error:', error);
        throw new Error('Failed to create digital twin');
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Twin created",
        description: "Your digital twin has been successfully created.",
      });
      navigate(`/twin/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create twin",
        variant: "destructive"
      });
    },
  });

  // Handlers for each step
  const handleNext = () => {
    switch (currentStep) {
      case 'details':
        if (!twinName.trim() || !twinDescription.trim()) {
          toast({
            title: "Error",
            description: "Please fill in all required fields.",
            variant: "destructive"
          });
          return;
        }
        setCurrentStep('personality');
        break;
      case 'personality':
        setCurrentStep('knowledge');
        break;
      case 'knowledge':
        setCurrentStep('confirmation');
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'personality':
        setCurrentStep('details');
        break;
      case 'knowledge':
        setCurrentStep('personality');
        break;
      case 'confirmation':
        setCurrentStep('knowledge');
        break;
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    createTwinMutation.mutate();
  };

  // UI rendering for each step
  const renderDetailsStep = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Tell us a bit about your digital twin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="twinName">Name</Label>
            <Input
              type="text"
              id="twinName"
              value={twinName}
              onChange={(e) => setTwinName(e.target.value)}
              placeholder="Enter twin name"
            />
          </div>
          <div>
            <Label htmlFor="twinDescription">Description</Label>
            <Textarea
              id="twinDescription"
              value={twinDescription}
              onChange={(e) => setTwinDescription(e.target.value)}
              placeholder="Enter twin description"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>Upload an image for your digital twin.</CardDescription>
        </CardHeader>
        <CardContent>
          <div {...getRootProps()} className="relative border-dashed border-2 border-muted-foreground/50 rounded-md p-4 cursor-pointer hover:border-primary transition-colors">
            <input {...getInputProps()} />
            {previewImage ? (
              <div className="relative w-full h-48 overflow-hidden rounded-md">
                <img src={previewImage} alt="Twin Avatar" className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <UploadCloud className="h-6 w-6 mb-2" />
                {isDragActive ? (
                  <p>Drop the image here...</p>
                ) : (
                  <p>Click or drag an image to upload</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>Add tags to categorize your digital twin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <Button type="button" onClick={addTag} size="sm">
              Add Tag
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
                <Button type="button" variant="ghost" size="icon" className="hover:bg-secondary/20 -mr-1" onClick={() => removeTag(tag)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPersonalityStep = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Personality</CardTitle>
          <CardDescription>Define the personality of your digital twin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Enter twin bio"
            />
          </div>
          <div>
            <Label htmlFor="lore">Lore</Label>
            <Textarea
              id="lore"
              value={lore}
              onChange={(e) => setLore(e.target.value)}
              placeholder="Enter twin lore"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Creativity Settings</CardTitle>
          <CardDescription>Adjust the creativity and temperature of your digital twin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="temperature">Temperature</Label>
            <Slider
              id="temperature"
              defaultValue={[temperature * 100]}
              max={100}
              step={1}
              onValueChange={(value) => setTemperature(value[0] / 100)}
            />
            <p className="text-sm text-muted-foreground">
              Temperature: {temperature.toFixed(2)}
            </p>
          </div>
          <div>
            <Label htmlFor="creativity">Creativity</Label>
            <Slider
              id="creativity"
              defaultValue={[creativity * 100]}
              max={100}
              step={1}
              onValueChange={(value) => setCreativity(value[0] / 100)}
            />
            <p className="text-sm text-muted-foreground">
              Creativity: {creativity.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderKnowledgeStep = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base</CardTitle>
          <CardDescription>Add knowledge to your digital twin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="knowledge">Knowledge</Label>
            <Textarea
              id="knowledge"
              value={knowledge}
              onChange={(e) => setKnowledge(e.target.value)}
              placeholder="Enter twin knowledge"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control the visibility of your digital twin.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="isPublic">Make Public</Label>
            <Switch
              id="isPublic"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Confirmation</CardTitle>
          <CardDescription>Review your digital twin details before submitting.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
            <p>{twinName}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
            <p>{twinDescription}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Avatar</h4>
            {previewImage ? (
              <div className="relative w-32 h-32 overflow-hidden rounded-md">
                <img src={previewImage} alt="Twin Avatar" className="object-cover w-full h-full" />
              </div>
            ) : (
              <p className="text-muted-foreground">No image uploaded</p>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Bio</h4>
            <p>{bio}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Lore</h4>
            <p>{lore}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Knowledge</h4>
            <p>{knowledge}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Temperature</h4>
            <p>{temperature.toFixed(2)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Creativity</h4>
            <p>{creativity.toFixed(2)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Privacy</h4>
            <p>{isPublic ? 'Public' : 'Private'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-2">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create New Digital Twin</h1>
          <p className="text-muted-foreground">
            Fill out the form below to create a new digital twin.
          </p>
        </div>

        {/* Add a conditional check to ensure currentStep is properly compared */}
        {currentStep !== "confirmation" ? (
          <div className="grid gap-6 md:grid-cols-[1fr_300px]">
            <div>
              {currentStep === 'details' && renderDetailsStep()}
              {currentStep === 'personality' && renderPersonalityStep()}
              {currentStep === 'knowledge' && renderKnowledgeStep()}
            </div>
            <div className="hidden md:block">
              <Card>
                <CardHeader>
                  <CardTitle>Step {currentStep === 'details' ? '1' : currentStep === 'personality' ? '2' : '3'} of 3</CardTitle>
                  <CardDescription>
                    {currentStep === 'details' ? 'Basic Information' : currentStep === 'personality' ? 'Personality' : 'Knowledge'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={currentStep === 'details' ? 33 : currentStep === 'personality' ? 66 : 100} />
                  <div className="mt-4 space-y-2">
                    <Button variant="outline" disabled={currentStep === 'details'} onClick={handleBack} className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={handleNext} className="w-full">
                      {currentStep === 'knowledge' ? 'Review' : 'Next'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-[1fr_300px]">
            <div>
              {renderConfirmationStep()}
            </div>
            <div className="hidden md:block">
              <Card>
                <CardHeader>
                  <CardTitle>Confirmation</CardTitle>
                  <CardDescription>Review and submit your digital twin.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" onClick={handleBack} className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={createTwinMutation.isLoading} className="w-full">
                    {createTwinMutation.isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Create Twin
                        <CheckCircle className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Mobile navigation */}
        <div className="md:hidden mt-8 flex justify-between">
          <Button variant="outline" disabled={currentStep === 'details'} onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {currentStep === 'confirmation' ? (
            <Button onClick={handleSubmit} disabled={createTwinMutation.isLoading}>
              {createTwinMutation.isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Create Twin
                  <CheckCircle className="ml-2 h-4 w-4" />
                </div>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentStep === 'knowledge' ? 'Review' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreateTwin;
