/*
  # Fix workshop settings public access

  1. Security Changes
    - Update RLS policy on `workshop_settings` table to allow public read access
    - This enables loading workshop settings (theme, name, etc.) on the auth page before login
    - Maintains write restrictions for authenticated users only

  2. Changes Made
    - Drop existing restrictive SELECT policy
    - Create new public SELECT policy allowing anyone to read workshop settings
    - Keep existing management policy for authenticated users only
*/

-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view workshop settings" ON public.workshop_settings;

-- Create new policy allowing public read access to workshop settings
CREATE POLICY "Anyone can view workshop settings" 
ON public.workshop_settings 
FOR SELECT 
USING (true);