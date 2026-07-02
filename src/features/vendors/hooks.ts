/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import { vendorKeys } from "./key";
import {
  approveVendor,
  rejectVendor,
  suspendVendor,
  getVendors,
  getVendorByUserId,
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

import { activateUser } from "@/src/features/users/api"; // POST /api/Admin/users/{userId}/activate

function enabledAdmin(status: string, accessToken?: string, role?: string) {
  return status === "authenticated" && !!accessToken && role === "Admin";
}

/** Patch vendor across all cached lists (paginated or arrays). Match by profileId or userId. */
function patchVendorInLists(
  qc: ReturnType<typeof useQueryClient>,
  match: { vendorProfileId?: string; userId?: string },
  patch: Partial<VendorProfile>,
) {
  qc.setQueriesData(
    { queryKey: vendorKeys.lists() },
    (old: any) => {
      if (!old) return old;

      const patchOne = (v: VendorProfile) => {
        const okByProfileId = match.vendorProfileId && v?.id === match.vendorProfileId;
        const okByUserId = match.userId && v?.userId === match.userId;
        return okByProfileId || okByUserId ? { ...v, ...patch } : v;
      };

      if (Array.isArray(old)) return old.map(patchOne);
      if (Array.isArray(old?.items)) return { ...old, items: old.items.map(patchOne) };
      if (Array.isArray(old?.data)) return { ...old, data: old.data.map(patchOne) };

      return old;
    },
  );
}

/** ---------------- List ---------------- */
export function useVendors(query: { page: number; pageSize: number }) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery<Paginated<VendorProfile>>({
    queryKey: vendorKeys.list(query),
    enabled: enabledAdmin(status, accessToken, role),
    queryFn: () => getVendors(query.page, query.pageSize),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

/** ---------------- Detail (by userId) ---------------- */
export function useVendor(userId?: string) {
  const qc = useQueryClient();
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery<VendorProfile>({
    queryKey: userId ? vendorKeys.detail(userId) : ["vendors", "detail", "missing"],
    enabled: !!userId && enabledAdmin(status, accessToken, role),
    queryFn: () => getVendorByUserId(userId!),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    initialData: () => {
      if (!userId) return undefined;

      const listQueries = qc.getQueriesData<any>({ queryKey: vendorKeys.lists() });
      for (const [, cached] of listQueries) {
        const arr = Array.isArray(cached)
          ? cached
          : Array.isArray(cached?.items)
            ? cached.items
            : Array.isArray(cached?.data)
              ? cached.data
              : null;

        if (!arr) continue;
        const found = arr.find((v: VendorProfile) => v?.userId === userId);
        if (found) return found;
      }
      return undefined;
    },
  });
}

/** ---------------- Reactivate suspended vendor (by userId) ---------------- */
export function useReactivateVendorOwner() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => activateUser(userId),

    onMutate: async (userId) => {
      const toastId = toast.loading("Reactivating vendor...");
      await qc.cancelQueries({ queryKey: vendorKeys.all });

      const prev = qc.getQueryData<VendorProfile>(vendorKeys.detail(userId));

      qc.setQueryData<VendorProfile>(vendorKeys.detail(userId), (old) =>
        old
          ? { ...old, isSuspended: false, suspensionReason: null, suspendedAt: null }
          : old,
      );

      patchVendorInLists(qc, { userId }, { isSuspended: false, suspensionReason: null, suspendedAt: null });

      return { toastId, prev, userId };
    },

    onError: (err, _userId, ctx) => {
      if (ctx?.prev) qc.setQueryData(vendorKeys.detail(ctx.userId), ctx.prev);
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },

    onSuccess: (_res, _userId, ctx) => {
      toast.success("Vendor reactivated", { id: ctx?.toastId });
    },

    onSettled: async (_res, _err, userId) => {
      await qc.invalidateQueries({ queryKey: vendorKeys.detail(userId) });
      await qc.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });
}

/** ---------------- Admin actions (profileId) ---------------- */
export function useApproveVendor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vendorProfileId: string) => approveVendor(vendorProfileId),
    onMutate: () => ({ toastId: toast.loading("Approving vendor...") }),
    onSuccess: async (res, vendorProfileId, ctx) => {
      toast.success(res?.message ?? "Vendor approved", { id: ctx?.toastId });
      patchVendorInLists(qc, { vendorProfileId }, { verificationStatus: "Verified", isVerified: true });
      await qc.invalidateQueries({ queryKey: vendorKeys.all });
    },
    onError: (err, _id, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useRejectVendor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { vendorProfileId: string; reason: string }) =>
      rejectVendor(vars.vendorProfileId, vars.reason),
    onMutate: () => ({ toastId: toast.loading("Rejecting vendor...") }),
    onSuccess: async (res, vars, ctx) => {
      toast.success(res?.message ?? "Vendor rejected", { id: ctx?.toastId });
      patchVendorInLists(qc, { vendorProfileId: vars.vendorProfileId }, { verificationStatus: "NotVerified", isVerified: false });
      await qc.invalidateQueries({ queryKey: vendorKeys.all });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useSuspendVendor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { vendorProfileId: string; reason: string }) =>
      suspendVendor(vars.vendorProfileId, vars.reason),

    onMutate: async (vars) => {
      const toastId = toast.loading("Suspending store...");
      await qc.cancelQueries({ queryKey: vendorKeys.all });

      patchVendorInLists(qc, { vendorProfileId: vars.vendorProfileId }, { isSuspended: true, suspensionReason: vars.reason });

      return { toastId };
    },

    onSuccess: (res, _vars, ctx) => {
      toast.success(res?.message ?? "Store suspended", { id: ctx?.toastId });
    },

    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),

    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: vendorKeys.all });
    },
  });
}

