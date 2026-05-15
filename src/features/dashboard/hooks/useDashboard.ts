/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { dashboardKeys } from "../keys";
import { getAdminDashboard } from "../api";

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
