import { MapPin, Store, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Stores", href: "#stores" },
  { label: "Map", href: "#map" },
  { label: "Add Store", href: "#add-store" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#home" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Store className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-foreground">Store<span className="text-gradient">Finder</span></span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors font-medium text-sm text-muted-foreground hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#add-store"
          className="hidden md:inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <MapPin className="w-4 h-4" />
          Add Your Store
        </a>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 animate-fade-in-up">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 transition-colors font-medium text-muted-foreground hover:text-primary"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#add-store"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 mt-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold"
          >
            <MapPin className="w-4 h-4" />
            Add Your Store
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
