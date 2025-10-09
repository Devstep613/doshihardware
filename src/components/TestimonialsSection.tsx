import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";

const TestimonialsSection = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      return data;
    },
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-xl text-muted-foreground">Trusted by Builders Across Kenya</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : testimonials?.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <blockquote className="text-muted-foreground mb-4 italic">
                  "{testimonial.message}"
                </blockquote>
                <cite className="font-semibold text-primary">
                  {testimonial.name}
                </cite>
              </CardContent>
            </Card>
          )) || (
            // Fallback testimonials if no data
            <>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {renderStars(5)}
                  </div>
                  <blockquote className="text-muted-foreground mb-4 italic">
                    "I got my water tank delivered the same day. Excellent service!"
                  </blockquote>
                  <cite className="font-semibold text-primary">
                    John K., Nakuru
                  </cite>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {renderStars(5)}
                  </div>
                  <blockquote className="text-muted-foreground mb-4 italic">
                    "Quality materials and competitive prices. Highly recommended!"
                  </blockquote>
                  <cite className="font-semibold text-primary">
                    Mary W., Nairobi
                  </cite>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {renderStars(4)}
                  </div>
                  <blockquote className="text-muted-foreground mb-4 italic">
                    "Great selection of building materials. Fast delivery service."
                  </blockquote>
                  <cite className="font-semibold text-primary">
                    David M., Mombasa
                  </cite>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {renderStars(5)}
                  </div>
                  <blockquote className="text-muted-foreground mb-4 italic">
                    "Professional staff and reliable products. Will buy again."
                  </blockquote>
                  <cite className="font-semibold text-primary">
                    Sarah L., Kisumu
                  </cite>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
