-- Create storage bucket for background images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('background-images', 'background-images', true);

-- Create RLS policies for background images bucket
CREATE POLICY "Public can view background images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'background-images');

CREATE POLICY "Authenticated users can upload background images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'background-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update background images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'background-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete background images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'background-images' AND auth.uid() IS NOT NULL);

-- Create table for background image settings
CREATE TABLE public.background_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on background_images table
ALTER TABLE public.background_images ENABLE ROW LEVEL SECURITY;

-- Create policies for background_images table
CREATE POLICY "Anyone can view background images" 
ON public.background_images 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage background images" 
ON public.background_images 
FOR ALL 
USING (auth.uid() IS NOT NULL);