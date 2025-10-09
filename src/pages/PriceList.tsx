import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PriceList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products, isLoading } = useQuery({
    queryKey: ['products-price-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group products by category
  const groupedProducts = filteredProducts?.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Price List</h1>
            <p className="text-xl opacity-90">Current pricing for all our building materials</p>
          </div>
        </section>

        {/* Price List Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Search and Download */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="md:w-auto">
                <Download className="mr-2 h-5 w-5" />
                Download PDF
              </Button>
            </div>

            {/* Price Table */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : groupedProducts && Object.keys(groupedProducts).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                  <div key={category} className="bg-card rounded-lg overflow-hidden shadow-md">
                    <div className="bg-primary px-6 py-4">
                      <h2 className="text-2xl font-bold text-primary-foreground">{category}</h2>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50%]">Product Name</TableHead>
                          <TableHead className="w-[35%]">Description</TableHead>
                          <TableHead className="text-right">Price (KSh)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryProducts?.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="text-muted-foreground">{product.description || '-'}</TableCell>
                            <TableCell className="text-right font-semibold text-primary">
                              {product.price.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No products found.</p>
              </div>
            )}

            {/* Pricing Note */}
            <div className="mt-8 p-6 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Prices are subject to change without notice. Delivery charges apply and vary by location. 
                For bulk orders and special discounts, please contact us directly at +254 762 644 702 or stepnjoroge0@gmail.com
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PriceList;
