import { useRef } from "react";
import { StoreProvider } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StoreList from "@/components/StoreList";
import MapView, { MapViewHandle } from "@/components/MapView";
import AddStoreForm from "@/components/AddStoreForm";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Store } from "@/types/store";

const Index = () => {
  const mapViewRef = useRef<MapViewHandle>(null);

  const handleLocateStore = (store: Store) => {
    const mapEl = document.getElementById("map");
    if (mapEl) mapEl.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      mapViewRef.current?.flyTo(store.lat, store.lng);
    }, 600);
  };

  return (
    <StoreProvider>
      <div className="min-h-screen">
        <Navbar />
        <section id="home">
          <Hero />
        </section>
        <section id="stores">
          <StoreList onLocate={handleLocateStore} />
        </section>
        <MapView ref={mapViewRef} />
        <section id="add-store">
          <AddStoreForm />
        </section>
        <Footer />
        <ScrollToTop />
      </div>
    </StoreProvider>
  );
};

export default Index;
