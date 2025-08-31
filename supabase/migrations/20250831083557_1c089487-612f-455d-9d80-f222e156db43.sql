-- Add missing page SEO settings for all public pages
INSERT INTO page_seo_settings (page_path, page_title, page_description, page_type, is_indexed, robots_directive, is_dynamic) VALUES
('/blog', 'Blog - FastNow.app', 'Read the latest articles about intermittent fasting, health tips, and wellness advice from the FastNow.app team.', 'content', true, 'index, follow', false),
('/about-fastnow-app', 'About App | fastnow.app', 'Learn about the FastNow app - your ultimate companion for intermittent fasting, health tracking, and wellness goals.', 'content', true, 'index, follow', false),
('/fastnow-protocol', 'The FastNow Protocol | FastNow', 'Learn how I lost fat with a 3-day fast plus calorie control using the FastNow Protocol', 'content', true, 'index, follow', false),
('/privacy', 'Privacy Policy - FastNow', 'Read our privacy policy to understand how we protect and handle your personal data.', 'content', true, 'index, follow', false),
('/terms', 'Terms of Service - FastNow', 'Read our terms of service and usage policies for the FastNow application.', 'content', true, 'index, follow', false),
('/contact', 'Contact Us - FastNow', 'Get in touch with us for support, questions, or feedback about FastNow.', 'content', true, 'index, follow', false),
('/blog/[slug]', 'Blog Post', 'Individual blog post pages', 'blog_post', true, 'index, follow', true),
('/fasting-timeline/[hour]', 'Fasting Timeline Hour', 'Individual fasting timeline hour pages', 'timeline_post', true, 'index, follow', true)
ON CONFLICT (page_path) DO UPDATE SET
page_title = EXCLUDED.page_title,
page_description = EXCLUDED.page_description,
page_type = EXCLUDED.page_type,
is_indexed = EXCLUDED.is_indexed,
robots_directive = EXCLUDED.robots_directive,
is_dynamic = EXCLUDED.is_dynamic,
updated_at = now();