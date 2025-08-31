-- Add calculator pages to page SEO settings
INSERT INTO public.page_seo_settings (
  page_path,
  page_title,
  page_description,
  meta_title,
  meta_description,
  page_type,
  is_indexed,
  robots_directive,
  is_dynamic
) VALUES 
(
  '/walking-calculator',
  'Walking Calorie Calculator',
  'Calculate calories burned from walking based on steps, distance, or time. Get personalized results with fun food equivalents and health recommendations.',
  'Walking Calorie Calculator - FastNow',
  'Calculate calories burned from walking based on steps, distance, or time. Get personalized results with fun food equivalents and health recommendations.',
  'tool',
  true,
  'index, follow',
  false
),
(
  '/weight-loss-calculator',
  'Weight Loss Calculator',
  'Calculate your projected weight loss based on calorie intake and activity level. Uses scientific BMR calculations and walking activity to estimate your results.',
  'Weight Loss Calculator - FastNow',
  'Calculate your projected weight loss based on calorie intake and activity level. Uses scientific BMR calculations and walking activity to estimate your results.',
  'tool',
  true,
  'index, follow',
  false
);