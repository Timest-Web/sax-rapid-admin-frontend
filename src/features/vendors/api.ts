/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

/**
 * Generic API response wrapper used by your backend:
 * { success, message, data }
 *
 * Give T a default so you can write ApiResponse without specifying <T>.
 */
export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};

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

/** If you want, you can reuse this in other modules too */
export type VendorAdminAction = "Approve" | "Reject" | "Suspend";

export type VendorAdminActionPayload = {
  action: VendorAdminAction;
  reason?: string;
};

export async function getVendorById(vendorId: string): Promise<VendorProfile> {
  const res = await apiClient.get<ApiResponse<VendorProfile>>(
    `/api/Vendor/${vendorId}`,
  );
  return res.data.data;
}

/**
 * Most "action" endpoints usually return data: null.
 * If your backend returns something else, change <null> to the correct type.
 */
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