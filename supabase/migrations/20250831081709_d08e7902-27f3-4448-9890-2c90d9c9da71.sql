-- Create comprehensive site SEO settings
INSERT INTO site_settings (setting_key, setting_value) VALUES 
('seo_site_title', '"FastNow - The No-BS Fat Loss Protocol"'),
('seo_site_description', '"Transform your body with a concentrated, results-driven weight loss protocol - built for everyday people, not fitness models."'),
('seo_site_keywords', '"fat loss, weight loss, no bs protocol, fastnow, body transformation, diet plan, sustainable weight loss"'),
('seo_site_author', '"FastNow Team"'),
('seo_base_url', '"https://fastnow.app"'),
('seo_default_image', '"https://fastnow.app/lovable-uploads/social-share-image.jpg"'),
('seo_organization_name', '"FastNow"'),
('seo_organization_description', '"The FastNow protocol for effective fat loss and body transformation"'),
('seo_organization_url', '"https://fastnow.app"'),
('seo_organization_logo', '"https://texnkijwcygodtywgedm.supabase.co/storage/v1/object/public/website-images/favicon.png"'),
('seo_organization_email', '"hello@fastnow.app"'),
('seo_social_facebook', '""'),
('seo_social_twitter', '""'),
('seo_social_instagram', '""'),
('seo_social_youtube', '""'),
('seo_social_linkedin', '""'),
('seo_theme_color', '"#6366F1"'),
('seo_robots_default', '"index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"')
ON CONFLICT (setting_key) DO UPDATE SET
setting_value = EXCLUDED.setting_value,
updated_at = now();