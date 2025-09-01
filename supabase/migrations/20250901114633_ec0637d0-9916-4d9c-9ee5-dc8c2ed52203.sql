-- Add new image columns for male and female variants
ALTER TABLE public.motivators 
ADD COLUMN male_image_url TEXT,
ADD COLUMN female_image_url TEXT;

-- First, let's handle any existing duplicate slugs by making them unique
WITH duplicates AS (
  SELECT slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) as rn
  FROM motivators
)
UPDATE motivators 
SET slug = slug || '-' || (
  SELECT rn FROM duplicates WHERE duplicates.slug = motivators.slug
)
WHERE slug IN (
  SELECT slug FROM motivators GROUP BY slug HAVING COUNT(*) > 1
) AND motivators.slug NOT LIKE '%-[0-9]%';

-- Now consolidate the gender-based records
-- Step 1: Update male records with female images
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
  slug = REGEXP_REPLACE(m1.slug, '-(male|Male)', '', 'g')
WHERE m1.is_system_goal = true 
AND m1.gender = 'male';

-- Step 2: Update female records that don't have male counterparts
UPDATE motivators m1 SET
  male_image_url = m1.image_url,
  female_image_url = m1.image_url,
  title = REGEXP_REPLACE(m1.title, '-female', '', 'gi'),
  slug = REGEXP_REPLACE(m1.slug, '-(female|Female)', '', 'g')
WHERE m1.is_system_goal = true 
AND m1.gender = 'female'
AND NOT EXISTS (
  SELECT 1 FROM motivators m2 
  WHERE m2.is_system_goal = true 
  AND m2.gender = 'male'
  AND REGEXP_REPLACE(m2.title, '-male', '', 'gi') = REGEXP_REPLACE(m1.title, '-female', '', 'gi')
);

-- Step 3: Delete the duplicate female records
DELETE FROM motivators 
WHERE is_system_goal = true 
AND gender = 'female'
AND EXISTS (
  SELECT 1 FROM motivators m2 
  WHERE m2.is_system_goal = true 
  AND m2.gender = 'male'
  AND REGEXP_REPLACE(m2.title, '-male', '', 'gi') = REGEXP_REPLACE(motivators.title, '-female', '', 'gi')
);

-- Step 4: Remove the gender column
ALTER TABLE public.motivators DROP COLUMN gender;