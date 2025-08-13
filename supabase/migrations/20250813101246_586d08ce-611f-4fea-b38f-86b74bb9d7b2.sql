-- Add example read more links for testing the buttons
UPDATE site_settings 
SET setting_value = '"/blog/phase-1-water-fasting-guide"'
WHERE setting_key = 'protocol_phase1_read_more_link';

UPDATE site_settings 
SET setting_value = '"/blog/phase-2-diet-control-guide"'
WHERE setting_key = 'protocol_phase2_read_more_link';

UPDATE site_settings 
SET setting_value = '"/blog/phase-3-walking-guide"'
WHERE setting_key = 'protocol_phase3_read_more_link';