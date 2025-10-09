-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create inquiries table for contact form submissions
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable (no auth required for customers to browse)
CREATE POLICY "Products are viewable by everyone"
ON public.products
FOR SELECT
USING (true);

-- Inquiries can be inserted by anyone (public contact form)
CREATE POLICY "Anyone can submit inquiries"
ON public.inquiries
FOR INSERT
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on products
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products for Doshi Hardware Stores
INSERT INTO public.products (name, category, price, description, is_featured) VALUES
('Water Tank 1000L', 'Water Tanks', 8500.00, 'High-quality polyethylene water storage tank, 1000 liters capacity', true),
('Water Tank 500L', 'Water Tanks', 4800.00, 'Durable 500L water tank for residential use', false),
('Portland Cement 50kg', 'Cement', 650.00, 'Premium quality Portland cement, 50kg bag', true),
('Steel Bars 12mm', 'Steel & Iron', 850.00, 'High tensile steel reinforcement bars, 12mm diameter', false),
('Roofing Sheets - Mabati', 'Roofing', 1200.00, 'Galvanized corrugated iron sheets, 8ft length', true),
('Paint - Exterior 20L', 'Paint', 4500.00, 'Weather-resistant exterior paint, 20 liters', false),
('Tiles - Ceramic Floor', 'Tiles', 1800.00, 'Ceramic floor tiles per square meter', false),
('PVC Pipes 4"', 'Plumbing', 450.00, 'PVC drainage pipes, 4 inch diameter', false),
('Wire Mesh Roll', 'Fencing', 3200.00, 'Galvanized wire mesh, 30m roll', false),
('Sand - per Ton', 'Building Materials', 2500.00, 'Construction grade sand, delivered per ton', false);