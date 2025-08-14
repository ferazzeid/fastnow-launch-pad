-- Update protocol content to match frontend
UPDATE site_settings SET setting_value = '"The FastNow Protocol"' WHERE setting_key = 'protocol_title';
UPDATE site_settings SET setting_value = '"How I Lost Fat With a 3-Day Fast + Calorie Control"' WHERE setting_key = 'protocol_subtitle';
UPDATE site_settings SET setting_value = '"The FastNow Protocol | FastNow"' WHERE setting_key = 'protocol_meta_title';
UPDATE site_settings SET setting_value = '"Learn how I lost fat with a 3-day fast plus calorie control using the FastNow Protocol"' WHERE setting_key = 'protocol_meta_description';

-- Update About App content to match frontend
UPDATE site_settings SET setting_value = '{"heroTitle": "Why the App Matters", "heroDescription": "", "featuresTitle": "Discover FastNow Features"}' WHERE setting_key = 'aboutAppContent';

-- Insert page content for About App to match frontend
INSERT INTO page_content (page_key, title, content, meta_title, meta_description, is_published)
VALUES (
  'about-fastnow-app',
  'Why the App Matters',
  'You could track this program on paper and still succeed. But the app keeps you immersed in the process — which is critical.

Immersion makes your brain assign higher priority to what you''re doing. It keeps the program front and center, helps you focus, and reveals how easy it is to sabotage yourself without even realizing it.

The app removes those blind spots, keeps you accountable, and gives you the momentum to see the program through.',
  'About App | fastnow.app',
  'Learn about the FastNow app - your ultimate companion for intermittent fasting, health tracking, and wellness goals.',
  true
)
ON CONFLICT (page_key) 
DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description;