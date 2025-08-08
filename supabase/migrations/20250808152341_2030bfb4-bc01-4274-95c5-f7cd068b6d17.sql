-- Add sample data for the new sections
INSERT INTO home_steps (title, description, icon_name, display_order, is_active) VALUES
('Set Your Goal', 'Define your target weight and timeline for sustainable results that last.', 'target', 1, true),
('Track Everything', 'Log your fasting windows, food intake, and progress with precision.', 'activity', 2, true),
('Stay Motivated', 'Access powerful motivators and timeline insights to push through challenges.', 'rocket', 3, true);

INSERT INTO testimonials (author_name, author_role, content, rating, display_order, is_active) VALUES
('Sarah Chen', 'Working Mom', 'I lost 35 pounds in 4 months using FastNow. The fasting timer and food logging made all the difference. Finally, something that actually works!', 5, 1, true),
('Mike Rodriguez', 'Software Engineer', 'As someone who struggled with late-night eating, the protocol helped me break bad habits. Down 28 pounds and feeling incredible.', 5, 2, true),
('Jessica Park', 'Fitness Enthusiast', 'FastNow cut through all the noise. No BS, just results. The walking tracker motivated me to stay active during fasting windows.', 5, 3, true);

INSERT INTO social_proof (source_name, metric_value, metric_label, display_order, is_active) VALUES
('App Store', '4.8', 'star rating', 1, true),
('Users Worldwide', '50,000+', 'active users', 2, true),
('Weight Lost', '500,000+', 'pounds lost', 3, true),
('Success Stories', '95%', 'see results', 4, true);