import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Doshi Hardware Stores Ltd.</h3>
            <p className="text-sm opacity-90">
              Your trusted partner for quality building materials in Kenya. Serving contractors, builders, and homeowners since 1985.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/products" className="block text-sm hover:text-primary transition-colors">
                Products
              </Link>
              <Link to="/price-list" className="block text-sm hover:text-primary transition-colors">
                Price List
              </Link>
              <Link to="/about" className="block text-sm hover:text-primary transition-colors">
                About Us
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2">
              <a href="tel:+254107500245" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                +254 107 500 245 / +254 753 249 744
              </a>
              <a href="mailto:stepnjoroge0@gmail.com" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                stepnjoroge0@gmail.com
              </a>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>Nairobi Road, Industrial Area, Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="font-semibold mb-4">Business Hours</h4>
            <div className="space-y-1 text-sm">
              <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
              <p>Saturday: 8:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/20 mt-8 pt-8 text-center text-sm opacity-90">
          <p>&copy; {new Date().getFullYear()} Doshi Hardware Stores Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
