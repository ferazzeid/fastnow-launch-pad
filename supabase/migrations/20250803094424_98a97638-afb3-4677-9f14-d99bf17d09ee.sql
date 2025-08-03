-- Create storage policies for website-images bucket to allow uploads
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Website images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload website images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update website images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete website images" ON storage.objects;

-- Create comprehensive policies for website-images bucket
CREATE POLICY "Website images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'website-images');

CREATE POLICY "Anyone can upload website images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'website-images');

CREATE POLICY "Anyone can update website images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'website-images');

CREATE POLICY "Anyone can delete website images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'website-images');