/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/lib/get-error";

import { roleKeys } from "./key";
import {
  createAdminRole,
  deleteAdminRole,
  getAdminRolePermissions,
  getAdminRoles,
  getAdminRoleStats,
  updateAdminRole,
  updateAdminRolePermissions,
  type CreateRoleInput,
  type UpdateRoleInput,
} from "./api";

export function useAdminRoles() {
  return useQuery({
    queryKey: roleKeys.list(),
    queryFn: () => getAdminRoles(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useAdminRoleStats() {
  return useQuery({
    queryKey: roleKeys.stats(),
    queryFn: () => getAdminRoleStats(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateAdminRole() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoleInput) => createAdminRole(payload),
    onMutate: () => ({ toastId: toast.loading("Creating role...") }),
    onSuccess: async (_created, _vars, ctx) => {
      toast.success("Role created", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: roleKeys.list() });
      await qc.invalidateQueries({ queryKey: roleKeys.stats() });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useUpdateAdminRole() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { roleId: string; payload: UpdateRoleInput }) =>
      updateAdminRole(vars.roleId, vars.payload),
    onMutate: () => ({ toastId: toast.loading("Updating role...") }),
    onSuccess: async (_res, _vars, ctx) => {
      toast.success("Role updated", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: roleKeys.list() });
      await qc.invalidateQueries({ queryKey: roleKeys.stats() });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useDeleteAdminRole() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (roleId: string) => deleteAdminRole(roleId),
    onMutate: () => ({ toastId: toast.loading("Deleting role...") }),
    onSuccess: async (_res, _vars, ctx) => {
      toast.success("Role deleted", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: roleKeys.list() });
      await qc.invalidateQueries({ queryKey: roleKeys.stats() });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}

export function useAdminRolePermissions(roleId?: string, enabled?: boolean) {
  return useQuery({
    queryKey: roleId ? roleKeys.permissions(roleId) : ["admin-roles", "permissions", "missing"],
    enabled: !!roleId && !!enabled,
    queryFn: () => getAdminRolePermissions(roleId!),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateAdminRolePermissions() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { roleId: string; permissions: string[] }) =>
      updateAdminRolePermissions(vars.roleId, vars.permissions),
    onMutate: () => ({ toastId: toast.loading("Updating permissions...") }),
    onSuccess: async (_res, vars, ctx) => {
      toast.success("Permissions updated", { id: ctx?.toastId });
      await qc.invalidateQueries({ queryKey: roleKeys.permissions(vars.roleId) });
      await qc.invalidateQueries({ queryKey: roleKeys.list() });
      await qc.invalidateQueries({ queryKey: roleKeys.stats() });
    },
    onError: (err, _vars, ctx) => toast.error(getErrorMessage(err), { id: ctx?.toastId }),
  });
}