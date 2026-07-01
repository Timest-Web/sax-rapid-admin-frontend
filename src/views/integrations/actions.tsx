/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  Plug,
  ShieldCheck,
  Key,
  RefreshCw,
  AlertTriangle,
  Link as LinkIcon,
  Power,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import type { IntegrationApp, IntegrationCategory } from "./mapper";
import {
  useCreateIntegration,
  useToggleIntegration,
} from "@/src/features/integrations/hooks";

type FormState = {
  name: string;
  type: string; 
  description: string;
  logoUrl: string;
  isLiveMode: boolean;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
};

function buildConfigJson(f: FormState) {
  return JSON.stringify(
    {
      isLiveMode: f.isLiveMode,
      apiKey: f.apiKey,
      secretKey: f.secretKey,
      webhookUrl: f.webhookUrl,
    },
    null,
    0,
  );
}

function suggestedTypeFromCategory(cat: IntegrationCategory) {
  switch (cat) {
    case "payment":
      return "Payment";
    case "delivery":
      return "Logistics";
    case "map":
      return "Maps";
    case "email":
      return "Email";
    default:
      return "Other";
  }
}

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: IntegrationApp | null;
}

export function IntegrationConfigModal({
  isOpen,
  onClose,
  data,
}: ConfigModalProps) {
  const createM = useCreateIntegration();
  const toggleM = useToggleIntegration();

  const isCreateMode = !data;

  const [form, setForm] = useState<FormState>({
    name: "",
    type: "Payment",
    description: "",
    logoUrl: "",
    isLiveMode: false,
    apiKey: "",
    secretKey: "",
    webhookUrl: "",
  });

  useEffect(() => {
    if (!data) return;

    setForm({
      name: data.name ?? "",
      type: data.rawType || suggestedTypeFromCategory(data.category),
      description: data.description ?? "",
      logoUrl: data.logoUrl ?? "",
      isLiveMode: Boolean(data.isLiveMode),
      apiKey: data.apiKey ?? "",
      secretKey: data.secretKey ?? "",
      webhookUrl: data.webhookUrl ?? "",
    });
  }, [data]);

  const canSubmitCreate = useMemo(() => {
    if (!isCreateMode) return false;
    return (
      form.name.trim().length >= 2 &&
      form.type.trim().length >= 2 &&
      form.apiKey.trim().length >= 2 &&
      form.secretKey.trim().length >= 2
    );
  }, [form, isCreateMode]);

  const connected = data?.status === "connected";

  const handlePrimary = async () => {
    if (isCreateMode) {
      if (!canSubmitCreate) return;

      await createM.mutateAsync({
        name: form.name.trim(),
        type: form.type.trim(),
        status: "Enabled", 
        configJson: buildConfigJson(form),
        description: form.description.trim(),
        logoUrl: form.logoUrl.trim(),
      });

      onClose();
      return;
    }
    if (!data) return;
    await toggleM.mutateAsync(data.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] w-[calc(100vw-2rem)] max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col">
        {/* HEADER */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
                  <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                    {isCreateMode ? <Plus size={16} /> : <Plug size={16} />}
                  </div>
                  {isCreateMode ? "Add Integration" : `Configure ${data?.name}`}
                </DialogTitle>

                <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
                  {isCreateMode &&
                    "Create a new integration and store its configuration."}
                </DialogDescription>
              </div>

              {!isCreateMode && (
                <div className="shrink-0 pt-1">
                  <span
                    className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg tracking-widest border ${
                      connected
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-zinc-100 text-zinc-500 border-zinc-200"
                    }`}
                  >
                    {connected ? "Active" : "Inactive"}
                  </span>
                </div>
              )}
            </div>
          </DialogHeader>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Enable/Disable (existing only) */}
          {!isCreateMode && (
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-zinc-200 shadow-sm">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-zinc-900 uppercase tracking-widest">
                  Integration Status
                </Label>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
                  Toggle enable/disable 
                </p>
              </div>

              <Button
                type="button"
                variant={connected ? "outline" : "default"}
                onClick={async () => {
                  try {
                    if (!data) return;
                    await toggleM.mutateAsync(data.id);
                    toast.success("Integration toggled");
                  } catch {
                    // hook already toasts error
                  }
                }}
                className="h-10 rounded-xl"
                disabled={toggleM.isPending}
              >
                <Power className="mr-2 h-4 w-4" />
                {toggleM.isPending
                  ? "Updating..."
                  : connected
                    ? "Disable"
                    : "Enable"}
              </Button>
            </div>
          )}

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
              checked={form.isLiveMode}
              onCheckedChange={(c) => setForm({ ...form, isLiveMode: c })}
              className="data-[state=checked]:bg-[#D4AF37]"
              disabled={!isCreateMode} // disable editing in existing mode (no update endpoint)
            />
          </div>

          <div className="h-px w-full bg-zinc-100" />

          {/* Basic fields (create only) */}
          {isCreateMode && (
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Name <span className="text-[#D4AF37]">*</span>
                </Label>
                <Input
                  className="h-11 bg-zinc-50/50 border-zinc-200 text-sm rounded-lg focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37]"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Paystack Payments"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Type <span className="text-[#D4AF37]">*</span>
                </Label>
                <Input
                  className="h-11 bg-zinc-50/50 border-zinc-200 text-sm rounded-lg focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37]"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  placeholder="Payment | Logistics | Email | Maps"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Description
                </Label>
                <Input
                  className="h-11 bg-zinc-50/50 border-zinc-200 text-sm rounded-lg"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Short description…"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Logo URL
                </Label>
                <Input
                  className="h-11 bg-zinc-50/50 border-zinc-200 text-sm rounded-lg"
                  value={form.logoUrl}
                  onChange={(e) =>
                    setForm({ ...form, logoUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
          )}

          {/* API Keys */}
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Public Key / Client ID <span className="text-[#D4AF37]">*</span>
              </Label>
              <div className="relative flex items-center">
                <Key size={14} className="absolute left-3 text-zinc-400" />
                <Input
                  className="h-11 pl-9 font-mono bg-zinc-50/50 border-zinc-200 text-sm rounded-lg focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37]"
                  value={form.apiKey}
                  onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                  placeholder={form.isLiveMode ? "pk_live_..." : "pk_test_..."}
                  disabled={!isCreateMode} // existing mode display-only
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
                  className="h-11 pl-9 font-mono bg-zinc-50/50 border-zinc-200 text-sm rounded-lg focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37]"
                  value={form.secretKey}
                  onChange={(e) =>
                    setForm({ ...form, secretKey: e.target.value })
                  }
                  placeholder={form.isLiveMode ? "sk_live_..." : "sk_test_..."}
                  disabled={!isCreateMode}
                />
              </div>
            </div>
          </div>

          {/* Webhook */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Webhook Callback URL
            </Label>

            {isCreateMode ? (
              <Input
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 text-sm rounded-lg"
                value={form.webhookUrl}
                onChange={(e) =>
                  setForm({ ...form, webhookUrl: e.target.value })
                }
                placeholder="https://..."
              />
            ) : (
              <div className="bg-zinc-50 border border-dashed border-zinc-200 p-3 rounded-lg text-[11px] font-mono text-zinc-500 break-all flex items-start gap-2 select-all">
                <LinkIcon size={12} className="shrink-0 mt-0.5 text-zinc-400" />
                {form.webhookUrl || "—"}
              </div>
            )}
          </div>

          {/* Live warning */}
          {form.isLiveMode && (
            <div className="bg-[#fff9e6] border border-[#f5e6b3] rounded-lg p-3.5 flex gap-3 items-start">
              <AlertTriangle
                size={16}
                className="text-[#b38a00] shrink-0 mt-0.5"
              />
              <p className="text-[10px] font-bold text-[#806200] uppercase tracking-widest leading-relaxed">
                You are editing LIVE production keys. Incorrect configuration
                can cause immediate failures.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 flex items-center justify-end bg-white shrink-0">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handlePrimary}
              disabled={
                isCreateMode
                  ? !canSubmitCreate || createM.isPending
                  : toggleM.isPending
              }
              className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-xl shadow-md disabled:opacity-50 min-w-[160px]"
            >
              {createM.isPending || toggleM.isPending ? (
                <RefreshCw className="animate-spin h-4 w-4 mx-auto" />
              ) : isCreateMode ? (
                "Save & Connect"
              ) : connected ? (
                "Disable"
              ) : (
                "Enable"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
