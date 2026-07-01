/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { auditKeys } from "./key";
import { getAuditLogs, getAuditLogStats, type AuditLogsQuery } from "./api";

function enabledAdmin(status: string, accessToken?: string, role?: string) {
  return status === "authenticated" && !!accessToken && role === "Admin";
}

export function useAuditLogStats() {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: auditKeys.stats(),
    enabled: enabledAdmin(status, accessToken, role),
    queryFn: () => getAuditLogStats(),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useAuditLogs(query: AuditLogsQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: auditKeys.list(query),
    enabled: enabledAdmin(status, accessToken, role),
    queryFn: () => getAuditLogs(query),
    staleTime: 15_000,
    refetchOnWindowFocus: false,
  });
}