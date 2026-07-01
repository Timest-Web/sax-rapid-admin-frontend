export const shippingKeys = {
  all: ["admin-shipping"] as const,
  stats: () => [...shippingKeys.all, "stats"] as const,
  partners: () => [...shippingKeys.all, "partners"] as const,
};