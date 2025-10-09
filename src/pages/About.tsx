import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Award, Users, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">About Doshi Hardware</h1>
            <p className="text-xl opacity-90">Building trust, one project at a time</p>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Established in 1985, Doshi Hardware Stores Ltd. has been serving the construction industry in Kenya for nearly four decades. 
                What started as a small family business has grown into one of the most trusted suppliers of building materials in the region.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We pride ourselves on offering quality products, competitive prices, and exceptional customer service. 
                Our commitment to excellence has made us the preferred choice for contractors, builders, and homeowners across Kenya.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-primary mb-2">38+</div>
                  <div className="text-sm text-muted-foreground">Years in Business</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-primary mb-2">5000+</div>
                  <div className="text-sm text-muted-foreground">Satisfied Customers</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-primary mb-2">200+</div>
                  <div className="text-sm text-muted-foreground">Product Range</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-primary mb-2">1</div>
                  <div className="text-sm text-muted-foreground">Main Location</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To provide high-quality building materials and exceptional service to our customers, 
                    enabling them to complete their construction projects successfully while maintaining 
                    the highest standards of quality and affordability.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To be the leading supplier of building materials in Kenya, known for our reliability, 
                    quality products, and customer-first approach. We aim to contribute to the growth of 
                    Kenya's construction industry through innovation and excellence.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Visit Our Store</h2>
              <p className="text-xl text-muted-foreground">Located in the heart of Nairobi's Industrial Area</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Our Address
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Doshi Hardware Stores Ltd.<br />
                        Nairobi Road, Industrial Area<br />
                        Nairobi, Kenya
                      </p>
                      
                      <h3 className="text-xl font-bold mb-4 mt-6">Business Hours</h3>
                      <div className="space-y-2 text-muted-foreground">
                        <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                        <p>Saturday: 8:00 AM - 4:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>

                    <div className="h-[300px] bg-muted rounded-lg overflow-hidden">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819694452577!2d36.82194631475394!3d-1.2823104359779947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d6e715d3e9%3A0x7a8b0c3d4e5f6a7b!2sIndustrial%20Area%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1234567890123!5m2!1sen!2ske"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Doshi Hardware Location"
                      ></iframe>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
