/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

type ApiResponse<T> = { success: boolean; message: string; data: T };
type MaybeWrapped<T> = T | ApiResponse<T>;

function unwrap<T>(payload: MaybeWrapped<T>): T {
  return (payload as any)?.data ?? (payload as T);
}

/** ---------- Common pagination shape (frontend standard) ---------- */
export type Paginated<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

/** ---------- Users ---------- */
export type PlatformUser = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  role: string;
  status: string;
  verificationStatus: string;
  profileImageUrl: string | null;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export async function getBuyers(page = 1, pageSize = 20) {
  const res = await apiClient.get<ApiResponse<PlatformUser[]>>("/api/Admin/users", {
    params: { page, pageSize, role: "Buyer" },
  });

  return res.data.data; // array
}

/** ---------- Vendors ---------- */
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
  createdAt: string;
  updatedAt: string | null;
};

type VendorApiResponse<T> = { success: boolean; message: string; data: T };

export async function getVendors(page = 1, pageSize = 20): Promise<Paginated<VendorProfile>> {
  const res = await apiClient.get<VendorApiResponse<any>>("/api/Admin/vendors", {
    params: { page, pageSize },
  });

  const data = unwrap(res.data);

  if (data && typeof data === "object" && Array.isArray(data.items)) {
    return data as Paginated<VendorProfile>;
  }

  if (Array.isArray(data)) {
    return {
      items: data as VendorProfile[],
      pageNumber: page,
      pageSize,
      totalCount: data.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: page > 1,
    };
  }

  // Fallback (never crash)
  return {
    items: [],
    pageNumber: page,
    pageSize,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };
}

/** ---------- Actions ---------- */
type UserActionApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export async function suspendUser(userId: string, reason: string) {
  const res = await apiClient.post<UserActionApiResponse>(
    `/api/Admin/users/${userId}/suspend`,
    { action: "Suspend", reason },
  );
  return res.data;
}

export async function activateUser(userId: string) {
  const res = await apiClient.post<UserActionApiResponse>(
    `/api/Admin/users/${userId}/activate`,
  );
  return res.data;
}

export type ResetPasswordBody = { newPassword: string };

export async function resetUserPassword(userId: string, body: ResetPasswordBody) {
  const res = await apiClient.post<ApiResponse<unknown>>(
    `/api/Admin/users/${userId}/reset-password`,
    body,
  );
  return res.data;
}