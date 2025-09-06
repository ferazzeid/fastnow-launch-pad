-- Add language-specific columns to page_content table
ALTER TABLE public.page_content 
ADD COLUMN content_ar TEXT,
ADD COLUMN content_ru TEXT,
ADD COLUMN content_de TEXT,
ADD COLUMN title_ar TEXT,
ADD COLUMN title_ru TEXT,
ADD COLUMN title_de TEXT,
ADD COLUMN meta_description_ar TEXT,
ADD COLUMN meta_description_ru TEXT,
ADD COLUMN meta_description_de TEXT;

-- Add language-specific columns to blog_posts table
ALTER TABLE public.blog_posts
ADD COLUMN title_ar TEXT,
ADD COLUMN title_ru TEXT, 
ADD COLUMN title_de TEXT,
ADD COLUMN content_ar TEXT,
ADD COLUMN content_ru TEXT,
ADD COLUMN content_de TEXT,
ADD COLUMN excerpt_ar TEXT,
ADD COLUMN excerpt_ru TEXT,
ADD COLUMN excerpt_de TEXT;

-- Add language-specific columns to fasting_timeline_posts table
ALTER TABLE public.fasting_timeline_posts
ADD COLUMN title_ar TEXT,
ADD COLUMN title_ru TEXT,
ADD COLUMN title_de TEXT,
ADD COLUMN content_ar TEXT,
ADD COLUMN content_ru TEXT,
ADD COLUMN content_de TEXT,
ADD COLUMN excerpt_ar TEXT,
ADD COLUMN excerpt_ru TEXT,
ADD COLUMN excerpt_de TEXT;

-- Add language-specific columns to system_motivators table
ALTER TABLE public.system_motivators
ADD COLUMN title_ar TEXT,
ADD COLUMN title_ru TEXT,
ADD COLUMN title_de TEXT,
ADD COLUMN content_ar TEXT,
ADD COLUMN content_ru TEXT,
ADD COLUMN content_de TEXT;

-- Add language-specific columns to faqs table
ALTER TABLE public.faqs
ADD COLUMN question_ar TEXT,
ADD COLUMN question_ru TEXT,
ADD COLUMN question_de TEXT,
ADD COLUMN answer_ar TEXT,
ADD COLUMN answer_ru TEXT,
ADD COLUMN answer_de TEXT;

-- Create translation status tracking table
CREATE TABLE public.translation_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  language_code TEXT NOT NULL,
  field_name TEXT NOT NULL,
  translation_status TEXT NOT NULL DEFAULT 'pending',
  translated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(table_name, record_id, language_code, field_name)
);

-- Enable RLS on translation_status table
ALTER TABLE public.translation_status ENABLE ROW LEVEL SECURITY;

-- Create policies for translation_status table
CREATE POLICY "Admins can manage translation status"
ON public.translation_status
FOR ALL
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

CREATE POLICY "Anyone can view translation status"
ON public.translation_status
FOR SELECT
USING (true);

-- Add trigger for updating updated_at
CREATE TRIGGER update_translation_status_updated_at
BEFORE UPDATE ON public.translation_status
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();