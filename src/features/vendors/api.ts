/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};

export type MaybeWrapped<T> = T | ApiResponse<T>;

function unwrap<T>(payload: MaybeWrapped<T>): T {
  return (payload as any)?.data ?? (payload as T);
}

export type Paginated<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
};

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

export type VendorProfile = {
  id: string; // vendor profile id
  userId: string; // owner user id

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

  verificationStatus: "Verified" | "NotVerified" | "Pending" | string;
  verifiedAt: string | null;

  productLimit: number;

  ownerName: string;
  ownerEmail: string;

  averageRating?: number;
  totalRatings?: number;
  walletBalance?: number;
  currency?: string;

  createdAt: string;
  updatedAt: string | null;
  isSuspended?: boolean;
  suspensionReason?: string | null;
  suspendedAt?: string | null;
  isVerified?: boolean;
  totalReviewsCount?: number;
  totalSalesCount?: number;
  totalProductsCount?: number;
  responseRatePercentage?: number;
  isFollowing?: boolean;
  vendorProfileId?: string;
};

/** GET /api/Admin/vendors (list) */
export async function getVendors(
  page = 1,
  pageSize = 20,
): Promise<Paginated<VendorProfile>> {
  const res = await apiClient.get<ApiResponse<MaybePaginated<VendorProfile>>>(
    "/api/Admin/vendors",
    { params: { page, pageSize } },
  );

  const data = unwrap(res.data);
  return toPaginated(data, page, pageSize);
}

/** GET /api/Vendor/{userId} (detail by userId) */
export async function getVendorByUserId(userId: string): Promise<VendorProfile> {
  const res = await apiClient.get<ApiResponse<VendorProfile>>(`/api/Vendor/${userId}`);
  return unwrap(res.data);
}

/* ============================================================================
 * Admin actions: approve / reject / suspend (profileId)
 * ==========================================================================*/
export type VendorAdminAction = "Approve" | "Reject" | "Suspend";

export type VendorAdminActionPayload = {
  action: VendorAdminAction;
  reason?: string;
};

export async function approveVendor(vendorProfileId: string): Promise<ApiResponse<null>> {
  const res = await apiClient.post<ApiResponse<null>>(
    `/api/Admin/vendors/${vendorProfileId}/approve`,
    { action: "Approve" } satisfies VendorAdminActionPayload,
  );
  return res.data;
}

export async function rejectVendor(
  vendorProfileId: string,
  reason: string,
): Promise<ApiResponse<null>> {
  const res = await apiClient.post<ApiResponse<null>>(
    `/api/Admin/vendors/${vendorProfileId}/reject`,
    { action: "Reject", reason } satisfies VendorAdminActionPayload,
  );
  return res.data;
}

export async function suspendVendor(
  vendorProfileId: string,
  reason: string,
): Promise<ApiResponse<null>> {
  const res = await apiClient.post<ApiResponse<null>>(
    `/api/Admin/vendors/${vendorProfileId}/suspend`,
    { action: "Suspend", reason } satisfies VendorAdminActionPayload,
  );
  return res.data;
}

/** PATCH /api/Vendor/{userId} (update by userId) */
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

export async function updateVendor(userId: string, payload: UpdateVendorInput): Promise<VendorProfile> {
  const res = await apiClient.patch<ApiResponse<VendorProfile>>(`/api/Vendor/${userId}`, payload);
  return unwrap(res.data);
}

/* ============================================================================
 * Sub-resources
 * ==========================================================================*/
export type VendorOrderListItem = {
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
  vendorProfileId: string,
  params: { currency?: string; pageNumber: number; pageSize: number },
): Promise<Paginated<VendorOrderListItem>> {
  const res = await apiClient.get<ApiResponse<MaybePaginated<VendorOrderListItem>>>(
    `/api/Vendor/${vendorProfileId}/orders`,
    { params: { currency: "NGN", ...params } },
  );
  return toPaginated(unwrap(res.data), params.pageNumber, params.pageSize);
}

export type VendorKycDoc = {
  id: string;
  documentType: string;
  fileUrl: string;
  submittedAt: string;
  status: string;
};

export async function getVendorKyc(vendorProfileId: string): Promise<VendorKycDoc[]> {
  const res = await apiClient.get<ApiResponse<VendorKycDoc[]>>(`/api/Vendor/${vendorProfileId}/kyc`);
  return unwrap(res.data);
}

export type VendorPayout = {
  payoutId: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
};

export async function getVendorPayouts(
  vendorProfileId: string,
  params: { currency?: string; pageNumber: number; pageSize: number },
): Promise<Paginated<VendorPayout>> {
  const res = await apiClient.get<ApiResponse<MaybePaginated<VendorPayout>>>(
    `/api/Vendor/${vendorProfileId}/payouts`,
    { params: { currency: "NGN", ...params } },
  );
  return toPaginated(unwrap(res.data), params.pageNumber, params.pageSize);
}

export type VendorReviewSummary = {
  averageRating: number;
  totalReviews: number;
  starRatingBreakdown: Record<string, number>;
};

export async function getVendorReviewSummary(vendorProfileId: string): Promise<VendorReviewSummary> {
  const res = await apiClient.get<ApiResponse<VendorReviewSummary>>(
    `/api/Vendor/${vendorProfileId}/reviews/summary`,
  );
  return unwrap(res.data);
}

export type VendorReview = {
  reviewerName: string;
  reviewerAvatarUrl: string | null;
  rating: number;
  createdAt: string;
  itemDetails: string;
  comment: string;
};

export async function getVendorReviews(
  vendorProfileId: string,
  params: { pageNumber: number; pageSize: number },
): Promise<Paginated<VendorReview>> {
  const res = await apiClient.get<ApiResponse<Paginated<VendorReview>>>(
    `/api/Vendor/${vendorProfileId}/reviews`,
    { params: { PageNumber: params.pageNumber, PageSize: params.pageSize } },
  );
  return unwrap(res.data);
}