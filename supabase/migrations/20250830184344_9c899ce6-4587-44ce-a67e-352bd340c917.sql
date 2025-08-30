-- Create a homepage featured image setting for the admin to manage
INSERT INTO site_settings (setting_key, setting_value) 
VALUES ('homepage_featured_image', '""')
ON CONFLICT (setting_key) DO NOTHING;