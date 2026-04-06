import { MapPin, Phone } from "lucide-react";
import { Store, storeTypeLabels } from "@/types/store";

const badgeColors: Record<string, string> = {
  scrape: "bg-primary/10 text-primary",
  general: "bg-accent/10 text-accent",
  grocery: "bg-green-100 text-green-700",
  hardware: "bg-purple-100 text-purple-700",
  other: "bg-muted text-muted-foreground",
};

const StoreCard = ({ store, onLocate }: { store: Store; onLocate?: (store: Store) => void }) => {
  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-[var(--card-shadow)] hover:shadow-[var(--card-hover-shadow)] transition-all duration-300 border border-border hover:border-primary/30 animate-scale-in">
      <div className="relative h-48 overflow-hidden">
        <img
          src={store.image}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          width={600}
          height={400}
        />
        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${badgeColors[store.type] || badgeColors.other}`}>
          {storeTypeLabels[store.type]}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{store.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{store.description}</p>

        <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
          <span>{store.address}</span>
        </div>

        {store.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Phone className="w-4 h-4 shrink-0 text-primary" />
            <span>{store.phone}</span>
          </div>
        )}

        <button
          onClick={() => onLocate?.(store)}
          className="w-full mt-1 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          View on Map
        </button>
      </div>
    </div>
  );
};

export default StoreCard;
