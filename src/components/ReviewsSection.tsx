import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, MessageCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const ReviewsSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const submitCommentMutation = useMutation({
    mutationFn: async (commentData: { name: string; email: string; message: string; rating: number; product_id?: string | null }) => {
      const { data, error } = await supabase
        .from('comments')
        .insert([commentData]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      setName("");
      setEmail("");
      setMessage("");
      setRating(5);
      setShowForm(false);
      toast.success("Thank you for your review!");
    },
    onError: (error) => {
      toast.error("Failed to submit review. Please try again.");
      console.error("Error submitting comment:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    submitCommentMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      rating,
      product_id: null, // General reviews don't need a product_id
    });
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => {
      return (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={interactive ? () => onRatingChange?.(i + 1) : undefined}
        />
      );
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Customer Reviews</h2>
          <p className="text-xl text-muted-foreground">Share your experience with us</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Leave a Review Button */}
          <div className="text-center mb-8">
            <Button
              onClick={() => setShowForm(!showForm)}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              {showForm ? 'Cancel Review' : 'Leave a Review'}
            </Button>
          </div>

          {/* Review Form */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Rating *</Label>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(rating, true, setRating)}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {rating} star{rating !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Review *</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your experience with our products and services..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitCommentMutation.isPending}
                    className="w-full"
                  >
                    {submitCommentMutation.isPending ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Recent Reviews */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-center">Recent Reviews</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : comments?.length ? (
              comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{comment.name}</h4>
                          <div className="flex items-center">
                            {renderStars(comment.rating)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(comment.created_at || '')}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{comment.message}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
