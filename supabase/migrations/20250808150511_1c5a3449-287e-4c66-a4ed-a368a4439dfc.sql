-- Create homepage structured content tables

-- 1) Home steps (How it works)
CREATE TABLE IF NOT EXISTS public.home_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  icon_name text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE public.home_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage home steps"
ON public.home_steps
FOR ALL
TO public
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active home steps"
ON public.home_steps
FOR SELECT
TO public
USING (is_active = true);

CREATE TRIGGER update_home_steps_updated_at
BEFORE UPDATE ON public.home_steps
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  author_name text NOT NULL,
  author_role text,
  content text NOT NULL,
  rating integer DEFAULT 5,
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage testimonials"
ON public.testimonials
FOR ALL
TO public
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active testimonials"
ON public.testimonials
FOR SELECT
TO public
USING (is_active = true);

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Social proof metrics strip
CREATE TABLE IF NOT EXISTS public.social_proof (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  source_name text NOT NULL,
  metric_value text NOT NULL,
  metric_label text NOT NULL,
  logo_url text,
  url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE public.social_proof ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage social proof"
ON public.social_proof
FOR ALL
TO public
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active social proof"
ON public.social_proof
FOR SELECT
TO public
USING (is_active = true);

CREATE TRIGGER update_social_proof_updated_at
BEFORE UPDATE ON public.social_proof
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();