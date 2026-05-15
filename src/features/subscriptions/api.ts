/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

type MaybeWrapped<T> = T | { success: boolean; message: string; data: T };

function unwrap<T>(payload: MaybeWrapped<T>): T {
  return (payload as any)?.data ?? (payload as T);
}

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxProducts: number;
  canBoostProducts: boolean;
  hasAnalytics: boolean;
  hasPrioritySupport: boolean;
  displayOrder: number;

  // not shown in your sample, but likely present when activeOnly=false
  isActive?: boolean;
  createdAt?: string; // not in sample
};

export type SubscriptionPlansQuery = {
  activeOnly?: boolean; // default true from backend
};

export type CreatePlanInput = {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxProducts: number;
  canBoostProducts: boolean;
  hasAnalytics: boolean;
  hasPrioritySupport: boolean;
  displayOrder: number;
};

export type UpdatePlanInput = CreatePlanInput;

export async function getSubscriptionPlans(params?: SubscriptionPlansQuery) {
  const res = await apiClient.get<MaybeWrapped<SubscriptionPlan[]>>(
    "/api/Subscription/plans",
    { params: { activeOnly: true, ...(params ?? {}) } },
  );
  return unwrap(res.data);
}

export async function getSubscriptionPlanById(planId: string) {
  const res = await apiClient.get<MaybeWrapped<SubscriptionPlan>>(
    `/api/Subscription/plans/${planId}`,
  );
  return unwrap(res.data);
}

export async function createSubscriptionPlan(payload: CreatePlanInput) {
  const res = await apiClient.post<MaybeWrapped<SubscriptionPlan>>(
    "/api/Subscription/plans",
    payload,
  );
  return unwrap(res.data);
}

export async function updateSubscriptionPlan(planId: string, payload: UpdatePlanInput) {
  const res = await apiClient.put<MaybeWrapped<SubscriptionPlan>>(
    `/api/Subscription/plans/${planId}`,
    payload,
  );
  return unwrap(res.data);
}

// These exist in swagger and are best for toggling status:
export async function activateSubscriptionPackage(packageId: string) {
  const res = await apiClient.patch<MaybeWrapped<any>>(
    `/api/Subscription/admin/packages/${packageId}/activate`,
  );
  return unwrap(res.data);
}

export async function deactivateSubscriptionPackage(packageId: string) {
  const res = await apiClient.patch<MaybeWrapped<any>>(
    `/api/Subscription/admin/packages/${packageId}/deactivate`,
  );
  return unwrap(res.data);
}

export async function deactivateSubscriptionPlan(planId: string) {
  const res = await apiClient.delete<MaybeWrapped<any>>(
    `/api/Subscription/plans/${planId}`,
  );
  return unwrap(res.data);
}