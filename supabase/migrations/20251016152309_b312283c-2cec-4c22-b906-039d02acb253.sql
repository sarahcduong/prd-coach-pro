-- Create prds table for storing user PRD documents
CREATE TABLE public.prds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  product_idea TEXT NOT NULL,
  persona TEXT,
  company TEXT,
  job_description TEXT,
  sections JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prds ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own PRDs" 
ON public.prds 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own PRDs" 
ON public.prds 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own PRDs" 
ON public.prds 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own PRDs" 
ON public.prds 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_prds_updated_at
BEFORE UPDATE ON public.prds
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();