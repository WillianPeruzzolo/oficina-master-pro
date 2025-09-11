-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin user already exists
  SELECT auth.uid() INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@procar.com' 
  LIMIT 1;
  
  -- If admin doesn't exist, we'll create the profile entry
  -- Note: The actual user creation needs to be done through the auth.sign_up API
  -- This function just ensures we have the profile setup ready
  
  -- Insert or update workshop settings with default admin info
  INSERT INTO public.workshop_settings (
    workshop_name,
    email,
    phone,
    theme,
    primary_color,
    secondary_color
  ) VALUES (
    'ProCar Oficina',
    'admin@procar.com',
    '(11) 3456-7890',
    'light',
    '#2563eb',
    '#f97316'
  )
  ON CONFLICT (id) DO UPDATE SET
    workshop_name = EXCLUDED.workshop_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;