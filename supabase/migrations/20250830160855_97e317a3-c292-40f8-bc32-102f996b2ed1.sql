-- Ensure public access to published blog posts for sitemap generation
-- Drop existing policy if it exists and recreate it to ensure it works properly
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;

-- Create a clear public policy for published blog posts
CREATE POLICY "Public read access to published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published');

-- Also ensure the same for fasting timeline posts for completeness
DROP POLICY IF EXISTS "Anyone can view published timeline posts" ON public.fasting_timeline_posts;

CREATE POLICY "Public read access to published timeline posts" 
ON public.fasting_timeline_posts 
FOR SELECT 
USING (status = 'published');