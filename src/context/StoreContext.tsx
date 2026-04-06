import { useState, createContext, useContext, ReactNode } from "react";
import { Store, StoreType } from "@/types/store";
import { sampleStores } from "@/data/sampleStores";

interface StoreContextType {
  stores: Store[];
  addStore: (store: Omit<Store, "id" | "createdAt">) => void;
  filterType: StoreType | "all";
  setFilterType: (type: StoreType | "all") => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredStores: Store[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStores = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStores must be inside StoreProvider");
  return ctx;
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem("stores");
    return saved ? JSON.parse(saved) : sampleStores;
  });
  const [filterType, setFilterType] = useState<StoreType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const addStore = (store: Omit<Store, "id" | "createdAt">) => {
    const newStore: Store = {
      ...store,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newStore, ...stores];
    setStores(updated);
    localStorage.setItem("stores", JSON.stringify(updated));
  };

  const filteredStores = stores.filter((s) => {
    const matchesType = filterType === "all" || s.type === filterType;
    const matchesSearch =
      searchQuery === "" ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <StoreContext.Provider
      value={{ stores, addStore, filterType, setFilterType, searchQuery, setSearchQuery, filteredStores }}
    >
      {children}
    </StoreContext.Provider>
  );
};
