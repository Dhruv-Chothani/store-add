export type StoreType = "scrape" | "general" | "grocery" | "hardware" | "other";

export interface Store {
  id: string;
  name: string;
  type: StoreType;
  description: string;
  image: string;
  lat: number;
  lng: number;
  address: string;
  phone?: string;
  createdAt: string;
}

export const storeTypeLabels: Record<StoreType, string> = {
  scrape: "Scrape Store",
  general: "General Store",
  grocery: "Grocery Store",
  hardware: "Hardware Store",
  other: "Other",
};

export const storeTypeColors: Record<StoreType, string> = {
  scrape: "hsl(25, 95%, 53%)",
  general: "hsl(200, 80%, 50%)",
  grocery: "hsl(140, 60%, 45%)",
  hardware: "hsl(280, 60%, 55%)",
  other: "hsl(0, 0%, 50%)",
};
