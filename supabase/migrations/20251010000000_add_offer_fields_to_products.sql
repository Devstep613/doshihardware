-- Add offer-related columns to products table
ALTER TABLE public.products
ADD COLUMN is_on_offer BOOLEAN DEFAULT false,
ADD COLUMN original_price DECIMAL(10, 2),
ADD COLUMN discount_price DECIMAL(10, 2),
ADD COLUMN offer_end_date TIMESTAMP WITH TIME ZONE;

-- Update existing policies to include new columns (no changes needed as policies are permissive)
