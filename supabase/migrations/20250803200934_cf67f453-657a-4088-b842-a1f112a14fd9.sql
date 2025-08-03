-- Create blog_posts table for blog content management
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author TEXT NOT NULL DEFAULT 'FastNow Team',
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create fasting_timeline_posts table for timeline content
CREATE TABLE public.fasting_timeline_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 96),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author TEXT NOT NULL DEFAULT 'FastNow Team',
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  meta_description TEXT,
  meta_keywords TEXT,
  whats_happening TEXT,
  how_youre_feeling TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create fasting_hours table for detailed hour content
CREATE TABLE public.fasting_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 96),
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 4),
  title TEXT NOT NULL,
  body_state TEXT NOT NULL,
  common_feelings TEXT[] DEFAULT '{}',
  encouragement TEXT,
  motivator_tags TEXT[] DEFAULT '{}',
  difficulty TEXT NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'moderate', 'hard', 'extreme')),
  phase TEXT NOT NULL DEFAULT 'preparation' CHECK (phase IN ('preparation', 'initial', 'adaptation', 'ketosis', 'deep_ketosis', 'extended')),
  tips TEXT[] DEFAULT '{}',
  scientific_info TEXT,
  image_url TEXT,
  positive_symptoms TEXT[] DEFAULT '{}',
  challenging_symptoms TEXT[] DEFAULT '{}',
  autophagy_milestone BOOLEAN DEFAULT false,
  ketosis_milestone BOOLEAN DEFAULT false,
  fat_burning_milestone BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(hour)
);

-- Create app_motivators table for user motivational content
CREATE TABLE public.app_motivators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  caption TEXT,
  category TEXT NOT NULL DEFAULT 'personal',
  subcategory TEXT,
  difficulty TEXT NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'moderate', 'hard', 'extreme')),
  timeframe TEXT,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_predefined BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  times_used INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  completed_sessions INTEGER DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fasting_timeline_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fasting_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_motivators ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Anyone can view published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admins can manage all blog posts" 
ON public.blog_posts 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fasting timeline posts policies
CREATE POLICY "Anyone can view published timeline posts" 
ON public.fasting_timeline_posts 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admins can manage all timeline posts" 
ON public.fasting_timeline_posts 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fasting hours policies
CREATE POLICY "Anyone can view fasting hours" 
ON public.fasting_hours 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage fasting hours" 
ON public.fasting_hours 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- App motivators policies
CREATE POLICY "Anyone can view active motivators" 
ON public.app_motivators 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage all motivators" 
ON public.app_motivators 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fasting_timeline_posts_updated_at
  BEFORE UPDATE ON public.fasting_timeline_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fasting_hours_updated_at
  BEFORE UPDATE ON public.fasting_hours
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_motivators_updated_at
  BEFORE UPDATE ON public.app_motivators
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX idx_fasting_timeline_posts_hour ON public.fasting_timeline_posts(hour);
CREATE INDEX idx_fasting_timeline_posts_status ON public.fasting_timeline_posts(status);
CREATE INDEX idx_fasting_hours_hour ON public.fasting_hours(hour);
CREATE INDEX idx_app_motivators_active ON public.app_motivators(is_active);
CREATE INDEX idx_app_motivators_featured ON public.app_motivators(is_featured);