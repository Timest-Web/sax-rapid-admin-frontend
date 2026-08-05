export const locationKeys = {
  all: ["locations"] as const,

  admin: () => [...locationKeys.all, "admin"] as const,
  adminList: () => [...locationKeys.admin(), "list"] as const,
  adminStats: () => [...locationKeys.admin(), "stats"] as const,

  public: () => [...locationKeys.all, "public"] as const,
  countries: (activeOnly: boolean) => [...locationKeys.public(), "countries", { activeOnly }] as const,
  states: (countryId: number) => [...locationKeys.public(), "states", countryId] as const,
};