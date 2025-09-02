-- Insert motivator URLs into page_seo_settings
INSERT INTO page_seo_settings (page_path, page_title, page_description, meta_title, meta_description, page_type, is_indexed, robots_directive, is_dynamic)
SELECT 
  CONCAT('/motivators/', sm.slug) as page_path,
  sm.title as page_title,
  LEFT(sm.content, 160) as page_description,
  COALESCE(sm.meta_title, sm.title) as meta_title,
  COALESCE(sm.meta_description, LEFT(sm.content, 160)) as meta_description,
  'motivator' as page_type,
  true as is_indexed,
  'index, follow' as robots_directive,
  false as is_dynamic
FROM system_motivators sm
WHERE sm.is_active = true
AND NOT EXISTS (
  SELECT 1 FROM page_seo_settings pss 
  WHERE pss.page_path = CONCAT('/motivators/', sm.slug)
);