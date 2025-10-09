-- Create admins table
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to select from admins (for checking if user is admin)
CREATE POLICY "Allow authenticated select on admins"
ON public.admins
FOR SELECT
USING (auth.role() = 'authenticated');

-- Insert initial admin (replace with actual admin email)
INSERT INTO public.admins (email) VALUES ('admin@example.com');
