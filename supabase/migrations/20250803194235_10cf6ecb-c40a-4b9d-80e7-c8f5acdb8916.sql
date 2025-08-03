-- Create page_content table for centralized content management
CREATE TABLE public.page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  featured_image_url TEXT,
  button_text TEXT,
  button_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view published page content" 
ON public.page_content 
FOR SELECT 
USING (is_published = true);

-- Create policies for admin management
CREATE POLICY "Admins can manage all page content" 
ON public.page_content 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_page_content_updated_at
BEFORE UPDATE ON public.page_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial page content from common defaults
INSERT INTO public.page_content (page_key, title, subtitle, content, meta_title, meta_description, button_text, button_url) VALUES
('home', 'My Protocol for Fat Loss', 'Transform your body with our scientifically-backed fasting approach', 'Discover the power of intermittent fasting with our comprehensive timeline and personalized guidance.', 'FastNow - My Protocol for Fat Loss', 'Transform your body with scientifically-backed intermittent fasting protocols and personalized guidance.', 'Download FastNow', '#'),
('fastnow-protocol', 'FastNow Protocol', 'A comprehensive guide to intermittent fasting', 'Learn about the science and methodology behind our fasting approach.', 'FastNow Protocol - Intermittent Fasting Guide', 'Comprehensive guide to intermittent fasting protocols and methodologies.', '', ''),
('about-me', 'About Me', 'Learn more about the creator', 'Personal story and background information.', 'About Me - FastNow', 'Learn about the creator and story behind FastNow.', '', ''),
('privacy-policy', 'Privacy Policy', '', 'This privacy policy explains how we collect, use, and protect your personal information.', 'Privacy Policy - FastNow', 'Our privacy policy explaining data collection and protection practices.', '', ''),
('terms-of-service', 'Terms of Service', '', 'These terms of service govern your use of our application and services.', 'Terms of Service - FastNow', 'Terms and conditions for using FastNow services.', '', ''),
('contact', 'Contact Us', 'Get in touch with us', 'We would love to hear from you. Send us a message and we will respond as soon as possible.', 'Contact Us - FastNow', 'Contact FastNow team for support and inquiries.', '', '');

-- Create general_settings table for site-wide settings
CREATE TABLE public.general_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for general_settings
ALTER TABLE public.general_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for general_settings
CREATE POLICY "Anyone can view general settings" 
ON public.general_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage general settings" 
ON public.general_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for general_settings timestamp updates
CREATE TRIGGER update_general_settings_updated_at
BEFORE UPDATE ON public.general_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default general settings
INSERT INTO public.general_settings (setting_key, setting_value) VALUES
('site_identity', '{"siteName": "FastNow", "tagline": "Transform Your Body with Intermittent Fasting", "description": "Scientifically-backed fasting protocols for sustainable weight loss", "logoUrl": "", "faviconUrl": ""}'),
('contact_info', '{"email": "contact@fastnow.com", "phone": "", "address": ""}'),
('social_links', '{"facebook": "", "twitter": "", "instagram": "", "youtube": ""}'),
('analytics', '{"googleAnalyticsId": "", "facebookPixelId": ""}');