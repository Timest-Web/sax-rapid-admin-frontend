/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { dashboardKeys } from "../keys";
import { DashboardCurrency, getAdminDashboard, getDashboardGraph, getRecentOrders, getRecentTransactions } from "../api";

export function useDashboard() {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: dashboardKeys.summary(),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: getAdminDashboard,
    staleTime: 30_000, 
    refetchOnWindowFocus: true,
  });
}

export function useDashboardGraph(currency: DashboardCurrency, year: number) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: dashboardKeys.graph(currency, year),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getDashboardGraph({ currency, year }),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useRecentOrders(params: {
  currency: DashboardCurrency;
  pageNumber: number;
  pageSize: number;
  dateFrom?: string;
  dateTo?: string;
}) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: dashboardKeys.recentOrders(params),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getRecentOrders(params),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useRecentTransactions(params: {
  currency: DashboardCurrency;
  pageNumber: number;
  pageSize: number;
  dateFrom?: string;
  dateTo?: string;
}) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: dashboardKeys.recentTransactions(params),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getRecentTransactions(params),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}