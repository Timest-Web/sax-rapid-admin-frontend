export const cmsKeys = {
  all: ["admin-cms"] as const,
  stats: () => [...cmsKeys.all, "stats"] as const,
  pages: (q: unknown) => [...cmsKeys.all, "pages", q] as const,
};