/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import { currencyKeys } from "./key";
import {
  createSystemCurrency,
  getSystemCurrencies,
  updateSystemCurrency,
  type CreateCurrencyInput,
  type UpdateCurrencyInput,
} from "./api";

function enabledAdmin(status: string, accessToken?: string, role?: string) {
  return status === "authenticated" && !!accessToken && role === "Admin";
}

export function useSystemCurrencies() {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const role = (session as any)?.role as string | undefined;

  return useQuery({
    queryKey: currencyKeys.list(),
    enabled: enabledAdmin(status, accessToken, role),
    queryFn: () => getSystemCurrencies(),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateCurrency() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCurrencyInput) => createSystemCurrency(payload),
    onMutate: () => ({ toastId: toast.loading("Creating currency...") }),
    onSuccess: (_data, _vars, ctx) => {
      toast.success("Currency created", { id: ctx?.toastId });
    },
    onError: (err, _vars, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: currencyKeys.all });
    },
  });
}

export function useUpdateCurrency() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { currencyCode: string; payload: UpdateCurrencyInput }) =>
      updateSystemCurrency(vars.currencyCode, vars.payload),

    onMutate: () => ({ toastId: toast.loading("Updating currency...") }),
    onSuccess: (_ok, _vars, ctx) => {
      toast.success("Currency updated", { id: ctx?.toastId });
    },
    onError: (err, _vars, ctx) => {
      toast.error(getErrorMessage(err), { id: ctx?.toastId });
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: currencyKeys.all });
    },
  });
}