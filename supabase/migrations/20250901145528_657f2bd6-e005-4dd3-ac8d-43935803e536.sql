-- Complete consolidation for the 3 remaining motivators
WITH paired_motivators AS (
  SELECT 
    title,
    MAX(CASE WHEN gender = 'male' THEN image_url END) as male_image,
    MAX(CASE WHEN gender = 'female' THEN image_url END) as female_image,
    MAX(CASE WHEN gender = 'male' THEN content END) as content,
    MAX(CASE WHEN gender = 'male' THEN category END) as category,
    MAX(CASE WHEN gender = 'male' THEN user_id END) as user_id
  FROM motivators 
  WHERE is_system_goal = true 
    AND gender IS NOT NULL
    AND title IN ('Fix Unexplained Symptoms', 'Mirror Wake-Up', 'Regain Self-Respect')
  GROUP BY title
)
INSERT INTO motivators (
  user_id,
  title,
  content,
  category,
  slug,
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
  lower(replace(replace(title, ' ', '-'), '''', '')) || '-consolidated' as slug,
  male_image,
  female_image,
  NULL as gender,  -- Gender-neutral
  true as is_active,
  true as is_published,
  true as is_system_goal,
  true as show_in_animations,
  now() as created_at,
  now() as updated_at
FROM paired_motivators;