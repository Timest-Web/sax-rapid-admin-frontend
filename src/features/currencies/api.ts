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


export type SystemCurrencyDto = {
  id: number;
  code: string;
  name: string;
  symbol: string;
  exchangeRateToUsd: number;
  isActive: boolean;
  region: string;
};


export type CreateCurrencyInput = {
  code: string;
  name: string;
  symbol: string;
  exchangeRateToUsd: number;
  isActive: boolean;
  region: string;
};

export type UpdateCurrencyInput = {
  exchangeRateToUsd: number;
  isActive: boolean;
  region: string;
};


export async function getSystemCurrencies() {
  const res = await apiClient.get<ApiResponse<SystemCurrencyDto[]>>(
    "/api/system/currencies",
  );
  return unwrap(res.data);
}

export async function createSystemCurrency(payload: CreateCurrencyInput) {
  const res = await apiClient.post<SystemCurrencyDto>(
    "/api/system/currencies",
    payload,
  );
  return unwrap(res.data as any);
}

export async function updateSystemCurrency(currencyCode: string, payload: UpdateCurrencyInput) {
  const res = await apiClient.patch<ApiResponse<boolean> | any>(
    `/api/system/currencies/${currencyCode}`,
    payload,
  );
  return unwrap(res.data);
}