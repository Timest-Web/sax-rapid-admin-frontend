"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";
import { promoKeys } from "./key";
import {
  getPromotionStats,
  getCampaigns,
  updateCampaignStatus,
  createCampaign,
  type CampaignsQuery,
  type CreateCampaignInput,
} from "./api";

export function usePromotionStats() {
  return useQuery({
    queryKey: promoKeys.stats(),
    queryFn: () => getPromotionStats(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useCampaigns(query?: CampaignsQuery) {
  return useQuery({
    queryKey: promoKeys.campaigns(query ?? {}),
    queryFn: () => getCampaigns(query),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateCampaignStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { campaignId: string; status: string }) =>
      updateCampaignStatus(vars.campaignId, vars.status),
    onMutate: () => ({ toastId: toast.loading("Updating campaign...") }),
    onSuccess: async (_res, _vars, ctx) => {
      toast.success("Campaign updated", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: promoKeys.all });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCampaignInput) => createCampaign(payload),
    onMutate: () => ({ toastId: toast.loading("Creating campaign...") }),
    onSuccess: async (_res, _vars, ctx) => {
      toast.success("Campaign created", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: promoKeys.all });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}