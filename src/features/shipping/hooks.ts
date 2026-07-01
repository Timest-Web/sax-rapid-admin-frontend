"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import { shippingKeys } from "./key";
import {
  createShippingPartner,
  deleteShippingPartner,
  getShippingPartners,
  getShippingStats,
  updateShippingPartner,
  type CreateShippingPartnerInput,
  type UpdateShippingPartnerInput,
} from "./api";

export function useShippingStats() {
  return useQuery({
    queryKey: shippingKeys.stats(),
    queryFn: () => getShippingStats(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useShippingPartners() {
  return useQuery({
    queryKey: shippingKeys.partners(),
    queryFn: () => getShippingPartners(),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateShippingPartner() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShippingPartnerInput) => createShippingPartner(payload),
    onMutate: () => ({ toastId: toast.loading("Adding partner...") }),
    onSuccess: async (_created, _vars, ctx) => {
      toast.success("Partner added", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: shippingKeys.partners() });
      await qc.invalidateQueries({ queryKey: shippingKeys.stats() });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useUpdateShippingPartner() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { partnerId: string; payload: UpdateShippingPartnerInput }) =>
      updateShippingPartner(vars.partnerId, vars.payload),
    onMutate: () => ({ toastId: toast.loading("Updating partner...") }),
    onSuccess: async (_updated, _vars, ctx) => {
      toast.success("Partner updated", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: shippingKeys.partners() });
      await qc.invalidateQueries({ queryKey: shippingKeys.stats() });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useDeleteShippingPartner() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (partnerId: string) => deleteShippingPartner(partnerId),
    onMutate: () => ({ toastId: toast.loading("Removing partner...") }),
    onSuccess: async (_res, _vars, ctx) => {
      toast.success("Partner removed", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: shippingKeys.partners() });
      await qc.invalidateQueries({ queryKey: shippingKeys.stats() });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}