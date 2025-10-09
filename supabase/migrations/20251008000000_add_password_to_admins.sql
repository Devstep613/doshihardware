-- Add password column to admins table
ALTER TABLE public.admins ADD COLUMN password TEXT;

-- Set default password for existing admin (change this after migration)
UPDATE public.admins SET password = 'admin123' WHERE email = 'admin@doshihardware.com';