/** ---------------- Update vendor (PATCH by userId) ---------------- */
export function useUpdateVendor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { userId: string; payload: UpdateVendorInput }) =>
      updateVendor(vars.userId, vars.payload),

    onMutate: async (vars) => {
      const toastId = toast.loading("Saving vendor changes...");
      await qc.cancelQueries({ queryKey: vendorKeys.all });

      const prev = qc.getQueryData<VendorProfile>(vendorKeys.detail(vars.userId));

      qc.setQueryData<VendorProfile>(vendorKeys.detail(vars.userId), (old) =>
        old ? { ...old, ...vars.payload } : old,
      );

      patchVendorInLists(qc, { userId: vars.userId }, vars.payload as any);

      return { toastId, prev, userId: vars.userId };
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(vendorKeys.detail(ctx.userId), ctx.prev);
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },

    onSuccess: (updated, vars, ctx) => {
      toast.success("Vendor updated", { id: ctx?.toastId });
      qc.setQueryData(vendorKeys.detail(vars.userId), updated);
      patchVendorInLists(qc, { userId: vars.userId }, updated);
    },

    onSettled: async (_res, _err, vars) => {
      await qc.invalidateQueries({ queryKey: vendorKeys.detail(vars.userId) });
      await qc.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });
}

/** ---------------- Sub-resources ---------------- */
export function useVendorOrders(
  vendorProfileId?: string,
  params?: { currency?: string; pageNumber: number; pageSize: number },
) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: vendorProfileId && params ? vendorKeys.orders(vendorProfileId, params) : ["vendors", "orders", "missing"],
    enabled: !!vendorProfileId && !!params && enabledAdmin(status, accessToken, role),
    queryFn: () => getVendorOrders(vendorProfileId!, params!),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export function useVendorKyc(vendorProfileId?: string) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: vendorProfileId ? vendorKeys.kyc(vendorProfileId) : ["vendors", "kyc", "missing"],
    enabled: !!vendorProfileId && enabledAdmin(status, accessToken, role),
    queryFn: () => getVendorKyc(vendorProfileId!),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useVendorPayouts(
  vendorProfileId?: string,
  params?: { currency?: string; pageNumber: number; pageSize: number },
) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: vendorProfileId && params ? vendorKeys.payouts(vendorProfileId, params) : ["vendors", "payouts", "missing"],
    enabled: !!vendorProfileId && !!params && enabledAdmin(status, accessToken, role),
    queryFn: () => getVendorPayouts(vendorProfileId!, params!),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export function useVendorReviewSummary(vendorProfileId?: string) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: vendorProfileId ? vendorKeys.reviewSummary(vendorProfileId) : ["vendors", "review-summary", "missing"],
    enabled: !!vendorProfileId && enabledAdmin(status, accessToken, role),
    queryFn: () => getVendorReviewSummary(vendorProfileId!),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useVendorReviews(
  vendorProfileId?: string,
  params?: { pageNumber: number; pageSize: number },
) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: vendorProfileId && params ? vendorKeys.reviews(vendorProfileId, params) : ["vendors", "reviews", "missing"],
    enabled: !!vendorProfileId && !!params && enabledAdmin(status, accessToken, role),
    queryFn: () => getVendorReviews(vendorProfileId!, params!),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}