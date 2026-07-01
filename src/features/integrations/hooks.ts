/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import { integrationKeys } from "./key";
import {
  createIntegration,
  getIntegrations,
  toggleIntegration,
  type CreateIntegrationInput,
} from "./api";

function enabledAdmin(status: string, accessToken?: string, role?: string) {
  return status === "authenticated" && !!accessToken && role === "Admin";
}

export function useIntegrations() {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: integrationKeys.list(),
    enabled: enabledAdmin(status, accessToken, role),
    queryFn: () => getIntegrations(),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateIntegration() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateIntegrationInput) => createIntegration(payload),
    onMutate: () => ({ toastId: toast.loading("Creating integration...") }),
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Integration created", { id: ctx?.toastId });
    },
    onError: (err, _vars, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: integrationKeys.all });
    },
  });
}

export function useToggleIntegration() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (integrationId: string) => toggleIntegration(integrationId),
    onMutate: () => ({ toastId: toast.loading("Updating integration...") }),
    onSuccess: (_ok, _vars, ctx) => {
      toast.success("Integration updated", { id: ctx?.toastId });
    },
    onError: (err, _vars, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: integrationKeys.all });
    },
  });
}