export const categoryKeys = {
  all: ["categories"] as const,

  tree: () => [...categoryKeys.all, "tree"] as const,
  parents: () => [...categoryKeys.all, "parents"] as const,

  subcategories: () => [...categoryKeys.all, "subcategories"] as const,
  subcategoryList: (parentId: number) => [...categoryKeys.subcategories(), parentId] as const,

  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
};