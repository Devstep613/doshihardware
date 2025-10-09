import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Droplets,
  Package,
  Wrench,
  Grid3X3,
  PaintBucket,
  Fence,
  Hammer,
  Truck
} from "lucide-react";

const CategoriesSection = () => {
  const categories = [
    {
      name: "Water Tanks",
      icon: Droplets,
      description: "High-quality water storage solutions",
      link: "/products?category=Water%20Tanks",
      color: "text-blue-600"
    },
    {
      name: "Cement",
      icon: Package,
      description: "Premium building cement",
      link: "/products?category=Cement",
      color: "text-gray-600"
    },
    {
      name: "Reinforcement Bars",
      icon: Wrench,
      description: "Steel reinforcement materials",
      link: "/products?category=Steel%20%26%20Iron",
      color: "text-orange-600"
    },
    {
      name: "Floor Tiles",
      icon: Grid3X3,
      description: "Ceramic and porcelain tiles",
      link: "/products?category=Tiles",
      color: "text-green-600"
    },
    {
      name: "Wall Tiles",
      icon: Grid3X3,
      description: "Wall covering solutions",
      link: "/products?category=Tiles",
      color: "text-purple-600"
    },
    {
      name: "Chain Link",
      icon: Fence,
      description: "Fencing and security materials",
      link: "/products?category=Fencing",
      color: "text-red-600"
    },
    {
      name: "Roofing Materials",
      icon: Hammer,
      description: "Complete roofing solutions",
      link: "/products?category=Roofing",
      color: "text-indigo-600"
    },
    {
      name: "Building Materials",
      icon: Truck,
      description: "Sand, aggregates and more",
      link: "/products?category=Building%20Materials",
      color: "text-teal-600"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Product Categories</h2>
          <p className="text-xl text-muted-foreground">Find exactly what you need for your project</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.name} to={category.link}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300`}>
                      <IconComponent className={`h-8 w-8 ${category.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link to="/products">
            <button className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300 font-medium">
              View All Products
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
