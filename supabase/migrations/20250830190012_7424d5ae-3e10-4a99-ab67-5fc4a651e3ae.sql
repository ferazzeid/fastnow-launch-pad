-- Add is_indexed column to page_content table
ALTER TABLE page_content 
ADD COLUMN is_indexed BOOLEAN DEFAULT true;

-- Set contact, privacy, and terms pages to not be indexed
UPDATE page_content 
SET is_indexed = false 
WHERE page_key IN ('contact', 'privacy', 'terms');