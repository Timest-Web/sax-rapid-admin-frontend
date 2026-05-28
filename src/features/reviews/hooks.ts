/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import { reviewKeys } from "./key";
import { flagReview, getRecentReviews, getReviewStats, getVendorRatings, type Paginated, type RecentReviewItem } from "./api";

export function useReviewStats() {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: reviewKeys.stats(),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getReviewStats(),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useRecentReviews(page = 1, pageSize = 20) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: reviewKeys.recentList({ page, pageSize }),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getRecentReviews(page, pageSize),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useVendorRatings(page = 1, pageSize = 20) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: reviewKeys.ratingsList({ page, pageSize }),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getVendorRatings(page, pageSize),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

/**
 * Backend does not return "flagged" on review rows,
 * so we store a local `isFlagged` field in cache and derive status from it.
 */
type RecentReviewWithLocalFlag = RecentReviewItem & { isFlagged?: boolean };

export function useFlagReview() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => flagReview(reviewId),

    onMutate: async (reviewId) => {
      const toastId = toast.loading("Flagging review...");

      await qc.cancelQueries({ queryKey: reviewKeys.recent() });

      const prev = qc.getQueriesData({ queryKey: reviewKeys.recent() });

      // optimistic: set isFlagged=true across all cached recent lists
      qc.setQueriesData(
        { queryKey: reviewKeys.recent() },
        (old: Paginated<RecentReviewWithLocalFlag> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((r) =>
              r.id === reviewId ? { ...r, isFlagged: true } : r,
            ),
          };
        },
      );

      return { toastId, prev };
    },

    onError: (err, _reviewId, ctx) => {
      ctx?.prev?.forEach(([key, data]: any) => qc.setQueryData(key, data));
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },

    onSuccess: (_res, _reviewId, ctx) => {
      toast.success("Review flagged", { id: ctx?.toastId });
    },

    onSettled: async () => {
      // refresh stats (flagged count) and list from server
      await qc.invalidateQueries({ queryKey: reviewKeys.stats() });
      await qc.invalidateQueries({ queryKey: reviewKeys.recent() });
    },
  });
}