/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

type MaybeWrapped<T> = T | { success: boolean; message: string; data: T };

function unwrap<T>(payload: MaybeWrapped<T>): T {
  return (payload as any)?.data ?? (payload as T);
}

export type CouponStats = {
  totalCoupons: number;
  activeNow: number;
  expired: number;
  drafts: number;
};

export type CouponListItem = {
  id: string;
  code: string;
  discountType: string; // e.g. "FixedCart" | "Percentage"
  value: number;
  scope: string; // e.g. "Global" | "Vendor"
  usageLimit: number | null;
  usedCount: number;
  expiryDate: string; // ISO string
  status: string; // "Active" | "Expired" | "Draft"
};

export type CouponsQuery = {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  pageNumber: number;
  pageSize: number;
};

export type CreateCouponInput = {
  code: string;
  discountType: string;
  discountValue: number;

  scope: string;
  vendorId?: string | null;
  adCampaignId?: string | null;

  allowFreeShipping: boolean;
  showOnStore: boolean;

  usageLimit?: number | null;
  expiryDate: string; // API expects date-time string
  status: string; // "Active" | "Draft"
  description?: string | null;
};

export type UpdateCouponInput = CreateCouponInput;

export async function getCouponStats() {
  const res = await apiClient.get<MaybeWrapped<CouponStats>>("/api/coupons/stats");
  return unwrap(res.data);
}

export async function getCoupons(query: CouponsQuery) {
  const res = await apiClient.get<MaybeWrapped<CouponListItem[]>>("/api/coupons", {
    params: query,
  });
  return unwrap(res.data);
}

export async function createCoupon(payload: CreateCouponInput) {
  const res = await apiClient.post<MaybeWrapped<CouponListItem>>("/api/coupons", payload);
  return unwrap(res.data);
}

export async function updateCoupon(couponId: string, payload: UpdateCouponInput) {
  const res = await apiClient.put<MaybeWrapped<CouponListItem>>(`/api/coupons/${couponId}`, payload);
  return unwrap(res.data);
}

export async function deleteCoupon(couponId: string) {
  const res = await apiClient.delete<MaybeWrapped<unknown>>(`/api/coupons/${couponId}`);
  return unwrap(res.data);
}