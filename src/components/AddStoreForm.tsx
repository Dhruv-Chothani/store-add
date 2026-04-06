import { useState, useEffect, useRef } from "react";
import { MapPin, Plus, Locate } from "lucide-react";
import L from "leaflet";
import { useStores } from "@/context/StoreContext";
import { StoreType, storeTypeLabels } from "@/types/store";
import { useToast } from "@/components/ui/use-toast";

const storeImages: Record<StoreType, string> = {
  scrape: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
  general: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop",
  grocery: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop",
  hardware: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",
  other: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600&h=400&fit=crop",
};

const AddStoreForm = () => {
  const { addStore } = useStores();
  const { toast } = useToast();
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: "",
    type: "general" as StoreType,
    description: "",
    address: "",
    phone: "",
    lat: 28.6139,
    lng: 77.209,
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current).setView([form.lat, form.lng], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    const marker = L.marker([form.lat, form.lng], { draggable: true }).addTo(map);
    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      setForm((f) => ({ ...f, lat: pos.lat, lng: pos.lng }));
    });

    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      setForm((f) => ({ ...f, lat: e.latlng.lat, lng: e.latlng.lng }));
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((f) => ({ ...f, lat: latitude, lng: longitude }));
        mapRef.current?.flyTo([latitude, longitude], 15);
        markerRef.current?.setLatLng([latitude, longitude]);
      },
      () => toast({ title: "Location access denied", variant: "destructive" })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address) {
      toast({ title: "Please fill in store name and address", variant: "destructive" });
      return;
    }
    addStore({
      ...form,
      image: storeImages[form.type],
    });
    toast({ title: "🎉 Store added successfully!" });
    setForm({ name: "", type: "general", description: "", address: "", phone: "", lat: 28.6139, lng: 77.209 });
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow";

  return (
    <section id="add-store" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Add <span className="text-gradient">Your Store</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Pin your store on the map so everyone can find it. Click the map or drag the marker to set location.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Store Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Kumar General Store" className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Store Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as StoreType })}
                className={inputClass}
              >
                {Object.entries(storeTypeLabels).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Tell people about your store..."
                rows={3}
                className={inputClass + " resize-none"}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Address *</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Full address" className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className={inputClass} />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Store to Map
            </button>
          </div>

          {/* Map picker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Pick Location on Map
              </label>
              <button
                type="button"
                onClick={handleCurrentLocation}
                className="text-sm text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <Locate className="w-4 h-4" />
                Use My Location
              </button>
            </div>
            <div ref={containerRef} className="w-full h-[360px] rounded-xl overflow-hidden border border-border shadow-md" />
            <p className="text-xs text-muted-foreground text-center">
              📍 Lat: {form.lat.toFixed(4)}, Lng: {form.lng.toFixed(4)}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddStoreForm;
