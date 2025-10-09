-- Update RLS policy for admins to allow select for login
DROP POLICY IF EXISTS "Allow authenticated select on admins" ON public.admins;
CREATE POLICY "Allow select on admins for login" ON public.admins FOR SELECT USING (true);
