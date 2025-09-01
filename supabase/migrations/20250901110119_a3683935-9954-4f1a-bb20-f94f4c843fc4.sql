-- Add new image columns for male and female variants
ALTER TABLE public.motivators 
ADD COLUMN male_image_url TEXT,
ADD COLUMN female_image_url TEXT;

-- Migrate existing data: consolidate male/female pairs into unified goals
WITH goal_pairs AS (
  SELECT 
    REGEXP_REPLACE(title, '-male|-female', '', 'gi') as base_title,
    MAX(CASE WHEN gender = 'male' THEN id END) as male_id,
    MAX(CASE WHEN gender = 'female' THEN id END) as female_id,
    MAX(CASE WHEN gender = 'male' THEN image_url END) as male_image,
    MAX(CASE WHEN gender = 'female' THEN image_url END) as female_image,
    MAX(CASE WHEN gender = 'male' THEN content END) as male_content,
    MAX(CASE WHEN gender = 'female' THEN content END) as female_content,
    MAX(CASE WHEN gender = 'male' THEN user_id END) as user_id,
    MAX(CASE WHEN gender = 'male' THEN category END) as category,
    MAX(CASE WHEN gender = 'male' THEN slug END) as base_slug,
    MAX(created_at) as created_at
  FROM motivators 
  WHERE is_system_goal = true
  GROUP BY REGEXP_REPLACE(title, '-male|-female', '', 'gi')
)
-- Update male records with female images and remove gender
UPDATE motivators SET
  title = gp.base_title,
  male_image_url = gp.male_image,
  female_image_url = gp.female_image,
  content = COALESCE(gp.male_content, gp.female_content),
  gender = NULL,
  slug = REGEXP_REPLACE(slug, '-male|-female', '', 'gi')
FROM goal_pairs gp
WHERE motivators.id = gp.male_id;

-- Delete the female duplicate records  
DELETE FROM motivators 
WHERE is_system_goal = true 
AND gender = 'female';

-- Remove the gender column
ALTER TABLE public.motivators DROP COLUMN gender;

-- Update slugs to remove any remaining male/female suffixes
UPDATE motivators 
SET slug = REGEXP_REPLACE(slug, '-male|-female', '', 'gi')
WHERE slug ~ '-(male|female)$';