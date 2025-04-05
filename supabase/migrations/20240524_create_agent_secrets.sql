
-- Create a table to store agent secrets
CREATE TABLE IF NOT EXISTS public.agent_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  twin_id UUID NOT NULL REFERENCES public.digital_twins(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  secrets JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agent_secrets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own agent secrets
CREATE POLICY "Users can view their own agent secrets"
ON public.agent_secrets
FOR SELECT
USING (auth.uid() = owner_id);

-- Create policy to allow users to insert their own agent secrets
CREATE POLICY "Users can insert their own agent secrets"
ON public.agent_secrets
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Create policy to allow users to update their own agent secrets
CREATE POLICY "Users can update their own agent secrets"
ON public.agent_secrets
FOR UPDATE
USING (auth.uid() = owner_id);

-- Create policy to allow users to delete their own agent secrets
CREATE POLICY "Users can delete their own agent secrets"
ON public.agent_secrets
FOR DELETE
USING (auth.uid() = owner_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS agent_secrets_twin_id_idx ON public.agent_secrets(twin_id);
CREATE INDEX IF NOT EXISTS agent_secrets_owner_id_idx ON public.agent_secrets(owner_id);
