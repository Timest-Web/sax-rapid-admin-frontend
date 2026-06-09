/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

type MaybeWrapped<T> = T | { success: boolean; message: string; data: T };

function unwrap<T>(payload: MaybeWrapped<T>): T {
  return (payload as any)?.data ?? (payload as T);
}

/* =========================
 * Public Location endpoints
 * ========================= */
export type CountryDto = {
  id: number;
  name: string;
  code: string;
  phoneCode: string;
  currency: string;
  currencySymbol: string;
  isActive: boolean;
  isComingSoon: boolean;
};

export type StateDto = {
  id: number;
  name: string;
  countryId: number;
  countryName: string;
  isActive: boolean;
};

export async function getCountries(params?: { activeOnly?: boolean }) {
  const res = await apiClient.get<MaybeWrapped<CountryDto[]>>("/api/Location/countries", {
    params: { activeOnly: params?.activeOnly ?? true },
  });
  return unwrap(res.data);
}

export async function getStatesByCountry(countryId: number) {
  const res = await apiClient.get<MaybeWrapped<StateDto[]>>(
    `/api/Location/countries/${countryId}/states`,
  );
  return unwrap(res.data);
}

/* =========================
 * Admin Location endpoints
 * ========================= */
export type AdminLocation = {
  id: string;            // "LOC-07"
  locationCode: string;  // ""
  countryName: string;   // "Nigeria"
  marketStatus: string;  // "Active" | "Inactive" (string)
  vendorCount: number;
  revenue: number;
  currency: string;
  createdAt: string;     // ISO
};

export type AdminLocationStats = {
  totalCountries: number;
  activeMarkets: number;
  averageRevenuePerLocation: number;
};

export async function getAdminLocations() {
  const res = await apiClient.get<MaybeWrapped<AdminLocation[]>>("/api/admin/locations");
  return unwrap(res.data); // array
}

export async function getAdminLocationStats() {
  const res = await apiClient.get<MaybeWrapped<AdminLocationStats>>("/api/admin/locations/stats");
  return unwrap(res.data);
}

export type CreateAdminLocationInput = {
  name: string;        // backend expects
  code: string;        // backend expects (ISO)
  currency: string;    // backend expects
  marketStatus: string; // backend expects
};

export async function createAdminLocation(payload: CreateAdminLocationInput) {
  const res = await apiClient.post<MaybeWrapped<AdminLocation>>("/api/admin/locations", payload);
  return unwrap(res.data);
}

export type UpdateAdminLocationInput = {
  name?: string;
  marketStatus?: string;
  currency?: string;
};

export async function updateAdminLocation(locationId: string, payload: UpdateAdminLocationInput) {
  const res = await apiClient.patch<MaybeWrapped<AdminLocation>>(
    `/api/admin/locations/${locationId}`,
    payload,
  );
  return unwrap(res.data);
}

export async function toggleStateStatus(stateId: number) {
  const res = await apiClient.patch<MaybeWrapped<null>>(
    `/api/admin/locations/states/${stateId}/toggle`,
  );
  return unwrap(res.data); // null
}