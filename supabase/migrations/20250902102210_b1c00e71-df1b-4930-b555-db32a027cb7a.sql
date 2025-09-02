-- Add alt text fields for About App page images
-- Add alt text for featured image in aboutAppContent
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_app_featured_image_alt text;

-- Add alt text field to feature_screenshots table
ALTER TABLE feature_screenshots ADD COLUMN IF NOT EXISTS alt_text text;