export type ShippingZone = {
  id: string;
  name: string; // e.g., "Lagos Island"
  baseFee: number;
  minDays: number;
  maxDays: number;
  status: "active" | "inactive";
};

export type DeliveryProvider = {
  id: string;
  name: string;
  type: "integrated" | "manual"; // API connected or manual tracking
  rating: number;
  activeShipments: number;
  status: "active" | "inactive";
  logo: string; // Initials
};