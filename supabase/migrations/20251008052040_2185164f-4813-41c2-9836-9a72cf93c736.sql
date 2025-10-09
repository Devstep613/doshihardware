-- Make product_id nullable for general reviews (not tied to specific products)
ALTER TABLE public.comments 
ALTER COLUMN product_id DROP NOT NULL;

-- Drop the existing foreign key constraint
ALTER TABLE public.comments 
DROP CONSTRAINT IF EXISTS comments_product_id_fkey;

-- Add the foreign key constraint back with NULL allowed
ALTER TABLE public.comments 
ADD CONSTRAINT comments_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES public.products(id) 
ON DELETE CASCADE;