import { Search, MapPin, ArrowDown } from "lucide-react";
import heroImg from "@/assets/hero-stores.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="Vibrant neighborhood stores" className="w-full h-full object-cover" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-background" />
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <div className="animate-fade-in-up max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-primary/30">
            <MapPin className="w-4 h-4" />
            Discover Local Stores Near You
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Find & Add <br />
            <span className="text-gradient">Every Store</span> <br />
            On The Map
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Scrape stores, general stores, grocery shops — add any store with its location and help your community find them easily.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#stores"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              <Search className="w-5 h-5" />
              Browse Stores
            </a>
            <a
              href="#add-store"
              className="inline-flex items-center justify-center gap-2 bg-card/90 backdrop-blur-sm text-foreground px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-card transition-colors shadow-lg border border-border"
            >
              <MapPin className="w-5 h-5" />
              Add a Store
            </a>
          </div>
        </div>

        <a href="#stores" className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-primary-foreground/60 hover:text-primary-foreground transition-colors">
          <ArrowDown className="w-8 h-8" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
