-- Add page_category field to faqs table for categorizing FAQs
ALTER TABLE public.faqs 
ADD COLUMN page_category text DEFAULT 'general';