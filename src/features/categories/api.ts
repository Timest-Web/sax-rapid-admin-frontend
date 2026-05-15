import { apiClient } from "@/src/lib/axios";

export type ApiResponse<T> = { success: boolean; message: string; data: T };

export type CategoryNode = {
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
  parentName: string | null;
  iconUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  subCategories: CategoryNode[];
};

export type CreateCategoryInput = {
  name: string;
  description?: string;
  parentId?: number | null;
  iconUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
};

export type UpdateCategoryInput = {
  name: string;
  iconUrl?: string;
  description?: string;
  isActive: boolean;
};

export async function getCategories() {
  const res = await apiClient.get<ApiResponse<CategoryNode[]>>("/api/Category");
  return res.data.data;
}

export async function getCategoryTree() {
  const res = await apiClient.get<ApiResponse<CategoryNode[]>>("/api/Category/tree");
  return res.data.data;
}

export async function getParentCategories() {
  const res = await apiClient.get<ApiResponse<CategoryNode[]>>("/api/Category/parents");
  return res.data.data;
}

export async function getSubcategories(parentId: number) {
  const res = await apiClient.get<ApiResponse<CategoryNode[]>>(
    `/api/Category/${parentId}/subcategories`
  );
  return res.data.data;
}

export async function getCategoryById(id: number) {
  const res = await apiClient.get<ApiResponse<CategoryNode>>(`/api/Category/${id}`);
  return res.data.data;
}

export async function createCategory(payload: CreateCategoryInput) {
  const res = await apiClient.post<ApiResponse<CategoryNode>>("/api/Category", {
    name: payload.name,
    description: payload.description ?? "",
    parentId: payload.parentId ?? null,
    iconUrl: payload.iconUrl ?? "",
    isActive: payload.isActive ?? true,
    displayOrder: payload.displayOrder ?? 0,
  });
  return res.data.data;
}

export async function updateCategory(id: number, payload: UpdateCategoryInput) {
  const res = await apiClient.put<ApiResponse<CategoryNode>>(`/api/Category/${id}`, {
    name: payload.name,
    iconUrl: payload.iconUrl ?? "",
    description: payload.description ?? "",
    isActive: payload.isActive,
  });
  return res.data.data;
}

export async function deleteCategory(id: number) {
  // backend says "deactivates", returns 200 OK
  const res = await apiClient.delete(`/api/Category/${id}`);
  return res.data;
}