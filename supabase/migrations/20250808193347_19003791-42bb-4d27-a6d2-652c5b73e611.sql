-- Insert default FastNow Protocol content so it can be edited in the admin
INSERT INTO site_settings (setting_key, setting_value) VALUES 
('protocol_title', '"The FastNow Protocol"'),
('protocol_subtitle', '"How I Lost Fat With a 3-Day Fast + Calorie Control"'),
('protocol_content', '"This is where you can write your custom protocol content. The detailed 3-phase protocol you see on the frontend is hardcoded default content that will be replaced when you add content here.\n\nAdd your own protocol details, instructions, or any custom content you want to display instead of the default phases."'),
('protocol_featured_image', '""')
ON CONFLICT (setting_key) DO UPDATE SET
setting_value = EXCLUDED.setting_value;