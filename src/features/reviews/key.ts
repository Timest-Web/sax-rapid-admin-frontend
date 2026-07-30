export const reviewKeys = {
  all: ["admin-reviews"] as const,

  stats: () => [...reviewKeys.all, "stats"] as const,

  recentBase: () => [...reviewKeys.all, "recent"] as const,
  recentList: (params: { page: number; pageSize: number }) =>
    [...reviewKeys.recentBase(), params] as const,

  ratingsBase: () => [...reviewKeys.all, "ratings"] as const,
  ratingsList: (params: { page: number; pageSize: number }) =>
    [...reviewKeys.ratingsBase(), params] as const,

  detail: (reviewId: string) => [...reviewKeys.all, "detail", reviewId] as const,
};