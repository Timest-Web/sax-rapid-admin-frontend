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
import { Badge } from "@/components/ui/badge";
import { Plug, ShieldCheck, Key, RefreshCw, AlertTriangle } from "lucide-react";

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

  const handleSave = () => {
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
        "Are you sure? This will stop all services relying on this integration.",
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
      <DialogContent className="sm:max-w-[500px] bg-white text-zinc-900">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Plug size={18} /> Configure {data.name}
            </DialogTitle>
            <Badge
              variant={data.status === "connected" ? "default" : "secondary"}
              className={
                data.status === "connected"
                  ? "bg-emerald-600"
                  : "bg-zinc-200 text-zinc-500"
              }
            >
              {data.status === "connected" ? "Active" : "Inactive"}
            </Badge>
          </div>
          <DialogDescription>
            Manage API keys and environment settings for {data.provider}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Environment Toggle */}
          <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-lg border border-zinc-100">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold">Production Mode</Label>
              <p className="text-xs text-zinc-500">
                Toggle between Test and Live keys
              </p>
            </div>
            <Switch
              checked={formData.isLiveMode}
              onCheckedChange={(c) =>
                setFormData({ ...formData, isLiveMode: c })
              }
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>

          {/* API Keys */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-zinc-500 uppercase">
                Public Key / Client ID
              </Label>
              <div className="relative">
                <Key
                  size={14}
                  className="absolute left-3 top-3 text-zinc-400"
                />
                <Input
                  className="pl-9 font-mono text-sm bg-zinc-50"
                  value={formData.apiKey || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, apiKey: e.target.value })
                  }
                  placeholder="pk_live_..."
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-zinc-500 uppercase">
                Secret Key
              </Label>
              <div className="relative">
                <ShieldCheck
                  size={14}
                  className="absolute left-3 top-3 text-zinc-400"
                />
                <Input
                  type="password"
                  className="pl-9 font-mono text-sm bg-zinc-50"
                  value={formData.secretKey || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, secretKey: e.target.value })
                  }
                  placeholder="sk_live_..."
                />
              </div>
            </div>
          </div>

          {/* Webhook Info (Read Only) */}
          <div className="space-y-1">
            <Label className="text-xs font-bold text-zinc-500 uppercase">
              Webhook Callback URL
            </Label>
            <div className="bg-zinc-100 p-2 rounded text-xs font-mono text-zinc-600 break-all border border-zinc-200">
              https://api.platform.com/webhooks/
              {data.provider.toLowerCase().replace(" ", "-")}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center sm:justify-between">
          {data.status === "connected" ? (
            <Button
              variant="ghost"
              onClick={handleDisconnect}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Disconnect
            </Button>
          ) : (
            <div /> // Spacer
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-zinc-900 hover:bg-zinc-800"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="animate-spin h-4 w-4" />
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
