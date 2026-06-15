/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

type MaybeWrapped<T> = T | { success: boolean; message: string; data: T };

function unwrap<T>(payload: MaybeWrapped<T>): T {
  // Supports both shapes:
  // 1) {success,message,data}
  // 2) raw T
  return (payload as any)?.data ?? (payload as T);
}

export type BuyerStats = {
  totalBuyers: number;
  newThisMonth: number;
  activeNow: number;
};

export type BuyerListItem = {
  id: string;
  customerCode: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  country: string;
  totalAmountSpent: number;
  currency: string;
  totalOrders: number;
  status: string;
  lastActiveAt: string | null;
  createdAt: string;
  verificationStatus: string;
  countryCode: string;
};

export type BuyerProfile = {
  id: string;
  customerCode: string;
  fullName: string | undefined;
  email: string;
  phoneNumber: string;
  city: string;
  country: string;
  joinedDate: string;
  totalSpent: number;
  currency: string | undefined;
  totalOrders: number | undefined;
  averageOrderValue: number | undefined;
  walletBalance: number | undefined;
};

export type BuyerOrder = {
  orderId: string;
  date: string;
  items: string[];
  totalAmount: number;
  currency: string;
  status: string;
};

export type BuyerActivityEvent = {
  id: string;
  eventType: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
};

export type BuyersQuery = {
  pageNumber: number;
  pageSize: number;
  currency?: string; // default NGN
  status?: string;
  dateFrom?: string;
  dateTo?: string;
};

export async function getBuyerStats() {
  const res = await apiClient.get<MaybeWrapped<BuyerStats>>("/api/customers/stats");
  return unwrap(res.data);
}

export async function getBuyers(params: BuyersQuery) {
  const res = await apiClient.get<MaybeWrapped<BuyerListItem[]>>("/api/customers", {
    params: { currency: "NGN", ...params },
  });
  return unwrap(res.data);
}

export async function getBuyerProfile(customerId: string) {
  const res = await apiClient.get<MaybeWrapped<BuyerProfile>>(`/api/customers/${customerId}`);
  return unwrap(res.data);
}

export async function getBuyerOrders(customerId: string, pageNumber = 1, pageSize = 20) {
  const res = await apiClient.get<MaybeWrapped<BuyerOrder[]>>(
    `/api/customers/${customerId}/orders`,
    { params: { pageNumber, pageSize } }
  );
  return unwrap(res.data);
}

export async function getBuyerActivity(customerId: string, pageNumber = 1, pageSize = 20) {
  const res = await apiClient.get<MaybeWrapped<BuyerActivityEvent[]>>(
    `/api/customers/${customerId}/activity`,
    { params: { pageNumber, pageSize } }
  );
  return unwrap(res.data);
}

export async function suspendBuyer(customerId: string, reason: string) {
  const res = await apiClient.patch(`/api/customers/${customerId}/suspend`, { reason });
  return res.data;
}

export async function reactivateBuyer(customerId: string) {
  const res = await apiClient.patch(`/api/customers/${customerId}/reactivate`);
  return res.data;
}


export type UpdateUserInput = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  email?: string;
};

export type UpdatedUser = {
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
  updatedAt: string;
};

export async function updateUser(userId: string, payload: UpdateUserInput) {
  const res = await apiClient.patch<MaybeWrapped<UpdatedUser>>(
    `/api/Users/${userId}`,
    payload,
  );
  return unwrap(res.data);
}

