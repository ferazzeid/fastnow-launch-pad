-- Create feature_screenshots table for managing app screenshots by feature
CREATE TABLE public.feature_screenshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_key TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feature_screenshots ENABLE ROW LEVEL SECURITY;

-- Create policies for feature screenshots
CREATE POLICY "Admins can manage feature screenshots" 
ON public.feature_screenshots 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view feature screenshots" 
ON public.feature_screenshots 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_feature_screenshots_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_feature_screenshots_updated_at
  BEFORE UPDATE ON public.feature_screenshots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_feature_screenshots_updated_at();

-- Insert default feature entries
INSERT INTO public.feature_screenshots (feature_key, image_url, title) VALUES
('fasting-timer', '', 'Fasting Timer'),
('walking-tracker', '', 'Walking Tracker'),
('food-log', '', 'Food Log'),
('motivators', '', 'Motivators'),
('ai-assistant', '', 'AI Assistant');