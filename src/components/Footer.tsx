import { Store, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Stores", to: "/stores" },
  { label: "Map", to: "/map" },
  { label: "Add Store", to: "/add-store" },
];

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground/80 py-12">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Store className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-primary-foreground">StoreFinder</span>
          </div>
          <p className="text-sm text-primary-foreground/60">
            Helping communities discover and share local stores. Add your store and be found!
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-primary-foreground mb-3">Quick Links</h4>
          <div className="space-y-2">
            {quickLinks.map((l) => (
              <Link key={l.to} to={l.to} className="block text-sm hover:text-primary transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-primary-foreground mb-3">Contact</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />New Delhi, India</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" />hello@storefinder.com</div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/40">
        © {new Date().getFullYear()} StoreFinder. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
