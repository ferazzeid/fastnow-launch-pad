-- Create homepage_settings table to store image URLs in database instead of localStorage
CREATE TABLE public.homepage_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.homepage_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for homepage settings
CREATE POLICY "Anyone can view homepage settings" 
ON public.homepage_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage homepage settings" 
ON public.homepage_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_homepage_settings_updated_at
BEFORE UPDATE ON public.homepage_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default homepage settings
INSERT INTO public.homepage_settings (setting_key, setting_value) VALUES 
('logo', '{"url": "", "height": 40}'),
('hero_image', '{"url": "", "maxWidth": 500, "altText": "Hero Image"}')
ON CONFLICT (setting_key) DO NOTHING;