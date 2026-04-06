import { Search } from "lucide-react";
import { useStores } from "@/context/StoreContext";
import { StoreType, storeTypeLabels } from "@/types/store";
import StoreCard from "./StoreCard";
import { Store } from "@/types/store";

const typeFilters: { value: StoreType | "all"; label: string }[] = [
  { value: "all", label: "All Stores" },
  ...Object.entries(storeTypeLabels).map(([value, label]) => ({ value: value as StoreType, label })),
];

const StoreList = ({ onLocate }: { onLocate?: (store: Store) => void }) => {
  const { filteredStores, filterType, setFilterType, searchQuery, setSearchQuery } = useStores();

  return (
    <section id="stores" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Explore <span className="text-gradient">Nearby Stores</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Browse all listed stores or search by name and location.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="max-w-2xl mx-auto mb-10 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stores by name or address..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {typeFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterType(f.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterType === f.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredStores.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No stores found. Try a different search or add a new store!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} onLocate={onLocate} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StoreList;
