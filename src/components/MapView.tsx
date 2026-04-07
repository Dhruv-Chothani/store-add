import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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
  const markersRef = useRef<L.Marker[]>([]);
  const { filteredStores } = useStores();

  useImperativeHandle(ref, () => ({
    flyTo: (lat: number, lng: number) => {
      if (mapRef.current) {
        mapRef.current.flyTo([lat, lng], 16, { duration: 1.5 });
        // Open the popup for the matching marker
        markersRef.current.forEach((marker) => {
          const pos = marker.getLatLng();
          if (Math.abs(pos.lat - lat) < 0.0001 && Math.abs(pos.lng - lng) < 0.0001) {
            setTimeout(() => marker.openPopup(), 1600);
          }
        });
      }
    },
  }));

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([28.6139, 77.209], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Force a resize after mount to fix grey tiles
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    filteredStores.forEach((store) => {
      const color = storeTypeColors[store.type] || "#888";
      const icon = L.divIcon({
        html: `<div style="background:${color};width:36px;height:36px;border-radius:50%;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;cursor:pointer;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>`,
        className: "",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([store.lat, store.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:system-ui;min-width:200px;padding:4px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <img src="${store.image}" alt="${store.name}" style="width:60px;height:60px;border-radius:8px;object-fit:cover"/>
              <div>
                <strong style="font-size:14px;display:block">${store.name}</strong>
                <span style="color:${color};font-size:12px;font-weight:600">${storeTypeLabels[store.type]}</span>
              </div>
            </div>
            <p style="font-size:12px;color:#666;margin:0 0 4px">${store.address}</p>
            ${store.phone ? `<p style="font-size:12px;color:#666;margin:0">📞 ${store.phone}</p>` : ""}
          </div>`,
          { maxWidth: 280 }
        );

      markersRef.current.push(marker);
    });

    if (filteredStores.length > 0) {
      const bounds = L.latLngBounds(filteredStores.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }

    // Invalidate size in case container was hidden/resized
    setTimeout(() => map.invalidateSize(), 100);
  }, [filteredStores]);

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            All Stores on <span className="text-gradient">The Map</span>
          </h2>
          <p className="text-muted-foreground">Click any marker to see store details.</p>
        </div>

        <div
          ref={containerRef}
          className="w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-lg border border-border"
          style={{ zIndex: 1 }}
        />
      </div>
    </section>
  );
});

MapView.displayName = "MapView";
export default MapView;
