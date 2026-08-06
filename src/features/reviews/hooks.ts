/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import { reviewKeys } from "./key";
import {
  flagReview,
  getRecentReviews,
  getReviewById,
  getReviewStats,
  getVendorRatings,
  type Paginated,
  type RecentReviewItem,
  type ReviewDetails,
} from "./api";

export function useReviewStats() {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: reviewKeys.stats(),
    enabled: status === "authenticated" && !!accessToken && ["SuperAdmin", "Admin", "Sales", "Account"].includes(String(role)),
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
    enabled: status === "authenticated" && !!accessToken && ["SuperAdmin", "Admin", "Sales", "Account"].includes(String(role)),
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
    enabled: status === "authenticated" && !!accessToken && ["SuperAdmin", "Admin", "Sales", "Account"].includes(String(role)),
    queryFn: () => getVendorRatings(page, pageSize),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

type RecentReviewWithLocalFlag = RecentReviewItem & { isFlagged?: boolean };

export function useFlagReview() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => flagReview(reviewId),

    onMutate: async (reviewId) => {
      const toastId = toast.loading("Flagging review...");

      // cancel any recent lists (all pages)
      await qc.cancelQueries({ queryKey: reviewKeys.recentBase() });

      const prevRecent = qc.getQueriesData({
        queryKey: reviewKeys.recentBase(),
      });

      // optimistic: set isFlagged=true across cached recent lists
      qc.setQueriesData(
        { queryKey: reviewKeys.recentBase() },
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

      // optimistic: update detail cache if present
      qc.setQueryData(reviewKeys.detail(reviewId), (old: ReviewDetails | undefined) => {
        if (!old) return old;
        return { ...old, isFlagged: true };
      });

      return { toastId, prevRecent };
    },

    onError: (err, _reviewId, ctx) => {
      ctx?.prevRecent?.forEach(([key, data]: any) => qc.setQueryData(key, data));
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },

    onSuccess: (_res, _reviewId, ctx) => {
      toast.success("Review flagged", { id: ctx?.toastId });
    },

    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: reviewKeys.stats() });
      await qc.invalidateQueries({ queryKey: reviewKeys.recentBase() });
    },
  });
}

export function useReview(reviewId?: string) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: reviewId
      ? reviewKeys.detail(reviewId)
      : ["admin-reviews", "detail", "missing"],
    enabled: !!reviewId && status === "authenticated" && !!accessToken && ["SuperAdmin", "Admin", "Sales", "Account"].includes(String(role)),
    queryFn: () => getReviewById(reviewId!),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}