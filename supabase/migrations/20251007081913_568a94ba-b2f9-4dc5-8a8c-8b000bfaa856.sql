-- Create admins table for admin authentication
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create comments table for product reviews
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT comments_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admins table
CREATE POLICY "Admins can view their own data"
ON public.admins
FOR SELECT
USING (auth.email() = email);

-- RLS Policies for testimonials table
CREATE POLICY "Testimonials are viewable by everyone"
ON public.testimonials
FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert testimonials"
ON public.testimonials
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins WHERE email = auth.email()
  )
);

CREATE POLICY "Only admins can update testimonials"
ON public.testimonials
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admins WHERE email = auth.email()
  )
);

CREATE POLICY "Only admins can delete testimonials"
ON public.testimonials
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.admins WHERE email = auth.email()
  )
);

-- RLS Policies for comments table
CREATE POLICY "Comments are viewable by everyone"
ON public.comments
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert comments"
ON public.comments
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only admins can update comments"
ON public.comments
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admins WHERE email = auth.email()
  )
);

CREATE POLICY "Only admins can delete comments"
ON public.comments
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.admins WHERE email = auth.email()
  )
);

-- Update RLS policies for products to allow admin operations
CREATE POLICY "Only admins can insert products"
ON public.products
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins WHERE email = auth.email()
  )
);

CREATE POLICY "Only admins can update products"
ON public.products
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admins WHERE email = auth.email()
  )
);

CREATE POLICY "Only admins can delete products"
ON public.products
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.admins WHERE email = auth.email()
  )
);

-- Update RLS policies for inquiries to allow admin operations
CREATE POLICY "Only admins can view inquiries"
ON public.inquiries
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admins WHERE email = auth.email()
  )
);

CREATE POLICY "Only admins can update inquiries"
ON public.inquiries
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admins WHERE email = auth.email()
  )
);

CREATE POLICY "Only admins can delete inquiries"
ON public.inquiries
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.admins WHERE email = auth.email()
  )
);

-- Insert a default admin (you can change this email later)
INSERT INTO public.admins (email) VALUES ('admin@doshihardware.com');