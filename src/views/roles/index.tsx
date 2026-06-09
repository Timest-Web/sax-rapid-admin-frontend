"use client";

import { useMemo, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, ShieldAlert, Fingerprint, Lock } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";

import type { AdminRole } from "@/src/features/roles/api";
import {
  useAdminRoles,
  useAdminRoleStats,
  useCreateAdminRole,
  useUpdateAdminRole,
  useDeleteAdminRole,
  useUpdateAdminRolePermissions,
} from "@/src/features/roles/hooks";

import { getRoleColumns } from "./column";
import { RoleEditorModal, ConfirmDeleteRoleModal } from "./actions";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

// keep until you have an endpoint
type LoginSession = {
  id: string;
  user: string;
  role: string;
  ip: string;
  location: string;
  device: string;
  status: "success" | "failed";
  timestamp: string;
};

const RECENT_LOGINS: LoginSession[] = [];

export default function SecurityView() {
  const rolesQ = useAdminRoles();
  const statsQ = useAdminRoleStats();

  const createM = useCreateAdminRole();
  const updateM = useUpdateAdminRole();
  const deleteM = useDeleteAdminRole();
  const updatePermsM = useUpdateAdminRolePermissions();

  const roles = rolesQ.data ?? [];

  // editor modal state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);

  // delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<AdminRole | null>(null);

  const columns = useMemo(
    () =>
      getRoleColumns({
        onEdit: (role) => {
          setSelectedRole(role);
          setEditorMode("edit");
          setEditorOpen(true);
        },
        onRequestDelete: (role) => {
          setRoleToDelete(role);
          setDeleteOpen(true);
        },
      }),
    [],
  );

  const isSaving = createM.isPending || updateM.isPending || updatePermsM.isPending;

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / Security & Access
          </h1>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-8">
        {/* STATS from backend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Roles"
            value={statsQ.data ? String(statsQ.data.totalRoles) : "—"}
            icon={Fingerprint}
            variant="default"
          />
          <StatCard
            label="Total Admin Users"
            value={statsQ.data ? String(statsQ.data.totalAdminUsers) : "—"}
            icon={Lock}
            variant="emerald"
          />
          <StatCard
            label="Total Permissions"
            value={statsQ.data ? String(statsQ.data.totalPermissions) : "—"}
            icon={ShieldAlert}
            variant="rose"
          />
        </div>

        <Tabs defaultValue="roles" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                { value: "roles", label: "Role Management", count: roles.length, variant: "default" },
                { value: "logins", label: "Login Logs", count: RECENT_LOGINS.length, variant: "indigo" },
                { value: "settings", label: "Security Policies", count: 0, variant: "amber" },
              ]}
            />
          </div>

          <TabsContent value="roles">
            <div className="mt-6 space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setSelectedRole(null);
                    setEditorMode("create");
                    setEditorOpen(true);
                  }}
                  className="bg-zinc-900 hover:bg-zinc-800 text-xs"
                >
                  <Plus size={16} className="mr-2" /> Add New Role
                </Button>
              </div>

              <div>
                {rolesQ.isLoading ? (
                <TableSkeleton columns={columns.length} rows={5} />
                ) : rolesQ.isError ? (
                  <div className="p-6 text-sm text-rose-600">Failed to load roles.</div>
                ) : (
                  <DataTable columns={columns} data={roles} />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logins">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              {/* keep as-is or wire your login endpoint later */}
              <div className="p-6 text-sm text-zinc-500">No login endpoint wired yet.</div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 border border-zinc-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                      <Lock size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900">Enforce Two-Factor Auth</h3>
                      <p className="text-xs text-zinc-500">Require 2FA for all admin roles</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <p className="text-xs text-zinc-400">
                  When enabled, all staff members must configure 2FA before they can access the dashboard.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* CREATE/EDIT ROLE MODAL */}
      <RoleEditorModal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        mode={editorMode}
        role={selectedRole}
        isSaving={isSaving}
        onSave={async (payload) => {
          try {
            if (editorMode === "create") {
              await createM.mutateAsync(payload);
              setEditorOpen(false);
              return;
            }

            // edit => 2 endpoints
            if (!selectedRole?.id) return;

            await updateM.mutateAsync({
              roleId: selectedRole.id,
              payload: { name: payload.name, description: payload.description },
            });

            await updatePermsM.mutateAsync({
              roleId: selectedRole.id,
              permissions: payload.permissions,
            });

            setEditorOpen(false);
          } catch {
            // errors toasted in hooks
          }
        }}
      />

      {/* DELETE CONFIRM MODAL */}
      <ConfirmDeleteRoleModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        role={roleToDelete}
        isDeleting={deleteM.isPending}
        onConfirm={(roleId) => {
          deleteM.mutate(roleId, {
            onSuccess: () => {
              setDeleteOpen(false);
              setRoleToDelete(null);
            },
          });
        }}
      />
    </div>
  );
}