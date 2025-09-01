-- Consolidate motivators: Create 8 unified records with both male and female images
-- Step 1: Create consolidated records by manually pairing male/female versions

WITH motivator_pairs AS (
  SELECT DISTINCT
    m1.title,
    m1.user_id,
    m1.content,
    m1.category,
    m1.slug,
    m1.meta_title,
    m1.meta_description,
    m1.link_url,
    m1.image_url as male_image_url,
    m2.image_url as female_image_url
  FROM motivators m1
  JOIN motivators m2 ON m1.title = m2.title
  WHERE m1.gender = 'male' 
    AND m2.gender = 'female'
    AND m1.is_system_goal = true 
    AND m2.is_system_goal = true
    AND m1.is_active = true 
    AND m2.is_active = true
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
  slug || '-unified',
  meta_title,
  meta_description,
  link_url,
  male_image_url,
  female_image_url,
  NULL as gender,  -- Gender-neutral
  true as is_active,
  true as is_published,
  true as is_system_goal,
  true as show_in_animations,
  now() as created_at,
  now() as updated_at
FROM motivator_pairs;

-- Step 2: Deactivate all old duplicate records
UPDATE motivators 
SET 
  is_active = false,
  updated_at = now()
WHERE gender IS NOT NULL 
  AND is_system_goal = true;

-- Step 3: Also deactivate the old non-system-goal records  
UPDATE motivators 
SET 
  is_active = false,
  updated_at = now()
WHERE is_system_goal = false;