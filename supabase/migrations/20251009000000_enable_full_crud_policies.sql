-- Enable full CRUD operations for all tables without restrictions (hobby project)

-- Products table
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Allow all operations on products"
ON public.products
FOR ALL
USING (true)
WITH CHECK (true);

-- Testimonials table
DROP POLICY IF EXISTS "Allow public select on testimonials" ON public.testimonials;
CREATE POLICY "Allow all operations on testimonials"
ON public.testimonials
FOR ALL
USING (true)
WITH CHECK (true);

-- Comments table (reviews)
DROP POLICY IF EXISTS "Allow public select on comments" ON public.comments;
DROP POLICY IF EXISTS "Allow public insert on comments" ON public.comments;
CREATE POLICY "Allow all operations on comments"
ON public.comments
FOR ALL
USING (true)
WITH CHECK (true);

-- Inquiries table
DROP POLICY IF EXISTS "Anyone can submit inquiries" ON public.inquiries;
CREATE POLICY "Allow all operations on inquiries"
ON public.inquiries
FOR ALL
USING (true)
WITH CHECK (true);
