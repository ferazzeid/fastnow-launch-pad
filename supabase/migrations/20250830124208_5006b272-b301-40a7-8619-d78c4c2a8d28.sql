-- Add show_author_box field to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN show_author_box BOOLEAN NOT NULL DEFAULT true;

-- Insert default author settings into site_settings if they don't exist
INSERT INTO public.site_settings (setting_key, setting_value) 
VALUES 
  ('author_profile', '{"name": "FastNow Team", "bio": "Passionate about helping people achieve their health and wellness goals through intermittent fasting.", "photo_url": "", "social_links": {"website": "", "twitter": "", "linkedin": ""}}')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO public.site_settings (setting_key, setting_value) 
VALUES 
  ('author_box_settings', '{"show_by_default": true, "enabled": true}')
ON CONFLICT (setting_key) DO NOTHING;