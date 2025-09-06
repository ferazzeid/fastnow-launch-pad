-- Create UI translations table for caching translations
CREATE TABLE IF NOT EXISTS public.ui_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_key TEXT NOT NULL,
  language_code TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(translation_key, language_code)
);

-- Enable RLS
ALTER TABLE public.ui_translations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view translations" 
ON public.ui_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Service role can manage translations" 
ON public.ui_translations 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER update_ui_translations_updated_at
BEFORE UPDATE ON public.ui_translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_ui_translations_key_lang 
ON public.ui_translations(translation_key, language_code);

CREATE INDEX IF NOT EXISTS idx_ui_translations_language 
ON public.ui_translations(language_code);