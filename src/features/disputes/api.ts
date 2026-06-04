/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

type MaybeWrapped<T> = T | { success: boolean; message: string; data: T };

function unwrap<T>(payload: MaybeWrapped<T>): T {
  return (payload as any)?.data ?? (payload as T);
}

export type DisputeStatusApi = "Open" | "Resolved" | "Closed" | string;

export type DisputeListItem = {
  id: string; // uuid
  caseId: string; // e.g. CASE-0003
  buyerName: string;
  vendorName: string;
  disputedAmount: number;
  currency: string; // e.g. NGN
  status: DisputeStatusApi;
  createdAt: string; // ISO
};

export type DisputeDetails = {
  id: string; // uuid
  caseId: string;
  orderId: string; // uuid
  orderNumber: string; // e.g. ORD-20260506-00005
  disputedAmount: number;
  currency: string;
  status: DisputeStatusApi;
  reason: string; // e.g. Damaged
  notes: string;
  createdAt: string;
  resolvedAt: string | null;
};

// Stats response shape is not shown in your screenshot, so keep it flexible.
// Adjust fields to match what your backend actually returns.
export type DisputeStats = {
  activeCases?: number;
  fundsInEscrow?: number;
  fraudAlerts?: number;
  currency?: string;
};

export type GetDisputesParams = {
  status?: string;
  dateFrom?: string; // ISO date-time
  dateTo?: string; // ISO date-time
  currency?: string;
  pageNumber?: number;
  pageSize?: number;
};

export async function getDisputes(params: GetDisputesParams) {
  const res = await apiClient.get<MaybeWrapped<DisputeListItem[]>>(
    "/api/Disputes",
    { params },
  );
  return unwrap(res.data); // returns DisputeListItem[]
}

export async function getDisputeById(id: string) {
  // This endpoint returns the object directly (not wrapped) in your sample
  const res = await apiClient.get<DisputeDetails>(`/api/Disputes/${id}`);
  return res.data;
}

export async function getDisputeStats() {
  const res = await apiClient.get<MaybeWrapped<DisputeStats>>(
    "/api/Disputes/stats",
  );
  return unwrap(res.data);
}

export type ResolveDisputeBody = {
  action: "RefundBuyer" | "ReleaseToVendor"; // use exactly what backend expects
  adminNotes?: string;
};

export async function resolveDispute(caseId: string, body: ResolveDisputeBody) {
  const res = await apiClient.patch<MaybeWrapped<unknown>>(
    `/api/Disputes/${caseId}/resolve`,
    body,
  );
  return unwrap(res.data);
}