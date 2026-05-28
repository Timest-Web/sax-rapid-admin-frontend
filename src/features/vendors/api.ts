/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

/** Backend wrapper: { success, message, data } */
export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};

/** Some endpoints might return raw T; support both just in case */
export type MaybeWrapped<T> = T | ApiResponse<T>;

function unwrap<T>(payload: MaybeWrapped<T>): T {
  return (payload as any)?.data ?? (payload as T);
}

/** Generic pagination used across your admin endpoints */
export type Paginated<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
};

/** Some endpoints accept pagination but currently return a raw array */
type MaybePaginated<T> = Paginated<T> | T[];

function toPaginated<T>(
  data: MaybePaginated<T>,
  pageNumber: number,
  pageSize: number,
): Paginated<T> {
  if (Array.isArray(data)) {
    return {
      items: data,
      pageNumber,
      pageSize,
      totalCount: data.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: pageNumber > 1,
    };
  }
  return data;
}

/* ============================================================================
 * Core vendor profile
 * ==========================================================================*/

export type VendorProfile = {
  id: string;
  userId: string;

  shopName: string;
  accountType: string;

  companyName: string;
  businessRegistrationNumber: string;

  storeAddress: string;
  storeCity: string;
  storeState: string;
  storeLatitude: number | null;
  storeLongitude: number | null;

  logoUrl: string | null;
  bannerUrl: string | null;
  description: string | null;

  verificationStatus: "Verified" | "NotVerified" | string;
  verifiedAt: string | null;

  productLimit: number;

  ownerName: string;
  ownerEmail: string;

  // Sometimes returned by some endpoints (keep optional so UI won’t break)
  averageRating?: number;
  totalRatings?: number;
  walletBalance?: number;
  currency?: string;

  createdAt: string;
  updatedAt: string | null;

  // fields shown in swagger PATCH response (optional)
  isVerified?: boolean;
  totalReviewsCount?: number;
  totalSalesCount?: number;
  totalProductsCount?: number;
  responseRatePercentage?: number;
  isFollowing?: boolean;
  vendorProfileId?: string;
};

export async function getVendorById(vendorId: string): Promise<VendorProfile> {
  const res = await apiClient.get<ApiResponse<VendorProfile>>(
    `/api/Vendor/${vendorId}`,
  );
  return unwrap(res.data);
}

/* ============================================================================
 * Admin actions: approve / reject / suspend
 * ==========================================================================*/

export type VendorAdminAction = "Approve" | "Reject" | "Suspend";

export type VendorAdminActionPayload = {
  action: VendorAdminAction;
  reason?: string;
};

export async function approveVendor(vendorId: string): Promise<ApiResponse<null>> {
  const res = await apiClient.post<ApiResponse<null>>(
    `/api/Admin/vendors/${vendorId}/approve`,
    { action: "Approve" } satisfies VendorAdminActionPayload,
  );
  return res.data;
}

export async function rejectVendor(
  vendorId: string,
  reason: string,
): Promise<ApiResponse<null>> {
  const res = await apiClient.post<ApiResponse<null>>(
    `/api/Admin/vendors/${vendorId}/reject`,
    { action: "Reject", reason } satisfies VendorAdminActionPayload,
  );
  return res.data;
}

export async function suspendVendor(
  vendorId: string,
  reason: string,
): Promise<ApiResponse<null>> {
  const res = await apiClient.post<ApiResponse<null>>(
    `/api/Admin/vendors/${vendorId}/suspend`,
    { action: "Suspend", reason } satisfies VendorAdminActionPayload,
  );
  return res.data;
}

/* ============================================================================
 * PATCH /api/Vendor/{id} - update vendor profile (partial)
 * ==========================================================================*/

export type UpdateVendorInput = {
  shopName?: string;
  companyName?: string;
  businessRegistrationNumber?: string;

  storeAddress?: string;
  storeCity?: string;
  storeState?: string;
  storeLatitude?: number | null;
  storeLongitude?: number | null;

  logoUrl?: string | null;
  bannerUrl?: string | null;
  description?: string | null;
};

export async function updateVendor(
  vendorId: string,
  payload: UpdateVendorInput,
): Promise<VendorProfile> {
  const res = await apiClient.patch<ApiResponse<VendorProfile>>(
    `/api/Vendor/${vendorId}`,
    payload,
  );
  return unwrap(res.data);
}

/* ============================================================================
 * Vendor sub-resources (Admin)
 * ==========================================================================*/

/** GET /api/Vendor/{vendorId}/orders */
export type VendorOrderListItem = {
  id?: string;
  orderId?: string;
  orderNumber?: string;
  customerName?: string;
  productName?: string;
  amount?: number;
  currency?: string;
  status?: string;
  date?: string;
  [k: string]: any;
};

export async function getVendorOrders(
  vendorId: string,
  params: { currency?: string; pageNumber: number; pageSize: number },
): Promise<Paginated<VendorOrderListItem>> {
  const res = await apiClient.get<ApiResponse<MaybePaginated<VendorOrderListItem>>>(
    `/api/Vendor/${vendorId}/orders`,
    { params: { currency: "NGN", ...params } },
  );

  const data = unwrap(res.data);
  return toPaginated(data, params.pageNumber, params.pageSize);
}

/** GET /api/Vendor/{vendorId}/kyc */
export type VendorKycDoc = {
  id: string;
  documentType: string;
  fileUrl: string;
  submittedAt: string;
  status: string;
};

export async function getVendorKyc(vendorId: string): Promise<VendorKycDoc[]> {
  const res = await apiClient.get<ApiResponse<VendorKycDoc[]>>(
    `/api/Vendor/${vendorId}/kyc`,
  );
  return unwrap(res.data);
}

/** GET /api/Vendor/{vendorId}/payouts */
export type VendorPayout = {
  payoutId: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
};

export async function getVendorPayouts(
  vendorId: string,
  params: { currency?: string; pageNumber: number; pageSize: number },
): Promise<Paginated<VendorPayout>> {
  const res = await apiClient.get<ApiResponse<MaybePaginated<VendorPayout>>>(
    `/api/Vendor/${vendorId}/payouts`,
    { params: { currency: "NGN", ...params } },
  );

  const data = unwrap(res.data);
  return toPaginated(data, params.pageNumber, params.pageSize);
}

/** GET /api/Vendor/{vendorId}/reviews/summary */
export type VendorReviewSummary = {
  averageRating: number;
  totalReviews: number;
  starRatingBreakdown: Record<string, number>;
};

export async function getVendorReviewSummary(
  vendorId: string,
): Promise<VendorReviewSummary> {
  const res = await apiClient.get<ApiResponse<VendorReviewSummary>>(
    `/api/Vendor/${vendorId}/reviews/summary`,
  );
  return unwrap(res.data);
}

/** GET /api/Vendor/{vendorId}/reviews */
export type VendorReview = {
  reviewerName: string;
  reviewerAvatarUrl: string | null;
  rating: number;
  createdAt: string;
  itemDetails: string;
  comment: string;
};

export async function getVendorReviews(
  vendorId: string,
  params: { pageNumber: number; pageSize: number },
): Promise<Paginated<VendorReview>> {
  const res = await apiClient.get<ApiResponse<Paginated<VendorReview>>>(
    `/api/Vendor/${vendorId}/reviews`,
    // swagger uses PageNumber/PageSize (capital P)
    { params: { PageNumber: params.pageNumber, PageSize: params.pageSize } },
  );
  return unwrap(res.data);
}


