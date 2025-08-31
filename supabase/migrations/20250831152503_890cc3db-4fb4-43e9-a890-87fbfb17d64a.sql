-- Add slug and SEO fields to motivators table
ALTER TABLE public.motivators 
ADD COLUMN slug TEXT,
ADD COLUMN meta_title TEXT,
ADD COLUMN meta_description TEXT,
ADD COLUMN is_published BOOLEAN DEFAULT true;

-- Function to generate unique slugs
CREATE OR REPLACE FUNCTION generate_unique_slug(base_slug TEXT, table_name TEXT, id_to_exclude UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    counter INTEGER := 0;
    new_slug TEXT := base_slug;
    exists_count INTEGER;
BEGIN
    LOOP
        -- Check if slug exists (excluding current record if updating)
        EXECUTE format('SELECT COUNT(*) FROM %I WHERE slug = $1 AND ($2 IS NULL OR id != $2)', table_name) 
        INTO exists_count 
        USING new_slug, id_to_exclude;
        
        IF exists_count = 0 THEN
            RETURN new_slug;
        END IF;
        
        counter := counter + 1;
        new_slug := base_slug || '-' || counter;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Update existing motivators with unique slugs
DO $$
DECLARE
    r RECORD;
    base_slug TEXT;
    unique_slug TEXT;
BEGIN
    FOR r IN SELECT id, title FROM public.motivators WHERE slug IS NULL
    LOOP
        -- Generate base slug from title
        base_slug := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(r.title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
        
        -- Generate unique slug
        unique_slug := generate_unique_slug(base_slug, 'motivators', r.id);
        
        -- Update the record
        UPDATE public.motivators SET slug = unique_slug WHERE id = r.id;
    END LOOP;
END $$;

-- Make slug not null and create unique index
ALTER TABLE public.motivators ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX idx_motivators_slug ON public.motivators(slug);