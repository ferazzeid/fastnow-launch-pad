-- Add column to FAQs table to track if item should be open by default
ALTER TABLE public.faqs 
ADD COLUMN show_open_by_default BOOLEAN DEFAULT false;