/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};

function unwrap<T>(payload: ApiResponse<T> | T): T {
  return (payload as any)?.data ?? (payload as T);
}

export type IntegrationDto = {
  id: string;
  name: string;
  type: string;
  status: string;
  lastSyncAt: string | null;
  configJson: string | null;
  description: string | null;
  logoUrl: string | null;
  createdAt: string;
};

export type CreateIntegrationInput = {
  name: string;
  type: string;
  status: string;
  configJson: string;
  description: string;
  logoUrl: string;
};

/** -------- API calls -------- */
export async function getIntegrations() {
  const res = await apiClient.get<ApiResponse<IntegrationDto[]>>(
    "/api/admin/integrations",
  );
  return unwrap(res.data);
}

export async function createIntegration(payload: CreateIntegrationInput) {
  const res = await apiClient.post<ApiResponse<IntegrationDto>>(
    "/api/admin/integrations",
    payload,
  );
  return unwrap(res.data);
}

export async function toggleIntegration(integrationId: string) {
  const res = await apiClient.patch<ApiResponse<boolean>>(
    `/api/admin/integrations/${integrationId}/toggle`,
  );
  return unwrap(res.data);
}