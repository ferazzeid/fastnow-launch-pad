-- Pre-populate alt text for existing feature screenshots based on their titles and feature keys
UPDATE feature_screenshots 
SET alt_text = CASE 
  WHEN title IS NOT NULL AND title != '' THEN title || ' - ' || 
    CASE feature_key
      WHEN 'fasting-timer' THEN 'Fasting Timer screenshot showing app interface'
      WHEN 'walking-tracker' THEN 'Walking Tracker screenshot showing app interface'  
      WHEN 'food-log' THEN 'Food Log screenshot showing app interface'
      WHEN 'motivators' THEN 'Motivators screenshot showing app interface'
      ELSE 'App screenshot showing interface'
    END
  ELSE CASE feature_key
    WHEN 'fasting-timer' THEN 'Fasting Timer - App screenshot showing the timer interface'
    WHEN 'walking-tracker' THEN 'Walking Tracker - App screenshot showing the walking tracking interface'
    WHEN 'food-log' THEN 'Food Log - App screenshot showing the food logging interface'
    WHEN 'motivators' THEN 'Motivators - App screenshot showing the motivational content interface'
    ELSE 'App screenshot showing interface'
  END
END
WHERE alt_text IS NULL OR alt_text = '';