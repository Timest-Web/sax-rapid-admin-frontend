/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/src/lib/axios";

type MaybeWrapped<T> = T | { success: boolean; message: string; data: T };
function unwrap<T>(payload: MaybeWrapped<T>): T {
  return (payload as any)?.data ?? (payload as T);
}

export type AdminRole = {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
  adminCount: number;
  createdAt: string;
  updatedAt: string | null;
};

export type RoleStats = {
  totalRoles: number;
  totalAdminUsers: number;
  totalPermissions: number;
};

export async function getAdminRoles() {
  const res = await apiClient.get<MaybeWrapped<AdminRole[]>>("/api/admin/roles");
  return unwrap(res.data);
}

export async function getAdminRoleStats() {
  const res = await apiClient.get<MaybeWrapped<RoleStats>>("/api/admin/roles/stats");
  return unwrap(res.data);
}

export type CreateRoleInput = {
  name: string;
  description?: string | null;
  permissions?: string[];
};

export async function createAdminRole(payload: CreateRoleInput) {
  const res = await apiClient.post<MaybeWrapped<AdminRole>>("/api/admin/roles", {
    name: payload.name,
    description: payload.description ?? null,
    permissions: payload.permissions ?? [],
  });
  return unwrap(res.data);
}

export type UpdateRoleInput = {
  name: string;
  description?: string | null;
};

export async function updateAdminRole(roleId: string, payload: UpdateRoleInput) {
  const res = await apiClient.put<MaybeWrapped<unknown>>(`/api/admin/roles/${roleId}`, {
    name: payload.name,
    description: payload.description ?? null,
  });
  return unwrap(res.data);
}

export async function deleteAdminRole(roleId: string) {
  const res = await apiClient.delete<MaybeWrapped<unknown>>(`/api/admin/roles/${roleId}`);
  return unwrap(res.data);
}


export type RolePermissions = {
  roleId: string;
  roleName: string;
  permissions: string[];
};

export async function getAdminRolePermissions(roleId: string) {
  const res = await apiClient.get<MaybeWrapped<RolePermissions>>(
    `/api/admin/roles/${roleId}/permissions`,
  );
  return unwrap(res.data); // { roleId, roleName, permissions }
}

export async function updateAdminRolePermissions(roleId: string, permissions: string[]) {
  const res = await apiClient.put<MaybeWrapped<unknown>>(
    `/api/admin/roles/${roleId}/permissions`,
    { permissions },
  );
  return unwrap(res.data);
}