/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";
import { locationKeys } from "./key";
import {
  createAdminLocation,
  getAdminLocations,
  getAdminLocationStats,
  getCountries,
  getStatesByCountry,
  toggleStateStatus,
  updateAdminLocation,
  type CreateAdminLocationInput,
  type UpdateAdminLocationInput,
} from "./api";

export function useAdminLocations() {
  return useQuery({
    queryKey: locationKeys.adminList(),
    queryFn: () => getAdminLocations(),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useAdminLocationStats() {
  return useQuery({
    queryKey: locationKeys.adminStats(),
    queryFn: () => getAdminLocationStats(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useCountries(activeOnly = true, enabled = true) {
  return useQuery({
    queryKey: locationKeys.countries(activeOnly),
    enabled,
    queryFn: () => getCountries({ activeOnly }),
    staleTime: 24 * 60 * 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useStatesByCountry(countryId?: number, enabled = true) {
  return useQuery({
    queryKey: countryId ? locationKeys.states(countryId) : ["locations", "states", "missing"],
    enabled: !!countryId && enabled,
    queryFn: () => getStatesByCountry(countryId!),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateAdminLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAdminLocationInput) => createAdminLocation(payload),
    onMutate: () => ({ toastId: toast.loading("Creating location...") }),
    onSuccess: async (_created, _vars, ctx) => {
      toast.success("Location created", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: locationKeys.adminList() });
      await qc.invalidateQueries({ queryKey: locationKeys.adminStats() });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useUpdateAdminLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { locationId: string; payload: UpdateAdminLocationInput }) =>
      updateAdminLocation(vars.locationId, vars.payload),
    onMutate: () => ({ toastId: toast.loading("Updating location...") }),
    onSuccess: async (_updated, _vars, ctx) => {
      toast.success("Location updated", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: locationKeys.adminList() });
      await qc.invalidateQueries({ queryKey: locationKeys.adminStats() });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useToggleStateStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { stateId: number; countryId: number }) => toggleStateStatus(vars.stateId),
    onMutate: () => ({ toastId: toast.loading("Toggling state...") }),
    onSuccess: async (_res, vars, ctx) => {
      toast.success("State status updated", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: locationKeys.states(vars.countryId) });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}