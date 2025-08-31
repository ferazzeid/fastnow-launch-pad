-- Remove fake entries that don't actually exist
DELETE FROM page_seo_settings WHERE page_path IN ('/privacy-policy', '/terms-of-service');

-- Add the REAL routes that actually exist
INSERT INTO page_seo_settings (page_path, page_title, page_description, page_type, is_indexed, robots_directive, is_dynamic) VALUES
('/privacy', 'Privacy Policy - FastNow', 'Privacy policy for FastNow app and website.', 'legal', false, 'noindex, nofollow', false),
('/terms', 'Terms of Service - FastNow', 'Terms of service for FastNow app and website.', 'legal', false, 'noindex, nofollow', false),
('/contact', 'Contact - FastNow', 'Contact information for FastNow.', 'content', true, 'index, follow', false),
('/fastnow-protocol', 'FastNow Protocol', 'The complete FastNow fat loss protocol and guide.', 'content', true, 'index, follow', false),
('/about-fastnow-app', 'About FastNow App', 'Learn about the FastNow mobile application.', 'content', true, 'index, follow', false),
('/blog', 'Blog - FastNow', 'Latest articles about fasting and fat loss.', 'blog', true, 'index, follow', false),
('/fasting-timeline', 'Fasting Timeline - FastNow', 'Hour-by-hour fasting timeline and guidance.', 'blog', true, 'index, follow', false)
ON CONFLICT (page_path) DO UPDATE SET
page_title = EXCLUDED.page_title,
page_description = EXCLUDED.page_description,
page_type = EXCLUDED.page_type,
updated_at = now();