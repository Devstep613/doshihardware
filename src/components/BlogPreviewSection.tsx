import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";

const BlogPreviewSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "How to Choose the Right Water Tank Size",
      excerpt: "Learn the key factors to consider when selecting the perfect water tank for your home or business needs.",
      date: "2024-01-15",
      readTime: "5 min read",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "5 Tips for Long-Lasting Flooring",
      excerpt: "Discover essential maintenance tips to keep your tiles looking new and extend their lifespan.",
      date: "2024-01-10",
      readTime: "4 min read",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Essential Tools for Home Construction",
      excerpt: "A comprehensive guide to the must-have tools for any building project in Kenya.",
      date: "2024-01-05",
      readTime: "6 min read",
      image: "/placeholder.svg"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Building Tips & Guides</h2>
          <p className="text-xl text-muted-foreground">Expert advice for your construction projects</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="h-full hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(post.date)}
                  <span className="mx-2">•</span>
                  {post.readTime}
                </div>
                <CardTitle className="text-xl hover:text-primary transition-colors duration-300">
                  <Link to={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors duration-300"
                >
                  Read More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/blog">
            <button className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300 font-medium">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
