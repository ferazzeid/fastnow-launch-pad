-- Create system_motivators table for the 8 default motivators
CREATE TABLE public.system_motivators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'personal',
  male_image_url TEXT,
  female_image_url TEXT,
  slug TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_motivators ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active system motivators" 
ON public.system_motivators 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage system motivators" 
ON public.system_motivators 
FOR ALL 
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Insert the 8 clean system motivators (taking the most recent active versions)
INSERT INTO public.system_motivators (title, content, category, male_image_url, female_image_url, slug, meta_title, meta_description, display_order)
SELECT DISTINCT ON (title) 
  title,
  content,
  category,
  male_image_url,
  female_image_url,
  slug,
  meta_title,
  meta_description,
  ROW_NUMBER() OVER (ORDER BY title) as display_order
FROM public.motivators 
WHERE is_system_goal = true AND is_active = true AND is_published = true
ORDER BY title, created_at DESC;

-- Remove system goals from user motivators table
DELETE FROM public.motivators WHERE is_system_goal = true;

-- Remove the is_system_goal column since it's no longer needed
ALTER TABLE public.motivators DROP COLUMN is_system_goal;

-- Add trigger for updated_at
CREATE TRIGGER update_system_motivators_updated_at
BEFORE UPDATE ON public.system_motivators
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();