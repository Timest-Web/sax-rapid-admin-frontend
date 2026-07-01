/* eslint-disable @typescript-eslint/no-explicit-any */
export const reviewKeys = {
  all: ["reviews"] as const,

  stats: () => [...reviewKeys.all, "stats"] as const,

  recent: () => [...reviewKeys.all, "recent"] as const,
  recentList: (q: Record<string, any>) => [...reviewKeys.recent(), q] as const,

  ratings: () => [...reviewKeys.all, "ratings"] as const,
  ratingsList: (q: Record<string, any>) => [...reviewKeys.ratings(), q] as const,
   detail: (reviewId: string) => [...reviewKeys.all, "detail", reviewId] as const,
};


