/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import { vendorKeys } from "./key";

// Vendor list endpoint you already use (kept as-is)
import { getVendors } from "../users/api";

// All vendor endpoints come from your vendors/api.ts
import {
  approveVendor,
  rejectVendor,
  suspendVendor,
  getVendorById,
  updateVendor,
  getVendorOrders,
  getVendorKyc,
  getVendorPayouts,
  getVendorReviewSummary,
  getVendorReviews,
  type VendorProfile,
  type UpdateVendorInput,
  type Paginated,
  type VendorOrderListItem,
  type VendorKycDoc,
  type VendorPayout,
  type VendorReviewSummary,
  type VendorReview,
} from "./api";

function enabledAdmin(status: string, accessToken?: string, role?: string) {
  return status === "authenticated" && !!accessToken && role === "Admin";
}

/** Patch vendor across all cached lists (array, {items}, {data}) */
function patchVendorInLists(
  qc: ReturnType<typeof useQueryClient>,
  vendorId: string,
  patch: Partial<VendorProfile>,
) {
  qc.setQueriesData(
    { queryKey: vendorKeys.lists() },
    (old: any) => {
      if (!old) return old;

      // 1) list is an array
      if (Array.isArray(old)) {
        return old.map((v: VendorProfile) => (v?.id === vendorId ? { ...v, ...patch } : v));
      }

      // 2) list is paginated { items: [] }
      if (Array.isArray(old?.items)) {
        return {
          ...old,
          items: old.items.map((v: VendorProfile) => (v?.id === vendorId ? { ...v, ...patch } : v)),
        };
      }

      // 3) list is wrapped { data: [] }
      if (Array.isArray(old?.data)) {
        return {
          ...old,
          data: old.data.map((v: VendorProfile) => (v?.id === vendorId ? { ...v, ...patch } : v)),
        };
      }

      return old;
    },
  );
}

/* ============================================================================
 * Vendors list
 * ==========================================================================*/
export function useVendors({ page, pageSize }: { page: number; pageSize: number }) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: vendorKeys.list({ page, pageSize }),
    enabled: enabledAdmin(status, accessToken, role),
    queryFn: () => getVendors(page, pageSize),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

/* ============================================================================
 * Vendor detail
 * ==========================================================================*/
export function useVendor(vendorId?: string) {
  const qc = useQueryClient();
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: vendorId ? vendorKeys.detail(vendorId) : ["vendors", "detail", "missing"],
    enabled: !!vendorId && enabledAdmin(status, accessToken, role),
    queryFn: () => getVendorById(vendorId!),
    staleTime: 60_000,
    refetchOnWindowFocus: false,

    // seed detail from any cached list query
    initialData: () => {
      if (!vendorId) return undefined;

      const listQueries = qc.getQueriesData<any>({ queryKey: vendorKeys.lists() });

      for (const [, cached] of listQueries) {
        if (!cached) continue;

        if (Array.isArray(cached)) {
          const found = cached.find((v: VendorProfile) => v?.id === vendorId);
          if (found) return found;
        }

        const arr = cached?.items ?? cached?.data;
        if (Array.isArray(arr)) {
          const found = arr.find((v: VendorProfile) => v?.id === vendorId);
          if (found) return found;
        }
      }

      return undefined;
    },
  });
}

/* ============================================================================
 * Admin actions
 * ==========================================================================*/
export function useApproveVendor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vendorId: string) => approveVendor(vendorId),
    onMutate: () => ({ toastId: toast.loading("Approving vendor...") }),
    onSuccess: async (res, vendorId, ctx) => {
      toast.success(res?.message ?? "Vendor approved", { id: ctx?.toastId });

      // optimistic patch (best effort)
      qc.setQueryData<VendorProfile>(vendorKeys.detail(vendorId), (old) =>
        old ? { ...old, verificationStatus: "Verified" } : old,
      );
      patchVendorInLists(qc, vendorId, { verificationStatus: "Verified" });

      await qc.invalidateQueries({ queryKey: vendorKeys.all });
      await qc.invalidateQueries({ queryKey: vendorKeys.detail(vendorId) });
    },
    onError: (err, _vendorId, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
  });
}

