-- Create simple text entries for page content
INSERT INTO public.site_settings (setting_key, setting_value) 
VALUES (
  'about_me_title', 
  '"About Me – The Personal Journey Behind FastNow"'
)
ON CONFLICT (setting_key) 
DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

INSERT INTO public.site_settings (setting_key, setting_value) 
VALUES (
  'about_me_subtitle', 
  '"The personal journey behind the Fast Now Protocol - years of struggle, discovery, and finally finding what works."'
)
ON CONFLICT (setting_key) 
DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();