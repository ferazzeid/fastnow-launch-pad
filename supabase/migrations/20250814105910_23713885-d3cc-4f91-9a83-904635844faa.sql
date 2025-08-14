-- Create ring bell gallery items table
CREATE TABLE public.ring_bell_gallery_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_position integer NOT NULL CHECK (order_position >= 1 AND order_position <= 9),
  initial_state text NOT NULL CHECK (initial_state IN ('image', 'text')) DEFAULT 'image',
  front_image_url text,
  front_text text,
  back_image_url text,
  back_text text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(order_position)
);

-- Enable Row Level Security
ALTER TABLE public.ring_bell_gallery_items ENABLE ROW LEVEL SECURITY;

-- Create policies for ring bell gallery items
CREATE POLICY "Admins can manage ring bell gallery items" 
ON public.ring_bell_gallery_items 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active ring bell gallery items" 
ON public.ring_bell_gallery_items 
FOR SELECT 
USING (is_active = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ring_bell_gallery_items_updated_at
BEFORE UPDATE ON public.ring_bell_gallery_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();