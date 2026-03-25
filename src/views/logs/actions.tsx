"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShieldAlert, User, Globe, Clock, FileDiff } from "lucide-react";

// --- TYPES ---
export type AuditLog = {
  id: string;
  action: string; // e.g., "Updated Commission Rate"
  actor: {
    name: string;
    email: string;
    role: "Super Admin" | "Support" | "System";
    avatar: string; // Initials
  };
  category: "security" | "finance" | "vendor" | "system";
  entity: string; // The object changed (e.g., "Vendor #402")
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
};

// --- LOG DETAILS MODAL ---
interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog | null;
}

export function LogDetailsModal({ isOpen, onClose, log }: LogModalProps) {
  if (!log) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white text-zinc-900">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`p-2 rounded-lg ${
                log.category === "security"
                  ? "bg-red-100 text-red-600"
                  : log.category === "finance"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {log.category === "security" ? (
                <ShieldAlert size={20} />
              ) : (
                <FileDiff size={20} />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg">{log.action}</DialogTitle>
              <DialogDescription className="font-mono text-xs mt-1">
                ID: {log.id} • {log.timestamp}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* ACTOR DETAILS */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-xs font-bold text-zinc-500 uppercase">
                Performer
              </p>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-bold">
                  {log.actor.avatar}
                </div>
                <div>
                  <p className="font-medium text-zinc-900">{log.actor.name}</p>
                  <p className="text-xs text-zinc-500">{log.actor.role}</p>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-zinc-500 uppercase">
                Context
              </p>
              <div className="text-zinc-600 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Globe size={12} /> {log.ipAddress}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} /> {log.timestamp}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* DATA CHANGES (DIFF VIEW) */}
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase mb-3">
              Data Changes
            </p>
            {log.changes ? (
              <div className="border border-zinc-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-50 text-xs text-zinc-500 uppercase font-bold border-b border-zinc-200">
                    <tr>
                      <th className="px-3 py-2">Field</th>
                      <th className="px-3 py-2 text-red-600">Old Value</th>
                      <th className="px-3 py-2 text-emerald-600">New Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {log.changes.map((change, idx) => (
                      <tr key={idx} className="bg-white">
                        <td className="px-3 py-2 font-mono text-zinc-600">
                          {change.field}
                        </td>
                        <td className="px-3 py-2 font-mono text-red-600 bg-red-50/50">
                          {change.oldValue}
                        </td>
                        <td className="px-3 py-2 font-mono text-emerald-600 bg-emerald-50/50">
                          {change.newValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-zinc-50 p-4 rounded text-center text-xs text-zinc-500 italic">
                No data modification recorded. This was a system event or
                read-only action.
              </div>
            )}
          </div>

          {/* METADATA */}
          <div className="bg-zinc-50 p-3 rounded border border-zinc-100">
            <p className="text-[10px] font-mono text-zinc-400 break-all">
              User-Agent: {log.userAgent}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="bg-zinc-900 w-full sm:w-auto">
            Close Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
