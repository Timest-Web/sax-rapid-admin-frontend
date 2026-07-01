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


export type AuditLogStatsDto = {
  totalLogsToday: number;
  criticalEventsCount: number;
  topActor: string;
};

export type AuditLogDto = {
  id: string;
  action: string; 
  category: string; 
  actorName: string | null;
  actorEmail: string | null;
  ipAddress: string | null;
  details: string | null;
  createdAt: string;
};

export type AuditLogsQuery = {
  Category?: string;
  Actor?: string;
  DateFrom?: string; 
  DateTo?: string; 
  PageNumber: number;
  PageSize: number;
};



export async function getAuditLogStats() {
  const res = await apiClient.get<ApiResponse<AuditLogStatsDto>>(
    "/api/admin/audit-logs/stats",
  );
  return unwrap(res.data);
}

export async function getAuditLogs(query: AuditLogsQuery) {
  const res = await apiClient.get<ApiResponse<AuditLogDto[]>>(
    "/api/admin/audit-logs",
    { params: query },
  );
  return unwrap(res.data);
}