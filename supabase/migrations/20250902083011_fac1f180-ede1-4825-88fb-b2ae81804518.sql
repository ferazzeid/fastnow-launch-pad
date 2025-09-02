-- Add link_url field to system_motivators table
ALTER TABLE public.system_motivators 
ADD COLUMN link_url text;

-- Auto-populate the link_url field based on existing slugs
UPDATE public.system_motivators 
SET link_url = '/motivators/' || slug 
WHERE slug IS NOT NULL AND slug != '';

-- Add comment to document the field
COMMENT ON COLUMN public.system_motivators.link_url IS 'Auto-generated URL pointing to the motivator detail page';