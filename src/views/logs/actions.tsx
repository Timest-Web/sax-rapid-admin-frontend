"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  ShieldAlert,
  FileDiff,
  Globe,
  Clock,
  User,
  Copy,
  Mail,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

export type AuditLog = {
  id: string;
  action: string;

  actor: {
    name: string;
    email: string;
    role: "Super Admin" | "Support" | "System" | string;
    avatar: string;
  };

  category: "security" | "finance" | "vendor" | "system";
  categoryRaw: string;

  entity: string;
  timestamp: string; // ISO
  ipAddress: string;
  userAgent: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];

  detailsRaw: string | null;
  detailsObj: Record<string, unknown> | null;
};

function formatDateTime(iso: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function categoryTheme(category: AuditLog["category"]) {
  switch (category) {
    case "security":
      return {
        gradient: "from-rose-500 to-rose-700",
        iconWrap: "bg-rose-100 text-rose-600",
        chip: "bg-rose-50 text-rose-600 border-rose-100",
        Icon: ShieldAlert,
      };
    case "finance":
      return {
        gradient: "from-emerald-500 to-emerald-700",
        iconWrap: "bg-emerald-100 text-emerald-700",
        chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
        Icon: FileDiff,
      };
    case "vendor":
      return {
        gradient: "from-blue-500 to-blue-700",
        iconWrap: "bg-blue-100 text-blue-700",
        chip: "bg-blue-50 text-blue-700 border-blue-100",
        Icon: FileDiff,
      };
    case "system":
    default:
      return {
        gradient: "from-zinc-900 via-[#D4AF37] to-zinc-900",
        iconWrap: "bg-zinc-900 text-[#D4AF37]",
        chip: "bg-zinc-100 text-zinc-700 border-zinc-200",
        Icon: FileDiff,
      };
  }
}

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog | null;
}

export function LogDetailsModal({ isOpen, onClose, log }: LogModalProps) {
  if (!log) return null;

  const theme = categoryTheme(log.category);
  const HeaderIcon = theme.Icon;

  const detailsText = log.detailsObj
    ? JSON.stringify(log.detailsObj, null, 2)
    : (log.detailsRaw ?? "—");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-190  max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
          <div
            className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${theme.gradient}`}
          />

          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center shadow-sm ${theme.iconWrap}`}
              >
                <HeaderIcon size={16} />
              </div>

              <div className="flex flex-col">
                <span className="leading-tight">{log.action}</span>
                <span
                  className={`mt-2 w-fit text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${theme.chip}`}
                >
                  {log.categoryRaw}
                </span>
              </div>
            </DialogTitle>

            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              Log ID: <span className="font-mono">{log.id}</span> •{" "}
              {formatDateTime(log.timestamp)}
              <span className="mt-2 text-[10px] text-zinc-500 font-mono">
                Target: {log.entity}
              </span>
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Actor + Context cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-zinc-200 rounded-xl p-4 bg-white">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Performer
              </Label>

              <div className="mt-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-zinc-100 flex items-center justify-center text-xs font-black text-zinc-700">
                  {log.actor.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-zinc-400" />
                    <p className="font-bold text-zinc-900 truncate">
                      {log.actor.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={14} className="text-zinc-400" />
                    <p className="text-xs text-zinc-500 font-mono truncate">
                      {log.actor.email}
                    </p>
                  </div>
                  <p className="mt-2 text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                    {log.actor.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-zinc-200 rounded-xl p-4 bg-white">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Context
              </Label>

              <div className="mt-3 space-y-2 text-sm text-zinc-600">
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-zinc-400" />
                  <span className="font-mono text-xs">
                    {log.ipAddress || "—"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-zinc-400" />
                  <span className="font-mono text-xs">
                    {formatDateTime(log.timestamp)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-zinc-400" />
                  <span className="text-xs">{log.category}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Details (snapshot JSON from backend) */}
          {/* <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Details (Snapshot)
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Backend returns a snapshot JSON string in{" "}
                  <span className="font-mono">details</span>.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(detailsText);
                    toast.success("Copied details to clipboard");
                  } catch {
                    toast.error("Failed to copy");
                  }
                }}
              >
                <Copy className="mr-2 h-3.5 w-3.5" />
                Copy JSON
              </Button>
            </div>

            <div className="border border-zinc-200 rounded-xl overflow-hidden">
              <pre className="text-[11px] leading-5 font-mono p-4 bg-zinc-50 overflow-auto max-h-[340px]">
                {detailsText}
              </pre>
            </div>
          </div> */}

          {/* Metadata */}
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
            <p className="text-[10px] font-mono text-zinc-400 break-all">
              User-Agent: {log.userAgent || "—"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 pt-0 sm:justify-between flex-row-reverse">
          <Button
            onClick={onClose}
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-6 rounded-xl transition-all shadow-md"
          >
            Close
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            className="font-bold uppercase tracking-widest text-xs h-11 px-6 rounded-xl border-zinc-200 hover:bg-zinc-50"
          >
            Back
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
