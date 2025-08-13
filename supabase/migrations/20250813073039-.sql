-- Insert FAQ data for App and Protocol categories
INSERT INTO public.faqs (question, answer, display_order, is_active, page_category) VALUES
-- About the App FAQs
('What is FastNow and how is it different from other fasting or weight loss apps?', 'FastNow is designed specifically for water fasting and aggressive calorie deficits, not gentle intermittent fasting. It focuses on getting visible results quickly (2-12 weeks) rather than slow progress over years. The app tracks everything you need: water fasts, calorie deficits, walking, and personal motivators - all in one place with a clean, distraction-free design.', 1, true, 'app'),

('Can I use FastNow for any style of fasting (intermittent, extended, water-only, etc.)?', 'FastNow is built specifically for water-only fasting, particularly the 3-day (60-hour) initiation fast in our protocol. It''s not designed for intermittent fasting, eating windows, or other fasting styles. The timer counts up or down, tracks your fasting state hour by hour, and provides guidance for extended water fasts.', 2, true, 'app'),

('How does the deficit feature work, and why does it matter?', 'The deficit feature tracks your daily calorie burn vs. intake to show your actual fat loss potential. It matters because small tracking errors can erase days of progress. For example, if you''re aiming for a 1000-calorie deficit but miss-track 300 calories, your results drop by 30%. The app shows exactly how much fat you''re burning each day (roughly 120g per 1000 calorie deficit).', 3, true, 'app'),

('Is there AI involved in FastNow, and how does it work?', 'Yes, FastNow includes AI-assisted food logging and motivator creation. The AI helps you quickly log foods with photos or descriptions, estimates calories and carbs, and helps create personalized motivators. However, you can always manually verify and adjust AI suggestions - the app is designed to work with or without AI features.', 4, true, 'app'),

('What are motivators, and how do they help with progress?', 'Motivators are your personal reasons for taking action - the 3-4 real drivers that made you start this journey. They include photos, detailed descriptions, and emotional connections to keep you focused during difficult moments. You can use them during water fasts, restricted eating, and walks when motivation drops. They''re more powerful than generic inspiration because they''re deeply personal.', 5, true, 'app'),

('Can I use FastNow for free, or is there a paid version?', 'Every new account gets a 7-day trial with full access to everything. After the trial, the Free version includes fasting timer, walking tracker, and motivators. The Premium version ($9/month) unlocks the food log permanently. The Food Log is the most critical tool for success, so Premium is recommended for serious results.', 6, true, 'app'),

('Will FastNow work on my phone or do I need to install anything?', 'FastNow runs in your web browser - no app store download required. It works on any smartphone, tablet, or computer with internet access. For the best experience, add it to your home screen (instructions provided) so it works like a native app with full-screen access and fast startup.', 7, true, 'app'),

('How do I install FastNow like an app on my phone?', 'On Android: Open FastNow in Chrome, tap the menu (⋮), select "Add to Home screen". On iPhone: Open FastNow in Safari, tap the Share button, select "Add to Home Screen". This creates a home screen icon that opens FastNow in full-screen mode, making it feel like a native app without requiring app store installation.', 8, true, 'app'),

-- About the Protocol FAQs  
('Do I need to count calories to make progress with FastNow?', 'Yes, absolutely. Calorie tracking is non-negotiable for reliable results. Even "healthy" foods can sabotage your deficit - a single extra salmon steak (600-700 calories) can turn a perfect 1000-calorie deficit day into a measly 300-calorie deficit. Small tracking errors compound quickly. The app makes this easier, but even paper tracking works if you''re consistent.', 1, true, 'protocol'),

('Do I need to log everything I eat and do every single day?', 'Yes, every single thing. If you "keep it in your head," you will drift and underestimate intake. This isn''t permanent - just during the aggressive phase (30-90 days). Once you hit your goals and understand portion sizes, you can ease up. But during fat loss, precision matters more than convenience.', 2, true, 'protocol'),

('What foods are allowed in the FastNow Protocol?', 'Allowed: cheese, sausage, eggs, cold cuts, fish, meat, cucumbers, pickles, plain yogurt, water, black coffee. Drinks: water, coffee, diet sodas (I personally use Coke Zero). Avoid: bread, rice, noodles, potatoes, fruit, carrots, tomatoes, oil, and basically everything else outside the allowed list. Keep it simple.', 3, true, 'protocol'),

('The suggested food list is very restrictive. Why is that, and is it really feasible to eat like that?', 'It''s restrictive by design to eliminate decision fatigue and hidden calories. When you''re operating on a 1000+ calorie deficit, there''s no room for error. Complex food combinations make tracking harder and increase the chance of overshooting calories. Simple foods = predictable results. It''s absolutely feasible for 30-90 days, and many people find they prefer eating simply.', 4, true, 'protocol'),

('What about fruits? Aren''t fruits healthy? Why are fruits not part of this protocol?', 'Fruits are healthy in a maintenance context, but they''re problematic for aggressive fat loss. They''re high in natural sugars (carbs), trigger cravings, and take up calorie space that protein needs to fill. During this protocol, every calorie needs to work toward satiety and muscle preservation. You can add fruits back once you reach your goal weight.', 5, true, 'protocol'),

('What about liquids and drinking in general during the water fast or during restricted eating?', 'During water fasting: water and black coffee only. No calories whatsoever. During eating phases: water, black coffee, and diet sodas are fine (I drink Coke Zero daily). Avoid fruit juices, alcohol, milk, or anything with calories. Stay hydrated but don''t complicate it. Plain water should be your primary drink.', 6, true, 'protocol'),

('What are good motivators you would recommend?', 'The best motivators are deeply personal: specific clothes you want to wear again, upcoming events (weddings, vacations), health scares that shook you, or honest photos showing where you are now. Avoid generic motivation. Include both positive drivers (goals, dreams) and difficult truths (health risks, past criticism). Real photos of yourself work better than AI-generated images.', 7, true, 'protocol'),

('Why do you recommend not weighing yourself and instead use clothes as your progress measurement?', 'Daily weight fluctuates 1-3 kg due to water, sodium, hormones, and timing - this masks real fat loss and kills motivation. Clothes don''t lie. When pants get loose or shirts fit better, you''ve lost actual fat. Weight can stay the same while you lose fat and gain muscle. Use the scale weekly maximum, but trust how clothes fit as your primary progress indicator.', 8, true, 'protocol'),

('What kind of results can you expect, and in what kind of timeframe on average?', 'Realistic target: 1 kg per week with aggressive consistency. That''s roughly 12 kg in 3 months (90 days) - a massive change. If you start overweight/obese and maintain a 1000-calorie deficit plus daily walking, you may lose even more. The first 3-day fast provides extra water weight loss for momentum. Most people settle around 1500 calories daily for steady loss while occasionally going higher (1800-2000) when balanced with walking.', 9, true, 'protocol');

-- Hide the standalone FAQ page from navigation
UPDATE public.navigation_settings 
SET is_visible = false 
WHERE page_key = 'faq';