/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { analyticsKeys } from "./key";
import {
  getDashboardStats,
  getMonthlyOrders,
  getMonthlyRevenue,
  getRecentAdminOrders,
  getTopPerformingProducts,
  type DashboardStatsQuery,
  type MonthlyOrdersQuery,
  type MonthlyRevenueQuery,
  type RecentOrdersQuery,
  type TopProductsQuery,
} from "./api";

function enabledAdmin(status: string, accessToken?: string, role?: string) {
  return status === "authenticated" && !!accessToken && role === "Admin";
}

export function useDashboardStats(q: DashboardStatsQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: analyticsKeys.dashboardStats(q),
    enabled: enabledAdmin(status, accessToken, role),
    queryFn: () => getDashboardStats(q),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useMonthlyRevenue(q: MonthlyRevenueQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: analyticsKeys.monthlyRevenue(q),
    enabled: enabledAdmin(status, accessToken, role),
    queryFn: () => getMonthlyRevenue(q),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useMonthlyOrders(q: MonthlyOrdersQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: analyticsKeys.monthlyOrders(q),
    enabled: enabledAdmin(status, accessToken, role),
    queryFn: () => getMonthlyOrders(q),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useTopProducts(q: TopProductsQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: analyticsKeys.topProducts(q),
    enabled: enabledAdmin(status, accessToken, role),
    queryFn: () => getTopPerformingProducts(q),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useRecentAdminOrders(q: RecentOrdersQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: analyticsKeys.recentOrders(q),
    enabled: enabledAdmin(status, accessToken, role),
    queryFn: () => getRecentAdminOrders(q),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}