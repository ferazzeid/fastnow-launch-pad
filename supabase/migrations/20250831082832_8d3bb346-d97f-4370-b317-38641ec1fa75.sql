-- Add admin login page with proper noindex settings
INSERT INTO page_seo_settings (page_path, page_title, page_description, page_type, is_indexed, robots_directive, is_dynamic) VALUES
('/admin/login', 'Admin Login - FastNow', 'Secure admin login portal for FastNow administration panel.', 'admin', false, 'noindex, nofollow', false)
ON CONFLICT (page_path) DO UPDATE SET
is_indexed = false,
robots_directive = 'noindex, nofollow',
page_type = 'admin',
updated_at = now();