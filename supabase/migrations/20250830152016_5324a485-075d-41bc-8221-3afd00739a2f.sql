-- Fix the is_current_user_admin function to use the correct user_roles table
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id_val uuid;
  admin_status boolean DEFAULT false;
BEGIN
  -- Get the current user ID
  user_id_val := auth.uid();
  
  -- If no user ID, return false
  IF user_id_val IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user has admin role in user_roles table
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = user_id_val 
    AND role = 'admin'
  ) INTO admin_status;
  
  -- Return the result
  RETURN admin_status;
END;
$$;