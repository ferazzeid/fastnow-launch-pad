-- Add new image columns for male and female variants
ALTER TABLE public.motivators 
ADD COLUMN male_image_url TEXT,
ADD COLUMN female_image_url TEXT;

-- Create a temporary function to generate unique slugs for consolidation
CREATE OR REPLACE FUNCTION temp_generate_consolidated_slug(base_slug text)
RETURNS text AS $$
DECLARE
    clean_slug text;
    counter integer := 0;
    final_slug text;
BEGIN
    -- Remove -male/-female suffixes
    clean_slug := REGEXP_REPLACE(base_slug, '-(male|female)$', '', 'gi');
    final_slug := clean_slug;
    
    -- Check if slug exists and add counter if needed
    WHILE EXISTS (
        SELECT 1 FROM motivators 
        WHERE slug = final_slug 
        AND is_system_goal = true
    ) LOOP
        counter := counter + 1;
        final_slug := clean_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- First, update male records with consolidated data
UPDATE motivators m1 SET
  male_image_url = m1.image_url,
  female_image_url = (
    SELECT m2.image_url 
    FROM motivators m2 
    WHERE m2.is_system_goal = true 
    AND m2.gender = 'female'
    AND REGEXP_REPLACE(m2.title, '-female', '', 'gi') = REGEXP_REPLACE(m1.title, '-male', '', 'gi')
    LIMIT 1
  ),
  title = REGEXP_REPLACE(m1.title, '-male', '', 'gi'),
  slug = temp_generate_consolidated_slug(m1.slug)
WHERE m1.is_system_goal = true 
AND m1.gender = 'male';

-- Handle female records without male counterparts
UPDATE motivators m1 SET
  male_image_url = m1.image_url,
  female_image_url = m1.image_url,
  title = REGEXP_REPLACE(m1.title, '-female', '', 'gi'),
  slug = temp_generate_consolidated_slug(m1.slug)
WHERE m1.is_system_goal = true 
AND m1.gender = 'female'
AND NOT EXISTS (
  SELECT 1 FROM motivators m2 
  WHERE m2.is_system_goal = true 
  AND m2.gender = 'male'
  AND REGEXP_REPLACE(m2.title, '-male', '', 'gi') = REGEXP_REPLACE(m1.title, '-female', '', 'gi')
);

-- Delete the duplicate female records
DELETE FROM motivators 
WHERE is_system_goal = true 
AND gender = 'female'
AND EXISTS (
  SELECT 1 FROM motivators m2 
  WHERE m2.is_system_goal = true 
  AND m2.gender = 'male'
  AND REGEXP_REPLACE(m2.title, '-male', '', 'gi') = REGEXP_REPLACE(motivators.title, '-female', '', 'gi')
);

-- Remove the gender column
ALTER TABLE public.motivators DROP COLUMN gender;

-- Drop the temporary function
DROP FUNCTION temp_generate_consolidated_slug(text);