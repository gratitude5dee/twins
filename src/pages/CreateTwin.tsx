import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Layout from '@/components/Layout';
import TwinImageUpload from '@/components/TwinImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Category } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Bot, Settings, ImagePlus, ChevronsUpDown, Plus, X } from 'lucide-react';

// Supabase URL for edge function calls
const supabaseUrl = 'https://juvfuvamiszfyinyxlxw.supabase.co';

const twinFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  modelProvider: z.string().default("OpenAI"),
  clients: z.array(z.string()).default([]),
  plugins: z.array(z.string()).default([]),
  bio: z.string().optional(),
  tags: z.string().optional(),
  categories: z.array(z.string()).default([]),
});

type TwinFormValues = z.infer<typeof twinFormSchema>;

const modelProviders = [
  { value: "OpenAI", label: "OpenAI" },
  { value: "Anthropic", label: "Anthropic" },
  { value: "Google", label: "Google" },
  { value: "Meta", label: "Meta" },
  { value: "Mistral", label: "Mistral" },
];

const clientTypes = [
  { value: "discord", label: "Discord" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "slack", label: "Slack" },
  { value: "telegram", label: "Telegram" },
  { value: "web", label: "Web Interface" },
];

const pluginOptions = [
  { value: "web-search", label: "Web Search" },
  { value: "code-generation", label: "Code Generation" },
  { value: "image-generation", label: "Image Generation" },
  { value: "data-analysis", label: "Data Analysis" },
  { value: "document-qa", label: "Document Q&A" },
];

