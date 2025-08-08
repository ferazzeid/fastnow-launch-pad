-- Update navigation transparency settings to include pages with featured images
INSERT INTO site_settings (setting_key, setting_value) 
VALUES (
  'navigation_transparency',
  '{"/" : true, "/fast-now-protocol" : true, "/about-fastnow-app" : true, "/about-me" : true, "/faq" : false, "/blog" : false}'
) 
ON CONFLICT (setting_key) 
DO UPDATE SET setting_value = EXCLUDED.setting_value;