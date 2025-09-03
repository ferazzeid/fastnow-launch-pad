-- Clean up duplicate admin_goal_ideas from shared_settings
-- This data is now served from system_motivators table as single source of truth
DELETE FROM shared_settings WHERE setting_key = 'admin_goal_ideas';