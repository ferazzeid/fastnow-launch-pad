-- Add slug and SEO fields to motivators table
ALTER TABLE public.motivators 
ADD COLUMN slug TEXT,
ADD COLUMN meta_title TEXT,
ADD COLUMN meta_description TEXT,
ADD COLUMN is_published BOOLEAN DEFAULT true;

-- Create unique index on slug
CREATE UNIQUE INDEX idx_motivators_slug ON public.motivators(slug);

-- Update existing motivators with slugs based on title
UPDATE public.motivators 
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;

-- Make slug not null after updating existing records
ALTER TABLE public.motivators ALTER COLUMN slug SET NOT NULL;