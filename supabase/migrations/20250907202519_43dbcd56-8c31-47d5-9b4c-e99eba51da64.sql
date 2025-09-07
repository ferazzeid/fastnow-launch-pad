-- Initialize content for the three FastNow Protocol sub-pages
INSERT INTO page_content (page_key, title, subtitle, content, meta_title, meta_description, is_published)
VALUES 
(
  'water-fast-protocol',
  '3-Day Initiation Water Fast',
  'Flip the fat-burning switch and break the carb/insulin cycle',
  'Night Zero: The easiest to start a water fast is to start at night after eating and then go to sleep and that''s the first 10 hours of fasting that you have under your belt and that creates momentum to continue next day.

Day 1 / Night 1: most people can push through; you''re mostly burning stored sugar.

Day 2 / Night 2: this is the test. Sleep often goes bad, cravings scream, and you negotiate with yourself. Anyone who has quit a serious habit knows this night. Make it through Night 2 and you''ve done the real work; this is where the shift happens.

Duration: 60 hours

Purpose: Flip the fat-burning switch (ketosis), break the carb/insulin cycle, dump water for momentum, and set the stage so Phase 2 actually works.

Instructions: Drink water and black coffee. No food.',
  'Water Fast Protocol - 3-Day Initiation Fast | FastNow',
  'Learn how to complete a safe 3-day water fast to kickstart ketosis and break the carb/insulin cycle with the FastNow Protocol.',
  true
),
(
  'calorie-limitation-protocol', 
  'Strict Simple Diet',
  'Achieve rapid visible progress with strategic calorie control',
  'Duration: 30–60 days minimum.

Calorie Cap: 1500 calories or 2000 if you walk that day 90 minutes

Carb Cap: ≤ 30g net carbs/day.

Deficit: Calorie deficit ideally 1000 calories (120 grams of fat)

Why This Deficit: Because you need visible progress fast to keep going. With 250–500 kcal/day, a tiny misstep erases a week, clothes don''t change, and motivation dies right when you need proof it''s working. A bigger daily deficit gives you results you can feel in weeks 1–3, not in a year.

How to Set: Baseline burn (BMR): from sex, age, height, weight.
Add activity: almost none / light / medium / high (daily life can add ~300–500+ kcal).
Intake: (BMR + activity) – 1,000 = your calories to eat.
Example: total burn ≈ 2,500 → eat ≈ 1,500 kcal

What to Eat: OK: cheese, sausage, eggs, cold cuts, fish, meat; cucumbers, pickles, plain yogurt.
Drinks: water, coffee. I personally use Coke Zero / Pepsi Max / Cola Light.
Avoid: bread, rice, noodles, potatoes, fruit, carrots, tomatoes, oil, and everything else outside the above list.

Tracking: Track every single thing—in the app or on paper. If you "keep it in your head," you will drift. Example: you do everything right, then at night you add a salmon steak "because it''s healthy." You just blew 600–700 kcal, and your perfect day became a 300 kcal deficit.

Recovery: If you overeat, you still have Phase 3. Walk it off to claw back the deficit the same day.',
  'Calorie Limitation Protocol - Strict Simple Diet | FastNow',
  'Master the calorie limitation phase of the FastNow Protocol with strategic food choices and precise tracking for rapid fat loss.',
  true
),
(
  'walking-protocol',
  'Daily Walking',
  'The simple, sustainable exercise that actually works',
  'Rule: 90 minutes every day (non-negotiable).

Why: ~500 kcal/day for many people, better mood, stable energy, and it''s the simplest thing most people will actually do consistently.

Benefits of Daily Walking:
- Burns approximately 500 calories per day for most people
- Improves mood and mental clarity
- Provides stable, sustained energy throughout the day
- Easy to maintain consistency compared to intense workouts
- Low impact on joints and muscles
- Can be done anywhere, anytime
- Helps with digestion and metabolism
- Reduces stress and anxiety
- Improves sleep quality

Tips for Success:
- Start your walk at the same time each day to build habit
- Listen to podcasts, music, or audiobooks to make it enjoyable
- Use a step counter or walking app to track progress
- Find walking routes you enjoy - parks, neighborhoods, malls
- Walk with a friend or family member for accountability
- Break it into smaller chunks if needed (3 x 30 minutes)
- Walk faster to increase calorie burn
- Use walking as active recovery on rest days from other exercise

Remember: This isn''t about intensity - it''s about consistency. The goal is to make walking so automatic that you don''t even think about it.',
  'Walking Protocol - Daily 90-Minute Walks | FastNow',
  'Discover why daily 90-minute walks are the cornerstone of the FastNow Protocol and how to make walking a sustainable habit.',
  true
)
ON CONFLICT (page_key) DO NOTHING;