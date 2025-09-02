-- Fix data contamination: Make all user motivators private
UPDATE public.motivators 
SET is_published = false, updated_at = now()
WHERE user_id IS NOT NULL;

-- Drop the problematic RLS policy that allows public access to user motivators
DROP POLICY IF EXISTS "Anyone can view published motivators" ON public.motivators;

-- Create a safer RLS policy that ensures user motivators are never public
CREATE POLICY "Public can only view system motivators" 
ON public.motivators 
FOR SELECT 
USING (false); -- Block all public access to user motivators table

-- Keep existing policies for users and admins
-- Users can still manage their own motivators (existing policy)
-- Admins can still view all motivators (existing policy)