-- Fix motivators table by adding missing columns if they don't exist
DO $$ 
BEGIN
    -- Add male_image_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'motivators' AND column_name = 'male_image_url'
    ) THEN
        ALTER TABLE motivators ADD COLUMN male_image_url TEXT;
    END IF;
    
    -- Add female_image_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'motivators' AND column_name = 'female_image_url'
    ) THEN
        ALTER TABLE motivators ADD COLUMN female_image_url TEXT;
    END IF;
END $$;

-- Create calculator_settings table for background management
CREATE TABLE IF NOT EXISTS calculator_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculator_type TEXT NOT NULL UNIQUE,
    background_image_url TEXT,
    background_color TEXT DEFAULT '#ffffff',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE calculator_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for calculator settings
CREATE POLICY "Anyone can view calculator settings"
ON calculator_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can manage calculator settings"
ON calculator_settings FOR ALL
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Insert default calculator settings
INSERT INTO calculator_settings (calculator_type, background_color) 
VALUES 
    ('walking', '#f8fafc'),
    ('weight_loss', '#f8fafc')
ON CONFLICT (calculator_type) DO NOTHING;

-- Create update trigger for calculator_settings
CREATE OR REPLACE FUNCTION update_calculator_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_calculator_settings_updated_at
    BEFORE UPDATE ON calculator_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_calculator_settings_updated_at();