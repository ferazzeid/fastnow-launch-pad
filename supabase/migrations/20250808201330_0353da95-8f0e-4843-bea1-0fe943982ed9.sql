-- Clear the placeholder content from protocol_content so the detailed phases show again
UPDATE site_settings 
SET setting_value = '""'
WHERE setting_key = 'protocol_content';