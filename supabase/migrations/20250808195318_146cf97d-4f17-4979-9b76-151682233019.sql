-- Add missing FastNow Protocol phase content fields to site_settings
INSERT INTO site_settings (setting_key, setting_value) VALUES 
-- SEO fields
('protocol_meta_title', '""'),
('protocol_meta_description', '""'),

-- Phase 1 fields
('protocol_phase1_title', '"3-Day Initiation Water Fast"'),
('protocol_phase1_duration', '"72 hours (3 full days). My personal sweet spot is 60 hours."'),
('protocol_phase1_purpose', '"Flip the fat-burning switch (ketosis), break the carb/insulin cycle, dump water for momentum, and set the stage so Phase 2 actually works."'),
('protocol_phase1_instructions', '"Drink water and black coffee. No food."'),
('protocol_phase1_details', '"Day 1 / Night 1: most people can push through; you''re mostly burning stored sugar.\n\nDay 2 / Night 2: this is the test. Sleep often goes bad, cravings scream, and you negotiate with yourself. Anyone who has quit a serious habit knows this night. Make it through Night 2 and you''ve done the real work; this is where the shift happens.\n\n60 hours is my ignite point. Some go to 72. Past 60, everything else becomes child''s play compared to Night 2."'),

-- Phase 2 fields
('protocol_phase2_title', '"Strict Simple Diet + Daily Calorie Limit"'),
('protocol_phase2_duration', '"30–60 days minimum."'),
('protocol_phase2_carb_cap', '"≤ 20–30g net carbs/day."'),
('protocol_phase2_deficit', '"~1,000 kcal"'),
('protocol_phase2_why_deficit', '"Because you need visible progress fast to keep going. With 250–500 kcal/day, a tiny misstep erases a week, clothes don''t change, and motivation dies right when you need proof it''s working. A bigger daily deficit gives you results you can feel in weeks 1–3, not in a year."'),
('protocol_phase2_how_to_set', '"Baseline burn (BMR): from sex, age, height, weight.\nAdd activity: almost none / light / medium / high (daily life can add ~300–500+ kcal).\nIntake: (BMR + activity) – 1,000 = your calories to eat.\nExample: total burn ≈ 2,500 → eat ≈ 1,500 kcal"'),
('protocol_phase2_what_to_eat', '"OK: cheese, sausage, eggs, cold cuts, fish, meat; cucumbers, pickles, plain yogurt.\nDrinks: water, coffee. I personally use Coke Zero / Pepsi Max / Cola Light.\nAvoid: bread, rice, noodles, potatoes, fruit, carrots, tomatoes, oil, and everything else outside the above list."'),
('protocol_phase2_tracking', '"Track every single thing—in the app or on paper. If you \"keep it in your head,\" you will drift. Example: you do everything right, then at night you add a salmon steak \"because it''s healthy.\" You just blew 600–700 kcal, and your perfect day became a 300 kcal deficit."'),
('protocol_phase2_recovery', '"If you overeat, you still have Phase 3. Walk it off to claw back the deficit the same day."'),

-- Phase 3 fields
('protocol_phase3_title', '"Daily Walking"'),
('protocol_phase3_rule', '"1.5 hours every day (non-negotiable)."'),
('protocol_phase3_why', '"~500 kcal/day for many people, better mood, stable energy, and it''s the simplest thing most people will actually do consistently."'),
('protocol_phase3_how_to_fit', '"Split it up: 45 minutes in the morning, 45 minutes in the evening. Listen to podcasts, audiobooks, or music. Make it your thinking time."')

ON CONFLICT (setting_key) DO UPDATE SET
setting_value = EXCLUDED.setting_value;