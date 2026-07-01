"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import { cmsKeys } from "./key";
import {
  createCmsPage,
  deleteCmsPage,
  getCmsPages,
  getCmsStats,
  updateCmsPage,
  type CmsPagesQuery,
  type UpsertCmsPageInput,
} from "./api";

export function useCmsStats() {
  return useQuery({
    queryKey: cmsKeys.stats(),
    queryFn: () => getCmsStats(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useCmsPages(query?: CmsPagesQuery) {
  return useQuery({
    queryKey: cmsKeys.pages(query ?? {}),
    queryFn: () => getCmsPages(query),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateCmsPage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertCmsPageInput) => createCmsPage(payload),
    onMutate: () => ({ toastId: toast.loading("Creating page...") }),
    onSuccess: async (_created, _vars, ctx) => {
      toast.success("Page created", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: cmsKeys.pages({}) });
      await qc.invalidateQueries({ queryKey: cmsKeys.stats() });
    },
    onError: (err, _vars, ctx) =>
      toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useUpdateCmsPage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { pageId: string; payload: UpsertCmsPageInput }) =>
      updateCmsPage(vars.pageId, vars.payload),
    onMutate: () => ({ toastId: toast.loading("Updating page...") }),
    onSuccess: async (_updated, _vars, ctx) => {
      toast.success("Page updated", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: cmsKeys.pages({}) });
      await qc.invalidateQueries({ queryKey: cmsKeys.stats() });
    },
    onError: (err, _vars, ctx) =>
      toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useDeleteCmsPage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pageId: string) => deleteCmsPage(pageId),
    onMutate: () => ({ toastId: toast.loading("Deleting page...") }),
    onSuccess: async (_res, _pageId, ctx) => {
      toast.success("Page deleted", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: cmsKeys.pages({}) });
      await qc.invalidateQueries({ queryKey: cmsKeys.stats() });
    },
    onError: (err, _vars, ctx) =>
      toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}