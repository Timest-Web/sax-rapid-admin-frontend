/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap, Info, Plus, Edit2 } from "lucide-react";

export function PackageModal({ initialData }: { initialData?: any }) {
  const [open, setOpen] = useState(false);
  const isEdit = !!initialData;

  // Form States
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  // Populate data when modal opens
  useEffect(() => {
    if (open) {
      if (isEdit) {
        setName(initialData.name || "");
        setPrice(initialData.price?.toString().replace(/[^0-9.]/g, "") || "");
        setCurrency(initialData.currency || "NGN");
        setDuration(initialData.duration?.toString().replace(/[^0-9]/g, "") || "");
        setDescription(initialData.description || "");
      } else {
        setName("");
        setPrice("");
        setCurrency("NGN");
        setDuration("");
        setDescription("");
      }
    }
  }, [open, isEdit, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, price, currency, duration, description });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white/80 backdrop-blur border border-zinc-200 text-zinc-600 hover:text-[#D4AF37] hover:bg-zinc-900 hover:border-zinc-900 shadow-sm rounded-lg transition-all"
          >
            <Edit2 size={14} />
          </Button>
        ) : (
          <Button className="bg-zinc-900 hover:bg-[#D4AF37] hover:text-black transition-colors text-white text-xs gap-2 rounded-lg px-4 h-9 font-bold uppercase tracking-widest">
            <Plus size={14} className="mr-1" /> New Package
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-scroll bg-white border-zinc-200 p-0 rounded-2xl shadow-2xl">
        {/* ─── MODAL HEADER ─── */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Zap size={16} />
              </div>
              {isEdit ? "Edit Boost Package" : "Add Boost Package"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              {isEdit
                ? "Update promotion tier details and pricing configurations."
                : "Create a new promotion tier for vendor advertisements."}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* ─── FORM BODY ─── */}
        <form id="packageForm" onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* Package Name */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Package Name <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gold Boost"
              required
              className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-medium focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
            />
          </div>

          {/* Price & Currency Row */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Price <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Currency <span className="text-[#D4AF37]">*</span>
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-bold focus:ring-[#D4AF37] transition-all rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN (Naira)</SelectItem>
                  <SelectItem value="USD">USD (Dollar)</SelectItem>
                  <SelectItem value="GBP">GBP (Pounds)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Duration (Days) <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 7"
              required
              className="h-11 font-mono bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Description
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Package features and benefits..."
              className="resize-none h-24 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-[#D4AF37] rounded-lg custom-scrollbar"
            />
          </div>

          {/* Info Banner */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5 flex gap-3 items-start mt-2">
            <Info size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
            <p className="text-[10px] font-medium text-zinc-600 leading-relaxed">
              New boost packages are immediately visible to users. Verify all specifications before execution.
            </p>
          </div>
        </form>

        {/* ─── MODAL FOOTER ─── */}
        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 sm:justify-between flex-row-reverse bg-white">
          <Button
            type="submit"
            form="packageForm"
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-xl transition-all shadow-md"
          >
            {isEdit ? "Update Package" : "Deploy Package"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11 transition-all"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}