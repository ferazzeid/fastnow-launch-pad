-- Add alt text columns for protocol images
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS protocol_featured_image_alt TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS protocol_phase1_image_alt TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS protocol_phase2_image_alt TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS protocol_phase3_image_alt TEXT;