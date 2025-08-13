-- Add image fields to FAQs table
ALTER TABLE public.faqs 
ADD COLUMN image_url text,
ADD COLUMN image_alignment text DEFAULT 'left' CHECK (image_alignment IN ('left', 'right'));