export function useRejectVendor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ vendorId, reason }: { vendorId: string; reason: string }) =>
      rejectVendor(vendorId, reason),
    onMutate: () => ({ toastId: toast.loading("Rejecting vendor...") }),
    onSuccess: async (res, vars, ctx) => {
      toast.success(res?.message ?? "Vendor rejected", { id: ctx?.toastId });

      // best effort patch
      qc.setQueryData<VendorProfile>(vendorKeys.detail(vars.vendorId), (old) =>
        old ? { ...old, verificationStatus: "NotVerified" } : old,
      );
      patchVendorInLists(qc, vars.vendorId, { verificationStatus: "NotVerified" });

      await qc.invalidateQueries({ queryKey: vendorKeys.all });
      await qc.invalidateQueries({ queryKey: vendorKeys.detail(vars.vendorId) });
    },
    onError: (err, _vars, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
  });
}

export function useSuspendVendor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ vendorId, reason }: { vendorId: string; reason: string }) =>
      suspendVendor(vendorId, reason),
    onMutate: () => ({ toastId: toast.loading("Suspending store...") }),
    onSuccess: async (res, vars, ctx) => {
      toast.success(res?.message ?? "Store suspended", { id: ctx?.toastId });

      await qc.invalidateQueries({ queryKey: vendorKeys.all });
      await qc.invalidateQueries({ queryKey: vendorKeys.detail(vars.vendorId) });
    },
    onError: (err, _vars, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
  });
}

/* ============================================================================
 * PATCH /api/Vendor/{id}
 * ==========================================================================*/
export function useUpdateVendor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { vendorId: string; payload: UpdateVendorInput }) =>
      updateVendor(vars.vendorId, vars.payload),

    onMutate: async (vars) => {
      const toastId = toast.loading("Saving vendor changes...");
      await qc.cancelQueries({ queryKey: vendorKeys.all });

      const prevDetail = qc.getQueryData<VendorProfile>(vendorKeys.detail(vars.vendorId));

      // optimistic detail patch
      qc.setQueryData<VendorProfile>(vendorKeys.detail(vars.vendorId), (old) =>
        old ? { ...old, ...vars.payload } : old,
      );
      patchVendorInLists(qc, vars.vendorId, vars.payload as any);

      return { toastId, prevDetail, vendorId: vars.vendorId };
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.prevDetail) qc.setQueryData(vendorKeys.detail(ctx.vendorId), ctx.prevDetail);
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },

    onSuccess: (updated, vars, ctx) => {
      toast.success("Vendor updated", { id: ctx?.toastId });

      qc.setQueryData(vendorKeys.detail(vars.vendorId), updated);
      patchVendorInLists(qc, vars.vendorId, updated);
    },

    onSettled: async (_res, _err, vars) => {
      await qc.invalidateQueries({ queryKey: vendorKeys.detail(vars.vendorId) });
      await qc.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });
}

/* ============================================================================
 * Sub-resources
 * ==========================================================================*/
export function useVendorOrders(
  vendorId?: string,
  params?: { currency?: string; pageNumber: number; pageSize: number },
) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: vendorId && params ? vendorKeys.orders(vendorId, params) : ["vendors", "orders", "missing"],
    enabled: !!vendorId && !!params && enabledAdmin(status, accessToken, role),
    queryFn: () => getVendorOrders(vendorId!, params!),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export function useVendorKyc(vendorId?: string) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: vendorId ? vendorKeys.kyc(vendorId) : ["vendors", "kyc", "missing"],
    enabled: !!vendorId && enabledAdmin(status, accessToken, role),
    queryFn: () => getVendorKyc(vendorId!),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useVendorPayouts(
  vendorId?: string,
  params?: { currency?: string; pageNumber: number; pageSize: number },
) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: vendorId && params ? vendorKeys.payouts(vendorId, params) : ["vendors", "payouts", "missing"],
    enabled: !!vendorId && !!params && enabledAdmin(status, accessToken, role),
    queryFn: () => getVendorPayouts(vendorId!, params!),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export function useVendorReviewSummary(vendorId?: string) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: vendorId ? vendorKeys.reviewSummary(vendorId) : ["vendors", "review-summary", "missing"],
    enabled: !!vendorId && enabledAdmin(status, accessToken, role),
    queryFn: () => getVendorReviewSummary(vendorId!),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useVendorReviews(
  vendorId?: string,
  params?: { pageNumber: number; pageSize: number },
) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: vendorId && params ? vendorKeys.reviews(vendorId, params) : ["vendors", "reviews", "missing"],
    enabled: !!vendorId && !!params && enabledAdmin(status, accessToken, role),
    queryFn: () => getVendorReviews(vendorId!, params!),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}