const CreateTwin = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imagePath, setImagePath] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [bioStatements, setBioStatements] = useState<string[]>([]);
  const [newBioStatement, setNewBioStatement] = useState('');
  const [loreItems, setLoreItems] = useState<string[]>([]);
  const [newLoreItem, setNewLoreItem] = useState('');
  const [knowledgeItems, setKnowledgeItems] = useState<string[]>([]);
  const [newKnowledgeItem, setNewKnowledgeItem] = useState('');
  const [activeTab, setActiveTab] = useState("form");

  const form = useForm<TwinFormValues>({
    resolver: zodResolver(twinFormSchema),
    defaultValues: {
      name: "",
      description: "",
      modelProvider: "OpenAI",
      clients: [],
      plugins: [],
      bio: "",
      tags: "",
      categories: [],
    },
  });

  // Fetch available categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        // Use a direct table query for categories
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, description');
          
        if (error) {
          console.error('Error fetching categories:', error);
          toast({
            title: "Error",
            description: "Failed to load categories",
            variant: "destructive",
          });
        } else if (data) {
          setCategories(data as Category[]);
        }
      } catch (err) {
        console.error('Exception fetching categories:', err);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const handleImageUploaded = (url: string, path: string) => {
    setImageUrl(url);
    setImagePath(path);
  };

  const handleAddBioStatement = () => {
    if (newBioStatement.trim()) {
      setBioStatements([...bioStatements, newBioStatement.trim()]);
      setNewBioStatement('');
    }
  };

  const handleRemoveBioStatement = (index: number) => {
    setBioStatements(bioStatements.filter((_, i) => i !== index));
  };

  const handleAddLoreItem = () => {
    if (newLoreItem.trim()) {
      setLoreItems([...loreItems, newLoreItem.trim()]);
      setNewLoreItem('');
    }
  };

  const handleRemoveLoreItem = (index: number) => {
    setLoreItems(loreItems.filter((_, i) => i !== index));
  };

  const handleAddKnowledgeItem = () => {
    if (newKnowledgeItem.trim()) {
      setKnowledgeItems([...knowledgeItems, newKnowledgeItem.trim()]);
      setNewKnowledgeItem('');
    }
  };

  const handleRemoveKnowledgeItem = (index: number) => {
    setKnowledgeItems(knowledgeItems.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: TwinFormValues) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to create a twin.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // Parse tags from comma-separated string
      const tagsArray = values.tags 
        ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      // Create a combined bio from all statements
      const combinedBio = bioStatements.join('\n\n');

      // Prepare additional model data
      const modelData = {
        lore: loreItems,
        knowledge: knowledgeItems,
        modelProvider: values.modelProvider,
        clients: values.clients,
        plugins: values.plugins
      };

      // Create the twin in the database
      const { data: twin, error } = await supabase
        .from('digital_twins')
        .insert([
          {
            name: values.name,
            description: values.description || '',
            image_url: imageUrl,
            owner_id: user.id,
            tags: tagsArray,
            status: 'active',
            processing_status: imageUrl ? 'pending' : 'not_applicable',
            features: {
              bio: combinedBio,
              clients: values.clients,
              plugins: values.plugins
            },
            model_data: modelData
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Insert category associations if categories were selected
      if (values.categories.length > 0) {
        const categoryAssociations = values.categories.map(categoryId => ({
          twin_id: twin.id,
          category_id: categoryId
        }));
        
        const { error: categoryError } = await supabase
          .from('twin_categories')
          .insert(categoryAssociations);

        if (categoryError) {
          console.error('Error associating categories:', categoryError);
        }
      }

      toast({
        title: "Twin created!",
        description: "Your digital twin has been created successfully.",
      });

      // If there's an image, start processing
      if (imageUrl && session?.access_token) {
        try {
          // Call the edge function to start processing
          const response = await fetch(
            `${supabaseUrl}/functions/v1/process-twin-image`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
              },
              body: JSON.stringify({ twinId: twin.id })
            }
          );

          const processingResult = await response.json();
          
          if (!response.ok) {
            console.warn('Image processing request failed:', processingResult);
            toast({
              title: "Processing Warning",
              description: "Twin created, but image processing couldn't be started.",
              variant: "destructive",
            });
          }
        } catch (processingError) {
          console.error('Error starting image processing:', processingError);
          // Don't fail the entire twin creation if processing fails
          toast({
            title: "Processing Warning",
            description: "Twin created, but image processing couldn't be started.",
            variant: "destructive",
          });
        }
      }

      // Navigate to the twin details page
      navigate(`/twin/${twin.id}`);
    } catch (error: any) {
      console.error('Error creating twin:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while creating your twin.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Templates for quick setup
  const templates = [
    { id: "eliza", name: "Eliza", description: "Classic therapeutic chatbot" },
    { id: "trump", name: "Trump", description: "Former US President" },
    { id: "c3po", name: "C-3PO", description: "Protocol droid from Star Wars" },
    { id: "bd", name: "BD", description: "Business development assistant" },
    { id: "dobby", name: "Dobby", description: "House elf from Harry Potter" },
    { id: "social", name: "Social", description: "Social media manager" },
    { id: "support", name: "Support", description: "Customer support agent" },
    { id: "web3", name: "Web3", description: "Blockchain and crypto expert" },
  ];

  const applyTemplate = (templateId: string) => {
    switch(templateId) {
      case "trump":
        form.setValue("name", "Trump");
        form.setValue("description", "45th President of the United States");
        form.setValue("modelProvider", "OpenAI");
        form.setValue("clients", ["twitter"]);
        setBioStatements([
          "secured the Southern Border COMPLETELY (until they DESTROYED it)",
          "protected WOMEN'S SPORTS (while Democrats let MEN compete)",
          "ended INFLATION and made America AFFORDABLE (until Kamala ruined it)"
        ]);
        setLoreItems([
          "Democrats using Secret Service assignments as election interference",
          "they let Minneapolis burn in 2020 (then begged for help)",
          "saved America from China Virus (while they did nothing)"
        ]);
        setKnowledgeItems([
          "knows EXACT cost to families under Kamala ($29,000)",
          "understands REAL border numbers (worse than reported)",
          "saw what really happened in Minneapolis 2020"
        ]);
        break;
      // Other templates would go here
      default:
        // Do nothing for unknown templates
        break;
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col space-y-4 mb-8">
          <div className="flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bot className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-center">Create AI Agent</h1>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
            Configure and deploy your creative AI agent
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="form" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Detailed Form</span>
              </TabsTrigger>
              <TabsTrigger value="wizard" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span>Step-by-Step Wizard</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Left sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => document.getElementById('section-name')?.scrollIntoView({ behavior: 'smooth' })}>
                    Name
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => document.getElementById('section-avatar')?.scrollIntoView({ behavior: 'smooth' })}>
                    Avatar
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => document.getElementById('section-model')?.scrollIntoView({ behavior: 'smooth' })}>
                    Model provider
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => document.getElementById('section-clients')?.scrollIntoView({ behavior: 'smooth' })}>
                    Clients
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => document.getElementById('section-plugins')?.scrollIntoView({ behavior: 'smooth' })}>
                    Plugins
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => document.getElementById('section-bio')?.scrollIntoView({ behavior: 'smooth' })}>
                    Bio
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => document.getElementById('section-lore')?.scrollIntoView({ behavior: 'smooth' })}>
                    Lore
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => document.getElementById('section-knowledge')?.scrollIntoView({ behavior: 'smooth' })}>
                    Knowledge
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Start with a template</h2>
                <p className="mb-6">
                  Using the inputs below, craft a unique and engaging personality for your AI agent. 
                  Check our <a href="#" className="text-primary underline">guide</a> for this step.
                </p>

                <div className="bg-muted/30 p-6 rounded-lg mb-10">
                  <h3 className="text-lg font-semibold mb-4">Templates</h3>
                  <p className="mb-4">Use one of the options below to prefill the fields.</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        className={`p-3 rounded-md hover:bg-secondary/80 transition-colors ${template.id === 'trump' ? 'bg-primary/20' : 'bg-secondary/50'}`}
                        onClick={() => applyTemplate(template.id)}
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Name section */}
                    <div id="section-name" className="border-t pt-6">
                      <h2 className="text-2xl font-bold mb-2">Name</h2>
                      <p className="text-muted-foreground mb-4">The character's display name for identification and in conversations</p>
                      
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Enter agent name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Avatar section */}
                    <div id="section-avatar" className="border-t pt-6">
                      <h2 className="text-2xl font-bold mb-2">Avatar</h2>
                      <p className="text-muted-foreground mb-4">Update your avatar effortlessly by simply clicking on it</p>
                      
                      <div className="flex items-center justify-center mb-4">
                        <Sheet>
                          <SheetTrigger asChild>
                            <div className="cursor-pointer relative inline-block">
                              <Avatar className="h-32 w-32">
                                {imageUrl ? (
                                  <AvatarImage src={imageUrl} alt="Avatar" />
                                ) : (
                                  <AvatarFallback className="flex flex-col items-center justify-center bg-secondary">
                                    <ImagePlus className="h-10 w-10 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground mt-1">Click to upload</span>
                                  </AvatarFallback>
                                )}
                              </Avatar>
                            </div>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Upload Avatar</SheetTitle>
                              <SheetDescription>
                                Upload an image to use as your digital twin's avatar.
                              </SheetDescription>
                            </SheetHeader>
                            <div className="py-6">
                              <TwinImageUpload onImageUploaded={handleImageUploaded} existingImageUrl={imageUrl} />
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>
                      <p className="text-center font-semibold mb-1">😎</p>
                      <p className="text-center text-sm text-muted-foreground">Click to upload or change</p>
                    </div>

                    {/* Model provider section */}
                    <div id="section-model" className="border-t pt-6">
                      <h2 className="text-2xl font-bold mb-2">Model provider</h2>
                      <p className="text-muted-foreground mb-4">The AI model provider, such as OpenAI or Anthropic</p>
                      
                      <FormField
                        control={form.control}
                        name="modelProvider"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a model provider" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {modelProviders.map(provider => (
                                  <SelectItem key={provider.value} value={provider.value}>
                                    {provider.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Clients section */}
                    <div id="section-clients" className="border-t pt-6">
                      <h2 className="text-2xl font-bold mb-2">Clients</h2>
                      <p className="text-muted-foreground mb-4">Supported client types, such as Discord or X</p>
                      
                      <FormField
                        control={form.control}
                        name="clients"
                        render={() => (
                          <FormItem>
                            <div className="space-y-4">
                              {clientTypes.map((client) => (
                                <FormField
                                  key={client.value}
                                  control={form.control}
                                  name="clients"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={client.value}
                                        className="flex flex-row items-center space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(client.value)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, client.value])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== client.value
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {client.label}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Plugins section */}
                    <div id="section-plugins" className="border-t pt-6">
                      <h2 className="text-2xl font-bold mb-2">Plugins <span className="text-muted-foreground font-normal text-sm">Optional</span></h2>
                      <p className="text-muted-foreground mb-4">Plugins extend your agent's core functionality with additional features</p>
                      
                      <FormField
                        control={form.control}
                        name="plugins"
                        render={() => (
                          <FormItem>
                            <div className="space-y-4">
                              <p className="text-sm font-medium">Select one or multiple plugins</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {pluginOptions.map((plugin) => (
                                  <FormField
                                    key={plugin.value}
                                    control={form.control}
                                    name="plugins"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={plugin.value}
                                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(plugin.value)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, plugin.value])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== plugin.value
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <div className="space-y-1 leading-none">
                                            <FormLabel className="font-medium">
                                              {plugin.label}
                                            </FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                              Enable {plugin.label.toLowerCase()} capabilities
                                            </p>
                                          </div>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Bio section */}
                    <div id="section-bio" className="border-t pt-6">
                      <h2 className="text-2xl font-bold mb-2">Bio</h2>
                      <p className="text-muted-foreground mb-4">Background information for your character. Includes biographical details about the character, either as one complete biography or several statements that vary.</p>
                      
                      <div className="space-y-3 mb-4">
                        {bioStatements.map((statement, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 rounded-md bg-muted/50 border">
                            <p className="flex-grow">{statement}</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleRemoveBioStatement(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Input 
                          value={newBioStatement} 
                          onChange={(e) => setNewBioStatement(e.target.value)}
                          placeholder="Add new bio statement..."
                          className="flex-grow"
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddBioStatement}
                          disabled={!newBioStatement.trim()}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                    </div>

                    {/* Lore section */}
                    <div id="section-lore" className="border-t pt-6">
                      <h2 className="text-2xl font-bold mb-2">Lore</h2>
                      <p className="text-muted-foreground mb-4">Backstory elements and unique character traits. These help define personality and can be randomly sampled in conversations.</p>
                      
                      <div className="space-y-3 mb-4">
                        {loreItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 rounded-md bg-muted/50 border">
                            <p className="flex-grow">{item}</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleRemoveLoreItem(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Input 
                          value={newLoreItem} 
                          onChange={(e) => setNewLoreItem(e.target.value)}
                          placeholder="Add new lore..."
                          className="flex-grow"
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddLoreItem}
                          disabled={!newLoreItem.trim()}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                    </div>

                    {/* Knowledge section */}
                    <div id="section-knowledge" className="border-t pt-6">
                      <h2 className="text-2xl font-bold mb-2">Knowledge</h2>
                      <p className="text-muted-foreground mb-4">Facts or references to ground the character's responses</p>
                      
                      <div className="space-y-3 mb-4">
                        {knowledgeItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 rounded-md bg-muted/50 border">
                            <p className="flex-grow">{item}</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleRemoveKnowledgeItem(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Input 
                          value={newKnowledgeItem} 
                          onChange={(e) => setNewKnowledgeItem(e.target.value)}
                          placeholder="Add new knowledge..."
                          className="flex-grow"
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddKnowledgeItem}
                          disabled={!newKnowledgeItem.trim()}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                    </div>

                    {/* Categories section */}
                    {categories.length > 0 && (
                      <div className="border-t pt-6">
                        <h2 className="text-xl font-bold mb-2">Categories</h2>
                        <p className="text-muted-foreground mb-4">Assign your agent to one or more categories</p>
                        
                        <FormField
                          control={form.control}
                          name="categories"
                          render={() => (
                            <FormItem>
                              <div className="grid grid-cols-2 gap-4">
                                {categories.map((category) => (
                                  <FormField
                                    key={category.id}
                                    control={form.control}
                                    name="categories"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={category.id}
                                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(category.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, category.id])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== category.id
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <div className="space-y-1 leading-none">
                                            <FormLabel className="font-normal">
                                              {category.name}
                                            </FormLabel>
                                            {category.description && (
                                              <FormDescription>
                                                {category.description}
                                              </FormDescription>
                                            )}
                                          </div>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-6 border-t">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => navigate('/dashboard')}
                        disabled={isCreating}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isCreating || isLoadingCategories} 
                        className="gradient-bg"
                      >
                        {isCreating ? "Creating..." : "Create AI Agent"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTwin;
