/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

type MaybeWrapped<T> = T | { success: boolean; message: string; data: T };
const unwrap = <T,>(payload: MaybeWrapped<T>): T =>
  (payload as any)?.data ?? (payload as T);

export type ShippingStats = {
  activeShipments: number;
  onTimeDeliveryRate: number;   // percentage number e.g. 85
  averageDeliveryDays: number;  // e.g. 3.5
  totalPartners: number;
};

export type ShippingPartner = {
  id: string;
  name: string;
  partnerType: string;
  activeLoad: number;
  rating: number;
  status: string;
  website: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  createdAt: string;
};

export async function getShippingStats() {
  const res = await apiClient.get<MaybeWrapped<ShippingStats>>(
    "/api/admin/shipping/stats",
  );
  return unwrap(res.data);
}

export async function getShippingPartners() {
  const res = await apiClient.get<MaybeWrapped<ShippingPartner[]>>(
    "/api/admin/shipping/partners",
  );
  return unwrap(res.data);
}

export type CreateShippingPartnerInput = {
  name: string;
  partnerType: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
};

export async function createShippingPartner(payload: CreateShippingPartnerInput) {
  const res = await apiClient.post<MaybeWrapped<ShippingPartner>>(
    "/api/admin/shipping/partners",
    payload,
  );
  return unwrap(res.data);
}

export type UpdateShippingPartnerInput = {
  name: string;
  partnerType: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  rating: number;
};

export async function updateShippingPartner(partnerId: string, payload: UpdateShippingPartnerInput) {
  const res = await apiClient.patch<MaybeWrapped<ShippingPartner>>(
    `/api/admin/shipping/partners/${partnerId}`,
    payload,
  );
  return unwrap(res.data);
}

export async function deleteShippingPartner(partnerId: string) {
  const res = await apiClient.delete<MaybeWrapped<unknown>>(
    `/api/admin/shipping/partners/${partnerId}`,
  );
  return unwrap(res.data);
}