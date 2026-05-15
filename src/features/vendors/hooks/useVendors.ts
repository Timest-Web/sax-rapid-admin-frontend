/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { vendorKeys } from "../key";
import { getVendors } from "../../users/api";

export function useVendors({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: vendorKeys.list({ page, pageSize }),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getVendors(page, pageSize),
    staleTime: 60_000,
    refetchOnWindowFocus: false,

    // key: don't “flash empty” when page changes
    placeholderData: keepPreviousData,
  });
}
