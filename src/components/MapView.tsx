import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import L from "leaflet";
import { useStores } from "@/context/StoreContext";
import { storeTypeColors, storeTypeLabels } from "@/types/store";

// Fix leaflet default icon issue
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export interface MapViewHandle {
  flyTo: (lat: number, lng: number) => void;
}

const MapView = forwardRef<MapViewHandle>((_, ref) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { filteredStores } = useStores();

  useImperativeHandle(ref, () => ({
    flyTo: (lat: number, lng: number) => {
      mapRef.current?.flyTo([lat, lng], 16, { duration: 1.5 });
    },
  }));

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView([28.6139, 77.209], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    filteredStores.forEach((store) => {
      const color = storeTypeColors[store.type] || "#888";
      const icon = L.divIcon({
        html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker([store.lat, store.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:system-ui;min-width:180px">
            <strong style="font-size:14px">${store.name}</strong><br/>
            <span style="color:#666;font-size:12px">${storeTypeLabels[store.type]}</span><br/>
            <span style="font-size:12px">${store.address}</span>
          </div>`
        );
    });

    if (filteredStores.length > 0) {
      const bounds = L.latLngBounds(filteredStores.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [filteredStores]);

  return (
    <section id="map" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            All Stores on <span className="text-gradient">The Map</span>
          </h2>
          <p className="text-muted-foreground">Click any marker to see store details.</p>
        </div>

        <div
          ref={containerRef}
          className="w-full h-[500px] rounded-2xl overflow-hidden shadow-lg border border-border"
        />
      </div>
    </section>
  );
});

MapView.displayName = "MapView";
export default MapView;
