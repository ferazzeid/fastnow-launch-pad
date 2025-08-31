-- Create page_seo_settings table for comprehensive page indexing management
CREATE TABLE public.page_seo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL UNIQUE,
  page_title TEXT NOT NULL,
  page_description TEXT,
  is_indexed BOOLEAN NOT NULL DEFAULT true,
  robots_directive TEXT NOT NULL DEFAULT 'index, follow',
  page_type TEXT NOT NULL DEFAULT 'content', -- content, blog, admin, legal, system
  is_dynamic BOOLEAN NOT NULL DEFAULT false, -- for blog posts and dynamic pages
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_seo_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for page SEO settings
CREATE POLICY "Admins can manage page SEO settings" 
ON public.page_seo_settings 
FOR ALL 
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

CREATE POLICY "Anyone can view page SEO settings" 
ON public.page_seo_settings 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_page_seo_settings_updated_at
BEFORE UPDATE ON public.page_seo_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial page SEO settings
INSERT INTO public.page_seo_settings (page_path, page_title, page_description, is_indexed, page_type, robots_directive) VALUES
('/', 'FastNow - Intermittent Fasting App', 'The ultimate intermittent fasting app with AI coaching, progress tracking, and personalized guidance.', true, 'content', 'index, follow'),
('/fastnow-protocol', 'FastNow Protocol - Intermittent Fasting Guide', 'Comprehensive intermittent fasting protocol with scientific backing and step-by-step guidance.', true, 'content', 'index, follow'),
('/about-fastnow-app', 'About FastNow App - Features & Benefits', 'Learn about FastNow app features, benefits, and how it helps you succeed with intermittent fasting.', true, 'content', 'index, follow'),
('/blog', 'FastNow Blog - Intermittent Fasting Tips & Guides', 'Expert tips, guides, and insights about intermittent fasting, health, and wellness.', true, 'content', 'index, follow'),
('/fasting-timeline', 'Fasting Timeline - Hour by Hour Guide', 'Detailed fasting timeline showing what happens to your body during extended fasts.', false, 'system', 'noindex, nofollow'),

-- Admin pages (always noindex)
('/admin', 'Admin Dashboard', 'Administrative dashboard for content management.', false, 'admin', 'noindex, nofollow'),
('/admin/login', 'Admin Login', 'Administrator login page.', false, 'admin', 'noindex, nofollow'),
('/admin/seo-analytics', 'SEO & Analytics Settings', 'Manage SEO settings and analytics configuration.', false, 'admin', 'noindex, nofollow'),
('/admin/blog', 'Blog Management', 'Manage blog posts and content.', false, 'admin', 'noindex, nofollow'),
('/admin/pages', 'Page Management', 'Manage website pages and content.', false, 'admin', 'noindex, nofollow'),
('/admin/sitemap', 'Sitemap Generator', 'Generate and manage website sitemap.', false, 'admin', 'noindex, nofollow'),

-- Legal pages
('/privacy-policy', 'Privacy Policy - FastNow', 'Privacy policy for FastNow app and website.', true, 'legal', 'index, follow'),
('/terms-of-service', 'Terms of Service - FastNow', 'Terms of service for FastNow app and website.', true, 'legal', 'index, follow'),

-- System pages
('/404', '404 - Page Not Found', 'The requested page could not be found.', false, 'system', 'noindex, nofollow');

-- Create function to get page SEO settings by path
CREATE OR REPLACE FUNCTION public.get_page_seo_settings(page_path_param TEXT)
RETURNS TABLE(
  is_indexed BOOLEAN,
  robots_directive TEXT,
  meta_title TEXT,
  meta_description TEXT
) 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pss.is_indexed,
    pss.robots_directive,
    COALESCE(pss.meta_title, pss.page_title) as meta_title,
    COALESCE(pss.meta_description, pss.page_description) as meta_description
  FROM public.page_seo_settings pss
  WHERE pss.page_path = page_path_param;
  
  -- If no specific settings found, return defaults
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      true as is_indexed,
      'index, follow'::TEXT as robots_directive,
      NULL::TEXT as meta_title,
      NULL::TEXT as meta_description;
  END IF;
END;
$$;