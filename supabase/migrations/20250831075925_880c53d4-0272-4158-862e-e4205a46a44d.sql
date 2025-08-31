-- Fix the function search_path issue by adding proper security settings
CREATE OR REPLACE FUNCTION public.get_page_seo_settings(page_path_param TEXT)
RETURNS TABLE(
  is_indexed BOOLEAN,
  robots_directive TEXT,
  meta_title TEXT,
  meta_description TEXT
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pss.is_indexed,
    pss.robots_directive,
    COALESCE(pss.meta_title, pss.page_title) as meta_title,
    COALESCE(pss.meta_description, pss.page_description) as meta_description
  FROM public.page_seo_settings pss
  WHERE pss.page_path = page_path_param;
  
  -- If no specific settings found, return defaults
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      true as is_indexed,
      'index, follow'::TEXT as robots_directive,
      NULL::TEXT as meta_title,
      NULL::TEXT as meta_description;
  END IF;
END;
$$;