-- Initialize default read more link settings for the protocol phases
INSERT INTO site_settings (setting_key, setting_value) VALUES 
('protocol_phase1_read_more_link', '""'),
('protocol_phase2_read_more_link', '""'),
('protocol_phase3_read_more_link', '""')
ON CONFLICT (setting_key) DO NOTHING;