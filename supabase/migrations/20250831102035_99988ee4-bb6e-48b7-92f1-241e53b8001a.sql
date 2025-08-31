-- Create universal coupon code for 90-day trial promotion
INSERT INTO public.coupon_codes (
  code, 
  duration_days, 
  description, 
  is_active, 
  expires_at,
  usage_limit,
  used_count
) VALUES (
  'FASTNOW90',
  90,
  'Universal 90-day trial promotion code',
  true,
  '2024-12-31 23:59:59'::timestamp with time zone,
  NULL, -- No usage limit
  0
) 
ON CONFLICT (code) DO UPDATE SET
  duration_days = 90,
  description = 'Universal 90-day trial promotion code',
  is_active = true,
  expires_at = '2024-12-31 23:59:59'::timestamp with time zone,
  updated_at = now();