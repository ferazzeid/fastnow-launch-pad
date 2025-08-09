-- Create navigation_settings table to control page visibility
CREATE TABLE IF NOT EXISTS public.navigation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL UNIQUE,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.navigation_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view navigation settings
CREATE POLICY "Anyone can view navigation settings" ON public.navigation_settings
FOR SELECT USING (true);

-- Allow admins to manage navigation settings
CREATE POLICY "Admins can manage navigation settings" ON public.navigation_settings
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default navigation settings
INSERT INTO public.navigation_settings (page_key, is_visible, display_order) VALUES
('fast-now-protocol', true, 1),
('about-fastnow-app', true, 2),
('faq', true, 3),
('about-me', false, 4)
ON CONFLICT (page_key) DO NOTHING;

-- Create trigger for updated_at
CREATE TRIGGER update_navigation_settings_updated_at
  BEFORE UPDATE ON public.navigation_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();