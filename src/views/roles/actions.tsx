"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield } from "lucide-react";

// --- TYPES ---
export type Permission =
  | "view_dashboard"
  | "manage_users"
  | "manage_finance"
  | "manage_content"
  | "system_settings";

export type AdminRole = {
  id: string;
  name: string;
  usersCount: number;
  permissions: Permission[];
  status: "active" | "inactive";
};

export type LoginSession = {
  id: string;
  user: string;
  role: string;
  ip: string;
  location: string;
  device: string;
  status: "success" | "failed";
  timestamp: string;
};

// --- ROLE EDITOR MODAL ---
interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: AdminRole) => void;
}

export function RoleEditorModal({ isOpen, onClose, onSave }: RoleModalProps) {
  const [name, setName] = useState("");
  const [perms, setPerms] = useState<Permission[]>([]);

  const togglePerm = (p: Permission) => {
    if (perms.includes(p)) setPerms(perms.filter((x) => x !== p));
    else setPerms([...perms, p]);
  };

  const handleSave = () => {
    if (!name) return;
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      name,
      usersCount: 0,
      permissions: perms,
      status: "active",
    });
    onClose();
    setName("");
    setPerms([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
        {/* ─── MODAL HEADER ─── */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
          {/* Decorative Top Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />

          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Shield size={16} />
              </div>
              Configure Access Role
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 leading-relaxed pl-11">
              Define the security permissions and access levels for users
              assigned to this role.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* ─── MODAL BODY ─── */}
        <div className="p-6 space-y-6">
          {/* Role Name Input */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Role Name <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input
              placeholder="e.g. Finance Manager"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
            />
          </div>

          {/* Permissions Checklist */}
          <div className="space-y-2.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Assign Permissions <span className="text-[#D4AF37]">*</span>
            </Label>

            <div className="border border-zinc-200 rounded-xl bg-zinc-50/30 p-1.5 divide-y divide-zinc-100">
              <div
                className="flex items-center space-x-3 p-3 hover:bg-zinc-100/50 rounded-lg transition-colors cursor-pointer"
                onClick={() => togglePerm("view_dashboard")}
              >
                <Checkbox
                  id="p1"
                  checked={perms.includes("view_dashboard")}
                  onCheckedChange={() => togglePerm("view_dashboard")}
                  className="data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                />
                <Label
                  htmlFor="p1"
                  className="cursor-pointer text-sm font-medium text-zinc-700 w-full"
                >
                  View Dashboard Analytics
                </Label>
              </div>

              <div
                className="flex items-center space-x-3 p-3 hover:bg-zinc-100/50 rounded-lg transition-colors cursor-pointer"
                onClick={() => togglePerm("manage_users")}
              >
                <Checkbox
                  id="p2"
                  checked={perms.includes("manage_users")}
                  onCheckedChange={() => togglePerm("manage_users")}
                  className="data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                />
                <Label
                  htmlFor="p2"
                  className="cursor-pointer text-sm font-medium text-zinc-700 w-full"
                >
                  Manage Users & Vendors
                </Label>
              </div>

              <div
                className="flex items-center space-x-3 p-3 hover:bg-zinc-100/50 rounded-lg transition-colors cursor-pointer"
                onClick={() => togglePerm("manage_finance")}
              >
                <Checkbox
                  id="p3"
                  checked={perms.includes("manage_finance")}
                  onCheckedChange={() => togglePerm("manage_finance")}
                  className="data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                />
                <Label
                  htmlFor="p3"
                  className="cursor-pointer text-sm font-medium text-zinc-700 w-full"
                >
                  Financial Access (Payouts & Commissions)
                </Label>
              </div>

              <div
                className="flex items-center space-x-3 p-3 hover:bg-zinc-100/50 rounded-lg transition-colors cursor-pointer"
                onClick={() => togglePerm("manage_content")}
              >
                <Checkbox
                  id="p4"
                  checked={perms.includes("manage_content")}
                  onCheckedChange={() => togglePerm("manage_content")}
                  className="data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                />
                <Label
                  htmlFor="p4"
                  className="cursor-pointer text-sm font-medium text-zinc-700 w-full"
                >
                  Content Management (CMS)
                </Label>
              </div>

              {/* Danger Zone Permission */}
              <div
                className="flex items-center space-x-3 p-3 hover:bg-red-50/50 rounded-lg transition-colors cursor-pointer mt-1"
                onClick={() => togglePerm("system_settings")}
              >
                <Checkbox
                  id="p5"
                  checked={perms.includes("system_settings")}
                  onCheckedChange={() => togglePerm("system_settings")}
                  className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 border-red-200"
                />
                <Label
                  htmlFor="p5"
                  className="cursor-pointer text-sm font-bold text-red-600 w-full"
                >
                  System Configuration (Root Access)
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MODAL FOOTER ─── */}
        <DialogFooter className="p-6 pt-0 sm:justify-between flex-row-reverse">
          <Button
            onClick={handleSave}
            disabled={!name}
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black disabled:opacity-50 disabled:hover:bg-zinc-900 disabled:hover:text-[#D4AF37] text-xs font-bold uppercase tracking-widest rounded-xl px-8 h-11 transition-all duration-300 shadow-md"
          >
            Create Role
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11 transition-all"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
