/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/products/api.ts
import { apiClient } from "@/src/lib/axios";

export type ApiResponse<T> = { success: boolean; message: string; data: T };

export type ProductStatus = "Active" | "Draft" | "Pending" | "Rejected" | string;

export type Paginated<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type AdminProductListItem = {
  id: string;
  name: string;
  vendorName: string;
  categoryName: string;
  basePrice: number;
  stockQuantity: number;
  status: ProductStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type ProductImage = { id: string; imageUrl: string; isPrimary: boolean };
export type ProductAttribute = { id: string; name: string; value: string };

export type ProductDetails = {
  id: string;
  name: string;
  description: string | null;
  vendorId: string;
  vendorName: string;
  categoryId: number;
  categoryName: string;
  brandId: number | null;
  brandName: string | null;
  productType: "Simple" | "Variable" | string;
  basePrice: number;
  salePrice: number | null;
  salePriceStartDate: string | null;
  salePriceEndDate: string | null;
  effectivePrice: number;
  sku: string;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  status: ProductStatus;
  weight: number;
  dimensionLength: number;
  dimensionWidth: number;
  dimensionHeight: number;
  viewCount: number;
  favoriteCount: number;
  averageRating: number;
  reviewCount: number;
  images: ProductImage[];
  attributes: ProductAttribute[];
  variations: any[];
  createdAt: string;
  updatedAt: string | null;
};

export type AdminProductsQuery = {
  pageNumber: number;
  pageSize: number;
  categoryId?: number;
  vendorId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
};

export async function getAdminProducts(params: AdminProductsQuery) {
  const res = await apiClient.get<ApiResponse<Paginated<AdminProductListItem>>>(
    "/api/admin/products",
    { params }
  );
  return res.data.data;
}

// moderation (admin)
export async function approveAdminProduct(productId: string) {
  const res = await apiClient.patch<ApiResponse<unknown>>(
    `/api/admin/products/${productId}/approve`
  );
  return res.data;
}

export async function rejectAdminProduct(productId: string, reason: string) {
  const res = await apiClient.patch<ApiResponse<unknown>>(
    `/api/admin/products/${productId}/reject`,
    { reason }
  );
  return res.data;
}

export async function flagAdminProduct(productId: string) {
  const res = await apiClient.patch<ApiResponse<unknown>>(
    `/api/admin/products/${productId}/flag`
  );
  return res.data;
}

// details
export async function getProductById(productId: string) {
  const res = await apiClient.get<ApiResponse<ProductDetails>>(`/api/Products/${productId}`);
  return res.data.data;
}

/** ---------- CRUD (Products controller) ---------- **/
export type CreateProductVariationInput = {
  sku: string;
  price: number;
  salePrice: number;
  salePriceStartDate: string;
  salePriceEndDate: string;
  stockQuantity: number;
  attributes: { attributeName: string; attributeValue: string }[];
};

export type CreateProductInput = {
  name: string;
  description: string;
  categoryId: number;
  brandId: number;
  basePrice: number;
  salePrice: number;
  salePriceStartDate: string;
  salePriceEndDate: string;
  stockQuantity: number;
  weight: number;
  dimensionLength: number;
  dimensionWidth: number;
  dimensionHeight: number;
  sku: string;
  variations: CreateProductVariationInput[];
};

export async function createProduct(payload: CreateProductInput) {
  const res = await apiClient.post<ApiResponse<ProductDetails>>("/api/Products", payload);
  return res.data.data;
}

// Swagger shows update body DOES NOT include stock/dimensions/weight, so we mirror that.
export type UpdateProductInput = {
  name: string;
  description: string;
  categoryId: number;
  brandId: number;
  basePrice: number;
  salePrice: number;
  salePriceStartDate: string;
  salePriceEndDate: string;
  sku: string;
};

export async function updateProduct(productId: string, payload: UpdateProductInput) {
  const res = await apiClient.put<ApiResponse<ProductDetails>>(`/api/Products/${productId}`, payload);
  return res.data.data;
}

export async function deleteProduct(productId: string) {
  await apiClient.delete(`/api/Products/${productId}`);
}