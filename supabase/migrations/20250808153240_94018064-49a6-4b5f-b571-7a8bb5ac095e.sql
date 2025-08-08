-- Remove fake content that was added
DELETE FROM testimonials WHERE author_name IN ('Sarah Chen', 'Mike Rodriguez', 'Jessica Park');
DELETE FROM social_proof WHERE source_name IN ('App Store', 'Users Worldwide', 'Weight Lost', 'Success Stories');
DELETE FROM home_steps WHERE title IN ('Set Your Goal', 'Track Everything', 'Stay Motivated');