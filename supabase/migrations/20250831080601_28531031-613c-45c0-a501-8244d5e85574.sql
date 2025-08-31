-- Update the homepage entry in page_seo_settings to match the user's actual content
UPDATE public.page_seo_settings 
SET 
  page_title = 'The No-BS Fat Loss Protocol - FastNow',
  page_description = 'Transform your body with a concentrated, results-driven weight loss protocol - built for everyday people, not fitness models.',
  meta_title = 'The No-BS Fat Loss Protocol - FastNow',
  meta_description = 'Transform your body with a concentrated, results-driven weight loss protocol - built for everyday people, not fitness models.',
  updated_at = now()
WHERE page_path = '/';