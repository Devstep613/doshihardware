import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageCircle, ArrowRight, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import heroImage from "@/assets/hero-hardware.jpg";
import waterTanksImg from "@/assets/products/water-tanks.jpg";
import cementImg from "@/assets/products/cement.jpg";
import roofingImg from "@/assets/products/roofing.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoriesSection from "@/components/CategoriesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import LocationMap from "@/components/LocationMap";
import CountdownTimer from "@/components/CountdownTimer";

const Home = () => {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  const { data: offerProducts, isLoading: offerLoading } = useQuery({
    queryKey: ['offer-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_on_offer', true)
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  const productImages: Record<string, string> = {
    'Water Tanks': waterTanksImg,
    'Cement': cementImg,
    'Roofing': roofingImg,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Quality Building Materials<br />
            <span className="text-primary">You Can Trust</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            From water tanks to cement, roofing to steel - everything you need for your construction project
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="text-lg shadow-lg">
                Browse Products <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="https://wa.me/+254107500245">
              <Button size="lg" variant="outline" className="text-lg bg-white/10 backdrop-blur border-white text-white hover:bg-white hover:text-primary">
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      <CategoriesSection />

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-xl text-muted-foreground">Top quality materials at competitive prices</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : featuredProducts?.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-56 overflow-hidden bg-muted relative">
                  <img
                    src={product.image_url || productImages[product.category] || waterTanksImg}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      KSh {product.price.toLocaleString()}
                    </span>
                    <Link to="/contact">
                      <Button>Contact to Buy</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline">
                View All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* On Offer Products */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">On Offer</h2>
            <p className="text-xl text-white/90">Limited time deals on premium building materials</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offerLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : offerProducts?.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow bg-white">
                <div className="h-56 overflow-hidden bg-muted relative">
                  <img
                    src={product.image_url || productImages[product.category] || waterTanksImg}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                  {product.offer_end_date && (
                    <div className="mt-2">
                      <CountdownTimer endDate={product.offer_end_date} />
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {product.original_price && (
                        <span className="text-lg line-through text-gray-500">
                          KSh {product.original_price.toLocaleString()}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-primary">
                        KSh {product.discount_price?.toLocaleString() || product.price.toLocaleString()}
                      </span>
                    </div>
                    <Link to="/contact">
                      <Button>Buy Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/offers">
              <Button size="lg" variant="outline" className="bg-white text-black hover:bg-gray-100">
                View All Offers <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Doshi Hardware?</h2>
            <p className="text-xl text-muted-foreground">Trusted by builders across Kenya</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Quality Guaranteed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We source only the best materials from trusted manufacturers to ensure your project's success.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Competitive Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fair, transparent pricing with no hidden costs. We offer the best value for your money.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Expert Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our knowledgeable team is here to help you choose the right materials for your project.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <ReviewsSection />

      <FAQSection />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 opacity-90">Get in touch with us today for a quote or to discuss your requirements</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="text-lg">
                Contact Us Now
              </Button>
            </Link>
            <a href="tel:+254107500245">
              <Button size="lg" variant="outline" className="text-lg bg-white/10 backdrop-blur border-white text-white hover:bg-white hover:text-primary">
                <Phone className="mr-2 h-5 w-5" />
                Call +254 107 500 245 / +254 753 249 744
              </Button>
            </a>
          </div>
        </div>
      </section>

      <LocationMap />

      <Footer />

      <WhatsAppButton />
    </div>
  );
};

export default Home;
