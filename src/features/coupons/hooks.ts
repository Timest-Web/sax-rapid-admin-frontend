/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import { couponKeys } from "./key";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  getCouponStats,
  updateCoupon,
  type CouponsQuery,
  type CreateCouponInput,
  type UpdateCouponInput,
} from "./api";

export function useCouponStats() {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: couponKeys.stats(),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getCouponStats(),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useCoupons(query: CouponsQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: couponKeys.list(query),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getCoupons(query),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCouponInput) => createCoupon(payload),
    onMutate: () => ({ toastId: toast.loading("Creating coupon...") }),
    onSuccess: async (_created, _vars, ctx) => {
      toast.success("Coupon created", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: couponKeys.lists() });
      await qc.invalidateQueries({ queryKey: couponKeys.stats() });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { couponId: string; payload: UpdateCouponInput }) =>
      updateCoupon(vars.couponId, vars.payload),
    onMutate: () => ({ toastId: toast.loading("Updating coupon...") }),
    onSuccess: async (_updated, _vars, ctx) => {
      toast.success("Coupon updated", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: couponKeys.lists() });
      await qc.invalidateQueries({ queryKey: couponKeys.stats() });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (couponId: string) => deleteCoupon(couponId),
    onMutate: () => ({ toastId: toast.loading("Deleting coupon...") }),
    onSuccess: async (_res, _couponId, ctx) => {
      toast.success("Coupon deleted", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: couponKeys.lists() });
      await qc.invalidateQueries({ queryKey: couponKeys.stats() });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}