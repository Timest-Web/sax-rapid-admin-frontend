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
import { Shield, Lock, Users, Eye } from "lucide-react";

// --- TYPES ---
export type Permission =
  | "view_dashboard"
  | "manage_users"
  | "manage_finance"
  | "manage_content"
  | "system_settings";

export type AdminRole = {
  id: string;
  name: string; // e.g. "Support Agent"
  usersCount: number;
  permissions: Permission[];
  status: "active" | "inactive";
};

export type LoginSession = {
  id: string;
  user: string;
  role: string;
  ip: string;
  location: string; // e.g., "Lagos, NG"
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
      <DialogContent className="sm:max-w-[500px] bg-white text-zinc-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield size={18} /> Configure Access Role
          </DialogTitle>
          <DialogDescription>
            Define what users with this role can see and do.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label>Role Name</Label>
            <Input
              placeholder="e.g. Finance Manager"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Permissions</Label>
            <div className="grid grid-cols-1 gap-2 border border-zinc-200 rounded-lg p-3 bg-zinc-50">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="p1"
                  checked={perms.includes("view_dashboard")}
                  onCheckedChange={() => togglePerm("view_dashboard")}
                />
                <Label htmlFor="p1" className="cursor-pointer">
                  View Dashboard Analytics
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="p2"
                  checked={perms.includes("manage_users")}
                  onCheckedChange={() => togglePerm("manage_users")}
                />
                <Label htmlFor="p2" className="cursor-pointer">
                  Manage Users & Vendors
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="p3"
                  checked={perms.includes("manage_finance")}
                  onCheckedChange={() => togglePerm("manage_finance")}
                />
                <Label htmlFor="p3" className="cursor-pointer">
                  Financial Access (Payouts/Commissions)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="p4"
                  checked={perms.includes("manage_content")}
                  onCheckedChange={() => togglePerm("manage_content")}
                />
                <Label htmlFor="p4" className="cursor-pointer">
                  Content Management (CMS)
                </Label>
              </div>

              <div className="flex items-center space-x-2 border-t border-zinc-200 pt-2 mt-1">
                <Checkbox
                  id="p5"
                  checked={perms.includes("system_settings")}
                  onCheckedChange={() => togglePerm("system_settings")}
                />
                <Label
                  htmlFor="p5"
                  className="cursor-pointer font-bold text-red-600"
                >
                  System Configuration (Root)
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-zinc-900">
            Create Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
