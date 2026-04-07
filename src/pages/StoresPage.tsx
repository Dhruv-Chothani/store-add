import { useNavigate } from "react-router-dom";
import StoreList from "@/components/StoreList";
import { Store } from "@/types/store";

const StoresPage = () => {
  const navigate = useNavigate();

  const handleLocate = (store: Store) => {
    navigate("/map", { state: { flyTo: { lat: store.lat, lng: store.lng } } });
  };

  return <StoreList onLocate={handleLocate} />;
};

export default StoresPage;
