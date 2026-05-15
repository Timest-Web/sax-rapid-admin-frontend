/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import {
  activateSubscriptionPackage,
  createSubscriptionPlan,
  deactivateSubscriptionPackage,
  getSubscriptionPlanById,
  getSubscriptionPlans,
  updateSubscriptionPlan,
  type CreatePlanInput,
  type SubscriptionPlan,
  type SubscriptionPlansQuery,
  type UpdatePlanInput,
} from "./api";
import { subscriptionKeys } from "./key";

function patchPlanInLists(
  qc: ReturnType<typeof useQueryClient>,
  planId: string,
  patch: (p: SubscriptionPlan) => SubscriptionPlan,
) {
  qc.setQueriesData<SubscriptionPlan[]>(
    { queryKey: subscriptionKeys.lists() },
    (old) => old?.map((p) => (p.id === planId ? patch(p) : p)),
  );
}

export function useSubscriptionPlans(query: SubscriptionPlansQuery) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: subscriptionKeys.list(query),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getSubscriptionPlans(query),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateSubscriptionPlan() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePlanInput) => createSubscriptionPlan(payload),
    onMutate: () => ({ toastId: toast.loading("Creating plan...") }),
    onSuccess: async (_created, _vars, ctx) => {
      toast.success("Plan created", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: subscriptionKeys.lists() });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useUpdateSubscriptionPlan() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, payload }: { planId: string; payload: UpdatePlanInput }) =>
      updateSubscriptionPlan(planId, payload),
    onMutate: () => ({ toastId: toast.loading("Updating plan...") }),
    onSuccess: async (_updated, _vars, ctx) => {
      toast.success("Plan updated", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: subscriptionKeys.lists() });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useActivateSubscriptionPlan() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => activateSubscriptionPackage(planId),
    onMutate: async (planId) => {
      const toastId = toast.loading("Activating plan...");
      await qc.cancelQueries({ queryKey: subscriptionKeys.all });

      const prevLists = qc.getQueriesData({ queryKey: subscriptionKeys.lists() });

      patchPlanInLists(qc, planId, (p) => ({ ...p, isActive: true }));

      return { toastId, prevLists, planId };
    },
    onError: (err, _planId, ctx) => {
      ctx?.prevLists?.forEach(([key, data]: any) => qc.setQueryData(key, data));
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
    onSuccess: (_res, _planId, ctx) => toast.success("Plan activated", { id: ctx?.toastId }),
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: subscriptionKeys.lists() });
    },
  });
}

export function useDeactivateSubscriptionPlan() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => deactivateSubscriptionPackage(planId),
    onMutate: async (planId) => {
      const toastId = toast.loading("Deactivating plan...");
      await qc.cancelQueries({ queryKey: subscriptionKeys.all });

      const prevLists = qc.getQueriesData({ queryKey: subscriptionKeys.lists() });

      patchPlanInLists(qc, planId, (p) => ({ ...p, isActive: false }));

      return { toastId, prevLists, planId };
    },
    onError: (err, _planId, ctx) => {
      ctx?.prevLists?.forEach(([key, data]: any) => qc.setQueryData(key, data));
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
    onSuccess: (_res, _planId, ctx) => toast.success("Plan deactivated", { id: ctx?.toastId }),
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: subscriptionKeys.lists() });
    },
  });
}

export function useSubscriptionPlan(planId?: string) {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: planId ? subscriptionKeys.detail(planId) : ["subscriptions", "detail", "missing"],
    enabled: !!planId && status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getSubscriptionPlanById(planId!),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}


export function useActiveSubscriptionPlans() {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: subscriptionKeys.list({ activeOnly: true }),
    enabled: status === "authenticated" && !!accessToken && role === "Admin",
    queryFn: () => getSubscriptionPlans({ activeOnly: true }),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}


