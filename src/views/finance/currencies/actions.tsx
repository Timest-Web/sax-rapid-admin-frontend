/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
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
import { Plus, RefreshCw } from "lucide-react";
import type { CurrencyRow } from "./mapper";
import { useCreateCurrency, useUpdateCurrency } from "@/src/features/currencies/hooks";

function num(v: string) {
  const n = Number(String(v ?? "").replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

export function CurrencyFormModal({ initialData }: { initialData?: CurrencyRow }) {
  const [open, setOpen] = useState(false);
  const isEdit = !!initialData;

  const createM = useCreateCurrency();
  const updateM = useUpdateCurrency();
  const [code, setCode] = useState(initialData?.code ?? "");
  const [name, setName] = useState(initialData?.name ?? "");
  const [symbol, setSymbol] = useState(initialData?.symbol ?? "");
  const [rate, setRate] = useState(String(initialData?.rate ?? ""));
  const [region, setRegion] = useState(initialData?.region ?? "");
  const [isActive, setIsActive] = useState<boolean>(initialData?.isActive ?? true);

  const canSubmit = useMemo(() => {
    if (isEdit) return num(rate) > 0;
    return (
      code.trim().length === 3 &&
      name.trim().length >= 2 &&
      symbol.trim().length >= 1 &&
      num(rate) > 0
    );
  }, [isEdit, code, name, symbol, rate]);

  const submit = async () => {
    if (!canSubmit) return;

    if (isEdit && initialData) {
      await updateM.mutateAsync({
        currencyCode: initialData.code,
        payload: {
          exchangeRateToUsd: num(rate),
          isActive,
          region: region ?? "",
        },
      });
      setOpen(false);
      return;
    }

    await createM.mutateAsync({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      symbol: symbol.trim(),
      exchangeRateToUsd: num(rate),
      isActive,
      region: region ?? "",
    });

    setOpen(false);
  };

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

      {/* You can switch this to your premium modal template later.
          Keeping it simple + correct + non-spilling */}
      <DialogContent className="sm:max-w-130 w-[calc(100vw-2rem)] max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col">
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              {isEdit ? "Edit Exchange Rate" : "Add Supported Currency"}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Currency Code
              </Label>
              <Input
                placeholder="e.g. KES"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                readOnly={isEdit}
                className="uppercase font-mono h-11 bg-zinc-50/50 border-zinc-200 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Symbol
              </Label>
              <Input
                placeholder="e.g. KSh"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                readOnly={isEdit} // backend cannot patch symbol currently
                className="h-11 bg-zinc-50/50 border-zinc-200 rounded-lg"
              />
              {isEdit && (
                <p className="text-[10px] text-zinc-400">
                  Symbol cannot be edited (backend PATCH does not support it).
                </p>
              )}
            </div>
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Currency Name
              </Label>
              <Input
                placeholder="e.g. Kenyan Shilling"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 bg-zinc-50/50 border-zinc-200 rounded-lg"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Exchange Rate (vs USD)
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-500">1 USD =</span>
              <Input
                placeholder="0.00"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="font-mono text-lg h-11 bg-zinc-50/50 border-zinc-200 rounded-lg"
              />
            </div>
            <p className="text-[10px] text-zinc-400">
              Backend field: <span className="font-mono">exchangeRateToUsd</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Region
            </Label>
            <Input
              placeholder="e.g. Africa"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="h-11 bg-zinc-50/50 border-zinc-200 rounded-lg"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-zinc-100 rounded bg-zinc-50">
            <Label className="text-xs">Active on Platform</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>

        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 bg-white shrink-0">
          <Button
            variant="gold"
            onClick={submit}
            disabled={!canSubmit || createM.isPending || updateM.isPending}
            className="h-11 rounded-xl font-bold uppercase tracking-widest text-xs min-w-45"
          >
            {createM.isPending || updateM.isPending ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" /> Saving...
              </span>
            ) : (
              "Save Configuration"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}