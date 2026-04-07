import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import MapView, { MapViewHandle } from "@/components/MapView";

const MapPage = () => {
  const mapRef = useRef<MapViewHandle>(null);
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { flyTo?: { lat: number; lng: number } } | null;
    if (state?.flyTo) {
      setTimeout(() => {
        mapRef.current?.flyTo(state.flyTo!.lat, state.flyTo!.lng);
      }, 600);
    }
  }, [location.state]);

  return <MapView ref={mapRef} />;
};

export default MapPage;
