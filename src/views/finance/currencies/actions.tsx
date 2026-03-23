/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";

// ─── ADD/EDIT CURRENCY ───
export function CurrencyFormModal({ initialData }: { initialData?: any }) {
  const [open, setOpen] = useState(false);
  const isEdit = !!initialData;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="outline" size="sm" className="h-7 text-[10px]">
            Edit Rate
          </Button>
        ) : (
          <Button variant="default" size="sm">
            <Plus className="mr-2 h-3 w-3" /> Add Currency
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Exchange Rate" : "Add Supported Currency"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Currency Code</Label>
              <Input
                placeholder="e.g. KES"
                defaultValue={initialData?.code}
                readOnly={isEdit}
                className="uppercase font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Symbol</Label>
              <Input
                placeholder="e.g. KSh"
                defaultValue={initialData?.symbol}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Exchange Rate (vs USD)</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-500">1 USD =</span>
              <Input
                placeholder="0.00"
                defaultValue={initialData?.rate}
                className="font-mono text-lg"
              />
            </div>
            <p className="text-[10px] text-zinc-400">
              Rates are updated automatically every 24h unless locked.
            </p>
          </div>

          <div className="flex items-center justify-between p-3 border border-zinc-100 rounded bg-zinc-50">
            <Label className="text-xs">Active on Platform</Label>
            <Switch defaultChecked={initialData?.status === "Active"} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="gold" onClick={() => setOpen(false)}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
