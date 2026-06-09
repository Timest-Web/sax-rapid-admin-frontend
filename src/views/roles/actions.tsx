/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import type { AdminRole } from "@/src/features/roles/api";
import { useAdminRolePermissions } from "@/src/features/roles/hooks";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent as AlertDialogContent2,
  AlertDialogDescription as AlertDialogDescription2,
  AlertDialogFooter as AlertDialogFooter2,
  AlertDialogHeader as AlertDialogHeader2,
  AlertDialogTitle as AlertDialogTitle2,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Trash2 } from "lucide-react";

/**
 * These are UI-available permission keys.
 * They must match whatever your backend expects in:
 * PUT /api/admin/roles/{roleId}/permissions
 */
type PermissionKey =
  | "view_dashboard"
  | "manage_users"
  | "manage_finance"
  | "manage_content"
  | "system_settings";

const ALL_PERMS: { key: PermissionKey; label: string; danger?: boolean }[] = [
  { key: "view_dashboard", label: "View Dashboard Analytics" },
  { key: "manage_users", label: "Manage Users & Vendors" },
  { key: "manage_finance", label: "Financial Access (Payouts & Commissions)" },
  { key: "manage_content", label: "Content Management (CMS)" },
  {
    key: "system_settings",
    label: "System Configuration (Root Access)",
    danger: true,
  },
];

function ensureArray(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

export function RoleEditorModal(props: {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  role?: AdminRole | null;
  isSaving?: boolean;
  onSave: (payload: {
    name: string;
    description: string | null;
    permissions: string[];
  }) => void;
}) {
  const { isOpen, onClose, mode, role, isSaving, onSave } = props;

  const roleId = role?.id;

  /**
   * IMPORTANT:
   * permsQ.data is NOT string[].
   * Your backend returns:
   * { roleId, roleName, permissions: string[] }
   */
  const permsQ = useAdminRolePermissions(roleId, mode === "edit" && isOpen);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [perms, setPerms] = useState<string[]>([]);

  // Seed when opening (or switching role)
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit") {
      setName(role?.name ?? "");
      setDescription(role?.description ?? "");

      // seed from role object immediately (fast), then replace from perms endpoint
      setPerms(ensureArray(role?.permissions));
    } else {
      setName("");
      setDescription("");
      setPerms([]);
    }
  }, [isOpen, mode, roleId]); // roleId is enough for switching between roles

  // Replace with permissions from endpoint (authoritative)
  useEffect(() => {
    if (!isOpen || mode !== "edit") return;

    const fromEndpoint = ensureArray(permsQ.data?.permissions);
    // Only set when the query actually returned something (even empty [] is valid)
    // If you want to avoid overwriting while still loading, check permsQ.isSuccess.
    if (permsQ.isSuccess) setPerms(fromEndpoint);
  }, [isOpen, mode, permsQ.isSuccess, permsQ.data]);

  const safePerms = ensureArray(perms);
  const permSet = useMemo(() => new Set(safePerms), [safePerms]);

  const togglePerm = (p: string) => {
    setPerms((prev) => {
      const arr = ensureArray(prev);
      return arr.includes(p) ? arr.filter((x) => x !== p) : [...arr, p];
    });
  };

  const canSave = name.trim().length > 0;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="
          sm:max-w-130
          max-h-[90vh]
          overflow-hidden
          p-0
          bg-white border-zinc-200
          rounded-2xl shadow-2xl
          flex flex-col
        "
      >
        {/* Header (fixed) */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />

          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Shield size={16} />
              </div>
              {mode === "create" ? "Create Role" : "Edit Role"}
            </DialogTitle>

            <DialogDescription className="text-xs text-zinc-500 mt-2 leading-relaxed pl-11">
              {mode === "create"
                ? "Creates a new admin role with optional permissions."
                : "Updates role name/description and replaces role permissions."}
            </DialogDescription>

            {mode === "edit" && permsQ.data?.roleName ? (
              <div className="pl-11 pt-2 text-[10px] font-mono text-zinc-500">
                Editing:{" "}
                <span className="font-bold">{permsQ.data.roleName}</span>
              </div>
            ) : null}
          </DialogHeader>
        </div>

        {/* Body (scrolls) */}
        <div className="p-6 space-y-6 overflow-y-auto min-h-0">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Role Name <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 bg-zinc-50/50 border-zinc-200"
              placeholder="e.g. Finance Manager"
              disabled={isSaving}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Description
            </Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-11 bg-zinc-50/50 border-zinc-200"
              placeholder="Optional"
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Permissions
              </Label>

              {mode === "edit" && permsQ.isLoading ? (
                <span className="text-[10px] font-mono text-zinc-500">
                  Loading permissions…
                </span>
              ) : null}
            </div>

            <div className="border border-zinc-200 rounded-xl bg-zinc-50/30 p-1.5 divide-y divide-zinc-100">
              {ALL_PERMS.map((p) => (
                <div
                  key={p.key}
                  className={[
                    "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                    p.danger ? "hover:bg-red-50/50" : "hover:bg-zinc-100/50",
                  ].join(" ")}
                >
                  <Checkbox
                    checked={permSet.has(p.key)}
                    // shadcn checkbox gives boolean | "indeterminate"
                    onCheckedChange={() => togglePerm(p.key)}
                    disabled={isSaving}
                    className={
                      p.danger
                        ? "data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 border-red-200"
                        : "data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                    }
                  />

                  <button
                    type="button"
                    className="text-left w-full"
                    onClick={() => togglePerm(p.key)}
                    disabled={isSaving}
                  >
                    <span
                      className={[
                        "text-sm",
                        p.danger
                          ? "font-bold text-red-600"
                          : "font-medium text-zinc-700",
                      ].join(" ")}
                    >
                      {p.label}
                    </span>
                  </button>
                </div>
              ))}
            </div>

            {permsQ.isError ? (
              <div className="text-xs text-rose-600">
                Failed to load permissions for this role.
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer (fixed) */}
        <DialogFooter className="p-6 pt-0 sm:justify-between flex-row-reverse shrink-0">
          <Button
            onClick={() =>
              onSave({
                name: name.trim(),
                description: description.trim() ? description.trim() : null,
                permissions: safePerms,
              })
            }
            disabled={!canSave || isSaving}
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs font-bold uppercase tracking-widest rounded-xl px-8 h-11"
          >
            {isSaving
              ? "Saving..."
              : mode === "create"
                ? "Create Role"
                : "Save Changes"}
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="bg-white border-zinc-200 text-zinc-600 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDeleteRoleModal(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  role: AdminRole | null;
  isDeleting?: boolean;
  onConfirm: (roleId: string) => void;
}) {
  const { open, onOpenChange, role, isDeleting, onConfirm } = props;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent2>
        <AlertDialogHeader2>
          <AlertDialogTitle2 className="flex items-center gap-2">
            <Trash2 size={18} className="text-rose-600" />
            Delete role
          </AlertDialogTitle2>

          <AlertDialogDescription2>
            This will permanently delete{" "}
            <span className="font-semibold">{role?.name ?? "this role"}</span>.
            This action cannot be undone.
          </AlertDialogDescription2>
        </AlertDialogHeader2>

        <AlertDialogFooter2>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            className="bg-rose-600 hover:bg-rose-700"
            disabled={!role?.id || isDeleting}
            onClick={() => role?.id && onConfirm(role.id)}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter2>
      </AlertDialogContent2>
    </AlertDialog>
  );
}
