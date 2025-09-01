-- Consolidate motivators: Create 8 unified records with both male and female images
-- Step 1: Create consolidated motivator records

-- First, let's create a temporary table to organize the consolidation
CREATE TEMP TABLE motivator_consolidation AS
WITH paired_motivators AS (
  -- Group male and female versions by title
  SELECT 
    title,
    MAX(CASE WHEN gender = 'male' THEN image_url END) as male_image,
    MAX(CASE WHEN gender = 'female' THEN image_url END) as female_image,
    MAX(CASE WHEN gender = 'male' THEN content END) as content,
    MAX(CASE WHEN gender = 'male' THEN category END) as category,
    MAX(CASE WHEN gender = 'male' THEN slug END) as slug,
    MAX(CASE WHEN gender = 'male' THEN meta_title END) as meta_title,
    MAX(CASE WHEN gender = 'male' THEN meta_description END) as meta_description,
    MAX(CASE WHEN gender = 'male' THEN link_url END) as link_url,
    MAX(user_id) as user_id
  FROM motivators 
  WHERE is_system_goal = true AND is_active = true
  GROUP BY title
  HAVING COUNT(*) = 2  -- Only titles with both male and female versions
),
single_motivators AS (
  -- Handle any motivators that don't have pairs
  SELECT DISTINCT
    m.title,
    COALESCE(m.image_url, '') as male_image,
    '' as female_image,
    m.content,
    m.category,
    m.slug || '-consolidated' as slug,
    m.meta_title,
    m.meta_description,
    m.link_url,
    m.user_id
  FROM motivators m
  WHERE is_system_goal = true AND is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM motivators m2 
    WHERE m2.title = m.title AND m2.id != m.id AND m2.is_system_goal = true AND m2.is_active = true
  )
)
SELECT * FROM paired_motivators
UNION ALL 
SELECT * FROM single_motivators;

-- Step 2: Insert consolidated motivator records
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
  male_image,
  female_image,
  NULL as gender,  -- Gender-neutral
  true as is_active,
  true as is_published,
  true as is_system_goal,
  true as show_in_animations,
  now() as created_at,
  now() as updated_at
FROM motivator_consolidation;

-- Step 3: Deactivate all old motivator records (both duplicates and originals)
UPDATE motivators 
SET 
  is_active = false,
  updated_at = now()
WHERE id NOT IN (
  -- Keep only the newly created consolidated records
  SELECT id FROM motivators 
  WHERE gender IS NULL 
  AND is_system_goal = true 
  AND male_image_url IS NOT NULL 
  AND created_at >= now() - interval '1 minute'
);

-- Step 4: Clean up any remaining duplicates and ensure we have exactly 8 consolidated records
WITH consolidated_count AS (
  SELECT title, COUNT(*) as cnt, MIN(id) as keep_id
  FROM motivators 
  WHERE is_active = true AND is_system_goal = true AND gender IS NULL
  GROUP BY title
  HAVING COUNT(*) > 1
)
UPDATE motivators 
SET is_active = false 
WHERE id IN (
  SELECT m.id 
  FROM motivators m
  JOIN consolidated_count cc ON m.title = cc.title
  WHERE m.id != cc.keep_id AND m.is_active = true
);