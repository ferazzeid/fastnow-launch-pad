-- Add custom_url column to navigation_settings table
ALTER TABLE public.navigation_settings 
ADD COLUMN custom_url TEXT;