-- Insert default setting for Ring Bell Gallery (disabled by default)
INSERT INTO site_settings (setting_key, setting_value)
VALUES ('ring_bell_gallery_enabled', 'false')
ON CONFLICT (setting_key) DO NOTHING;