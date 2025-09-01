-- Add new image columns for male and female variants
ALTER TABLE public.motivators 
ADD COLUMN male_image_url TEXT,
ADD COLUMN female_image_url TEXT;

-- First, update male records with their corresponding female image URLs
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
  slug = REGEXP_REPLACE(m1.slug, '-male', '', 'gi')
WHERE m1.is_system_goal = true 
AND m1.gender = 'male';

-- Handle cases where there might be female records without male counterparts
UPDATE motivators m1 SET
  male_image_url = COALESCE(
    (SELECT m2.image_url 
     FROM motivators m2 
     WHERE m2.is_system_goal = true 
     AND m2.gender = 'male'
     AND REGEXP_REPLACE(m2.title, '-male', '', 'gi') = REGEXP_REPLACE(m1.title, '-female', '', 'gi')
     LIMIT 1), 
    m1.image_url
  ),
  female_image_url = m1.image_url,
  title = REGEXP_REPLACE(m1.title, '-female', '', 'gi'),
  slug = REGEXP_REPLACE(m1.slug, '-female', '', 'gi')
WHERE m1.is_system_goal = true 
AND m1.gender = 'female'
AND NOT EXISTS (
  SELECT 1 FROM motivators m2 
  WHERE m2.is_system_goal = true 
  AND m2.gender = 'male'
  AND REGEXP_REPLACE(m2.title, '-male', '', 'gi') = REGEXP_REPLACE(m1.title, '-female', '', 'gi')
);

-- Delete the duplicate female records (keep only where no male equivalent exists)
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