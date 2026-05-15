/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { vendorKeys } from "../key";
import { getVendorById, VendorProfile } from "../api";

export function useVendor(vendorId?: string) {
  const qc = useQueryClient();

  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: vendorId ? vendorKeys.detail(vendorId) : ["admin-vendors", "detail", "missing"],
    enabled: !!vendorId && status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getVendorById(vendorId!),
    staleTime: 60_000,
    refetchOnWindowFocus: false,

    // key: seed detail from list cache if it exists
    initialData: () => {
      if (!vendorId) return undefined;

      // search across all cached vendor lists
      const listQueries = qc.getQueriesData<any>({ queryKey: vendorKeys.lists() });

      for (const [, cached] of listQueries) {
        // if your list is an array:
        if (Array.isArray(cached)) {
          const found = cached.find((v: VendorProfile) => v.id === vendorId);
          if (found) return found;
        }

        // if your list is shaped like { data: VendorProfile[] } or { items: VendorProfile[] }, adapt here.
        const arr = cached?.data ?? cached?.items;
        if (Array.isArray(arr)) {
          const found = arr.find((v: VendorProfile) => v.id === vendorId);
          if (found) return found;
        }
      }

      return undefined;
    },
  });
}