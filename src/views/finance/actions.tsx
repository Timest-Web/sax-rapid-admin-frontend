"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, CreditCard, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";

// ─── 1. PAYOUT MODAL ───
export function PayoutModal({
  vendorName,
  balance,
}: {
  vendorName: string;
  balance: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-[10px]">
          <ArrowRightLeft className="mr-2 h-3 w-3" /> Payout
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Process Vendor Payout</DialogTitle>
          <DialogDescription>
            Transfer funds from Platform Wallet to {vendorName}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-zinc-500">
              Available Balance
            </span>
            <span className="text-lg font-bold font-mono text-zinc-900">
              {balance}
            </span>
          </div>
          <div className="space-y-2">
            <Label>Amount (₦)</Label>
            <Input placeholder="0.00" className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label>Destination Account</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">GTBank - 012****891</SelectItem>
                <SelectItem value="2">Zenith - 221****992</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="gold"
            onClick={() => {
              setOpen(false);
              toast.success("Payout Initiated");
            }}
          >
            Confirm Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 2. GATEWAY CONFIG MODAL ───
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
          <DialogDescription>
            Manage API keys and feature toggles.
          </DialogDescription>
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
