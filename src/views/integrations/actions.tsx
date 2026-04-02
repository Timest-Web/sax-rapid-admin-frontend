/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Plug, ShieldCheck, Key, RefreshCw, AlertTriangle, Link as LinkIcon } from "lucide-react";

// --- TYPES ---
export type IntegrationCategory = "payment" | "delivery" | "map" | "email";

export type IntegrationApp = {
  id: string;
  name: string;
  provider: string; // e.g., "Paystack"
  category: IntegrationCategory;
  description: string;
  status: "connected" | "disconnected" | "error";
  isLiveMode: boolean; // Test vs Live
  apiKey?: string;
  secretKey?: string;
  webhookUrl?: string;
};

// --- CONFIGURATION MODAL ---
interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: IntegrationApp | null;
  onSave: (updatedApp: IntegrationApp) => void;
}

export function IntegrationConfigModal({
  isOpen,
  onClose,
  data,
  onSave,
}: ConfigModalProps) {
  const [formData, setFormData] = useState<Partial<IntegrationApp>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API verification delay
    setTimeout(() => {
      if (data && formData) {
        onSave({ ...data, ...formData } as IntegrationApp);
      }
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  const handleDisconnect = () => {
    if (
      confirm(
        "Are you sure? This will instantly halt all services relying on this integration.",
      )
    ) {
      if (data)
        onSave({ ...data, status: "disconnected", apiKey: "", secretKey: "" });
      onClose();
    }
  };

  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col">
        {/* ─── MODAL HEADER ─── */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
                  <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                    <Plug size={16} />
                  </div>
                  Configure {data.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
                  Manage API keys, environment settings, and webhooks for {data.provider}.
                </DialogDescription>
              </div>
              <div className="shrink-0 pt-1">
                <span
                  className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg tracking-widest border ${
                    data.status === "connected"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-zinc-100 text-zinc-500 border-zinc-200"
                  }`}
                >
                  {data.status === "connected" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* ─── FORM BODY ─── */}
        <form id="configForm" onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Environment Toggle */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-zinc-200 shadow-sm">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-zinc-900 uppercase tracking-widest">
                Production Mode
              </Label>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
                Toggle between Test and Live environments
              </p>
            </div>
            <Switch
              checked={formData.isLiveMode}
              onCheckedChange={(c) =>
                setFormData({ ...formData, isLiveMode: c })
              }
              className="data-[state=checked]:bg-[#D4AF37]"
            />
          </div>

          <div className="h-px w-full bg-zinc-100" />

          {/* API Keys */}
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Public Key / Client ID <span className="text-[#D4AF37]">*</span>
              </Label>
              <div className="relative flex items-center">
                <Key
                  size={14}
                  className="absolute left-3 text-zinc-400"
                />
                <Input
                  className="h-11 pl-9 font-mono bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
                  value={formData.apiKey || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, apiKey: e.target.value })
                  }
                  placeholder={formData.isLiveMode ? "pk_live_..." : "pk_test_..."}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Secret Key <span className="text-[#D4AF37]">*</span>
              </Label>
              <div className="relative flex items-center">
                <ShieldCheck
                  size={14}
                  className="absolute left-3 text-zinc-400"
                />
                <Input
                  type="password"
                  className="h-11 pl-9 font-mono bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
                  value={formData.secretKey || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, secretKey: e.target.value })
                  }
                  placeholder={formData.isLiveMode ? "sk_live_..." : "sk_test_..."}
                  required
                />
              </div>
            </div>
          </div>

          {/* Webhook Info (Read Only) */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Webhook Callback URL
            </Label>
            <div className="bg-zinc-50 border border-dashed border-zinc-200 p-3 rounded-lg text-[11px] font-mono text-zinc-500 break-all flex items-start gap-2 select-all hover:bg-zinc-100 transition-colors">
              <LinkIcon size={12} className="shrink-0 mt-0.5 text-zinc-400" />
              https://api.platform.com/webhooks/{data.provider.toLowerCase().replace(" ", "-")}
            </div>
            <p className="text-[10px] text-zinc-400 pt-1 leading-relaxed">
              Copy and paste this URL into your {data.provider} dashboard to receive automated event updates.
            </p>
          </div>

          {/* Security Banner */}
          {formData.isLiveMode && (
            <div className="bg-[#fff9e6] border border-[#f5e6b3] rounded-lg p-3.5 flex gap-3 items-start">
              <AlertTriangle size={16} className="text-[#b38a00] shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold text-[#806200] uppercase tracking-widest leading-relaxed">
                You are editing LIVE production keys. Incorrect configurations will cause immediate transaction failures.
              </p>
            </div>
          )}
        </form>

        {/* ─── MODAL FOOTER ─── */}
        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 flex items-center justify-between sm:justify-between bg-white shrink-0">
          {data.status === "connected" ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleDisconnect}
              className="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-4 h-11 rounded-xl transition-all"
            >
              Disconnect
            </Button>
          ) : (
            <div /> // Spacer
          )}
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11 transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="configForm"
              disabled={isLoading || !formData.apiKey || !formData.secretKey}
              className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-xl transition-all shadow-md disabled:opacity-50 min-w-[160px]"
            >
              {isLoading ? (
                <RefreshCw className="animate-spin h-4 w-4 mx-auto" />
              ) : (
                "Save & Connect"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}