/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

type MaybeWrapped<T> = T | { success: boolean; message: string; data: T };

function unwrap<T>(payload: MaybeWrapped<T>): T {
  return (payload as any)?.data ?? (payload as T);
}

export type ReviewStats = {
  averageRating: number;
  totalReviews: number;
  flagged: number;
};

export type Paginated<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type RecentReviewItem = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type VendorRatingItem = {
  vendorId: string;
  vendorName: string;
  rating: number;
  totalProducts: number;
  totalRevenue: number;
  walletBalance: number;
  currency: string;
  status: string;

  shopName: string;
  email: string;
  phone: string;

  storeCity: string | null;
  storeState: string | null;
  storeCountry: string | null;

  verificationStatus: string;
  createdAt: string;
};

export async function getReviewStats() {
  const res = await apiClient.get<MaybeWrapped<ReviewStats>>("/api/Reviews/stats");
  return unwrap(res.data);
}

export async function getRecentReviews(page = 1, pageSize = 20) {
  const res = await apiClient.get<MaybeWrapped<Paginated<RecentReviewItem>>>(
    "/api/Reviews/recent",
    { params: { page, pageSize } },
  );
  return unwrap(res.data);
}

export async function getVendorRatings(page = 1, pageSize = 20) {
  const res = await apiClient.get<MaybeWrapped<Paginated<VendorRatingItem>>>(
    "/api/Reviews/ratings",
    { params: { page, pageSize } },
  );
  return unwrap(res.data);
}

export async function flagReview(reviewId: string) {
  const res = await apiClient.patch<MaybeWrapped<unknown>>(
    `/api/Reviews/${reviewId}/flag`,
  );
  return unwrap(res.data);
}

export type ReviewDetails = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  userCountry: string | null;
  userCountryCode: string | null;
  createdAt: string;
  updatedAt: string;
  isFlagged?: boolean;
};

export type ApiResponse<T> = { success: boolean; message: string; data: T };

export async function getReviewById(reviewId: string) {
  const res = await apiClient.get<ApiResponse<ReviewDetails>>(
    `/api/Reviews/${reviewId}`,
  );
  return res.data.data;
}