/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, ArrowRightLeft, Snowflake, Flame } from "lucide-react";
import { toast } from "sonner";

import { useManualVendorPayout, useToggleVendorWalletFreeze } from "@/src/features/finance/hooks";

function parseAmount(v: string) {
  const cleaned = v.replace(/,/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

/** ---- Freeze / Unfreeze ---- */
export function ToggleFreezeButton({
  vendorId,
  currentStatus,
}: {
  vendorId: string;
  currentStatus: string;
}) {
  const toggle = useToggleVendorWalletFreeze();
  const isFrozen = String(currentStatus).toLowerCase().includes("frozen");

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 text-[10px]"
      disabled={toggle.isPending}
      onClick={async () => {
        try {
          await toggle.mutateAsync(vendorId);
          toast.success(isFrozen ? "Wallet unfrozen" : "Wallet frozen");
        } catch (e: any) {
          toast.error(e?.message ?? "Failed to update wallet status");
        }
      }}
      title={isFrozen ? "Unfreeze wallet" : "Freeze wallet"}
    >
      {isFrozen ? (
        <>
          <Flame className="mr-2 h-3 w-3" /> Unfreeze
        </>
      ) : (
        <>
          <Snowflake className="mr-2 h-3 w-3" /> Freeze
        </>
      )}
    </Button>
  );
}

/** ---- Payout ---- */
export function PayoutModal({
  vendorId,
  vendorName,
  balanceText,
  maxAmount,
  currency,
  disabled,
}: {
  vendorId: string;
  vendorName: string;
  balanceText: string;
  maxAmount: number;
  currency: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const payout = useManualVendorPayout();

  const amountNumber = useMemo(() => parseAmount(amount), [amount]);

  const canSubmit =
    !disabled &&
    amountNumber > 0 &&
    amountNumber <= maxAmount &&
    !payout.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-[10px]"
          disabled={disabled}
        >
          <ArrowRightLeft className="mr-2 h-3 w-3" /> Payout
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Process Vendor Payout</DialogTitle>
          <DialogDescription>
            Deducts amount directly from vendor wallet and creates a payout transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-zinc-500">
              Available Balance ({vendorName})
            </span>
            <span className="text-lg font-bold font-mono text-zinc-900">
              {balanceText}
            </span>
          </div>

          <div className="space-y-2">
            <Label>
              Amount ({currency})
            </Label>
            <Input
              placeholder="0.00"
              className="font-mono"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-[11px] text-zinc-500">
              Max: {maxAmount.toLocaleString()} {currency}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="gold"
            disabled={!canSubmit}
            onClick={async () => {
              try {
                await payout.mutateAsync({
                  vendorId,
                  payload: { amount: amountNumber },
                });
                toast.success("Payout processed");
                setOpen(false);
                setAmount("");
              } catch (e: any) {
                toast.error(e?.message ?? "Failed to process payout");
              }
            }}
          >
            {payout.isPending ? "Processing..." : "Confirm Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function GatewayConfigModal({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-3 w-3" /> Configure
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>{name} Settings</DialogTitle>
          <DialogDescription>Manage API keys and feature toggles.</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between p-3 border border-zinc-100 rounded-md">
            <div className="space-y-0.5">
              <Label className="text-xs font-bold">Enable Payments</Label>
              <p className="text-[10px] text-zinc-500">
                Allow users to pay via {name}
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="space-y-2">
            <Label>Public Key</Label>
            <Input
              defaultValue="pk_test_xxxxxxxxxxxxxxxx"
              className="font-mono text-xs bg-zinc-50"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label>Secret Key</Label>
            <Input
              type="password"
              defaultValue="sk_test_xxxxxxxxxxxxxxxx"
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input
              defaultValue="https://api.sax.com/webhooks/paystack"
              className="font-mono text-xs"
              readOnly
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="default" onClick={() => setOpen(false)}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}