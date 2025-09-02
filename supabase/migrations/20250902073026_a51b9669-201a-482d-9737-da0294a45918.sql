-- Add public read policy for published and active motivators
CREATE POLICY "Anyone can view published motivators" 
ON public.motivators 
FOR SELECT 
USING (is_published = true AND is_active = true);