-- Add new image columns for male and female variants
ALTER TABLE public.motivators 
ADD COLUMN male_image_url TEXT,
ADD COLUMN female_image_url TEXT;

-- Temporarily drop the unique slug constraint
DROP INDEX IF EXISTS idx_motivators_slug;

-- Update male records with consolidated data
UPDATE motivators SET
  male_image_url = image_url,
  female_image_url = (
    SELECT m2.image_url 
    FROM motivators m2 
    WHERE m2.is_system_goal = true 
    AND m2.gender = 'female'
    AND REGEXP_REPLACE(m2.title, '-female', '', 'gi') = REGEXP_REPLACE(motivators.title, '-male', '', 'gi')
    LIMIT 1
  ),
  title = REGEXP_REPLACE(title, '-male', '', 'gi'),
  slug = REGEXP_REPLACE(slug, '-male', '', 'gi')
WHERE is_system_goal = true 
AND gender = 'male';

-- Update female records without male counterparts
UPDATE motivators SET
  male_image_url = image_url,
  female_image_url = image_url,
  title = REGEXP_REPLACE(title, '-female', '', 'gi'),
  slug = REGEXP_REPLACE(slug, '-female', '', 'gi')
WHERE is_system_goal = true 
AND gender = 'female'
AND NOT EXISTS (
  SELECT 1 FROM motivators m2 
  WHERE m2.is_system_goal = true 
  AND m2.gender = 'male'
  AND REGEXP_REPLACE(m2.title, '-male', '', 'gi') = REGEXP_REPLACE(motivators.title, '-female', '', 'gi')
);

-- Delete duplicate female records
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

-- Recreate the unique slug constraint
CREATE UNIQUE INDEX idx_motivators_slug ON motivators(slug);