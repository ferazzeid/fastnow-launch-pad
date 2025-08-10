-- Enable RLS and create policies for public FAQs visibility and admin management
DO $$
BEGIN
  IF to_regclass('public.faqs') IS NOT NULL THEN
    -- Enable Row Level Security if not already enabled
    EXECUTE 'ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY';

    -- Public can read only active FAQs
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' AND tablename = 'faqs' AND policyname = 'Public can view active FAQs'
    ) THEN
      EXECUTE 'CREATE POLICY "Public can view active FAQs" 
        ON public.faqs
        FOR SELECT
        USING (is_active = true)';
    END IF;

    -- Admins can perform all actions and view all rows
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' AND tablename = 'faqs' AND policyname = 'Admins can manage FAQs'
    ) THEN
      EXECUTE 'CREATE POLICY "Admins can manage FAQs" 
        ON public.faqs
        FOR ALL
        USING (has_role(auth.uid(), ''admin''::app_role))
        WITH CHECK (has_role(auth.uid(), ''admin''::app_role))';
    END IF;
  END IF;
END $$;