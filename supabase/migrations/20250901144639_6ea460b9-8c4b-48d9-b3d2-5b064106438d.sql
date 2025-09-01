-- Consolidate motivators: Create 8 unified records with both male and female images
-- Step 1: Deactivate all existing records first
UPDATE motivators SET is_active = false WHERE is_active = true;

-- Step 2: Create consolidated motivator records
WITH paired_motivators AS (
  -- Group male and female versions by title
  SELECT DISTINCT ON (title)
    title,
    MAX(CASE WHEN gender = 'male' THEN image_url END) OVER (PARTITION BY title) as male_image,
    MAX(CASE WHEN gender = 'female' THEN image_url END) OVER (PARTITION BY title) as female_image,
    FIRST_VALUE(content) OVER (PARTITION BY title ORDER BY gender NULLS LAST) as content,
    FIRST_VALUE(category) OVER (PARTITION BY title ORDER BY gender NULLS LAST) as category,
    FIRST_VALUE(slug) OVER (PARTITION BY title ORDER BY gender NULLS LAST) || '-consolidated' as slug,
    FIRST_VALUE(meta_title) OVER (PARTITION BY title ORDER BY gender NULLS LAST) as meta_title,
    FIRST_VALUE(meta_description) OVER (PARTITION BY title ORDER BY gender NULLS LAST) as meta_description,
    FIRST_VALUE(link_url) OVER (PARTITION BY title ORDER BY gender NULLS LAST) as link_url,
    FIRST_VALUE(user_id) OVER (PARTITION BY title ORDER BY gender NULLS LAST) as user_id
  FROM motivators 
  WHERE is_system_goal = true
  AND title IN ('Autophagy Clean-Up', 'Be Looked At', 'Event Countdown', 'Fit Into Old Clothes', 'Fix Insulin Levels', 'Lose Weight', 'Mental Clarity', 'Reduce Inflammation')
)
INSERT INTO motivators (
  user_id, 
  title, 
  content, 
  category, 
  slug, 
  meta_title, 
  meta_description, 
  link_url,
  male_image_url,
  female_image_url,
  gender,
  is_active,
  is_published,
  is_system_goal,
  show_in_animations,
  created_at,
  updated_at
)
SELECT 
  user_id,
  title,
  content,
  category,
  slug,
  meta_title,
  meta_description,
  link_url,
  COALESCE(male_image, '') as male_image_url,
  COALESCE(female_image, '') as female_image_url,
  NULL as gender,  -- Gender-neutral
  true as is_active,
  true as is_published,
  true as is_system_goal,
  true as show_in_animations,
  now() as created_at,
  now() as updated_at
FROM paired_motivators;