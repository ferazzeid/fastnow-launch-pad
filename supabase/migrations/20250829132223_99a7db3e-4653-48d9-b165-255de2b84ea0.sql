-- Update Phase 2 title to "Daily Calorie Limit"
UPDATE site_settings 
SET setting_value = '"Daily Calorie Limit"'::jsonb
WHERE setting_key = 'protocol_phase2_title';

-- Remove all read more links by setting them to empty strings
UPDATE site_settings 
SET setting_value = '""'::jsonb
WHERE setting_key IN ('protocol_phase1_read_more_link', 'protocol_phase2_read_more_link', 'protocol_phase3_read_more_link');