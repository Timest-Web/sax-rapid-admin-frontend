/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  const [price, setPrice] = useState("0");
  const [currency, setCurrency] = useState("NGN");
  const [duration, setDuration] = useState("1");
  const [description, setDescription] = useState("");

  // Populate data when modal opens
  useEffect(() => {
    if (open) {
      if (isEdit) {
        setName(initialData.name || "");
        setPrice(initialData.price?.toString().replace(/[^0-9.]/g, "") || "0");
        setCurrency(initialData.currency || "NGN");
        setDuration(initialData.duration?.toString().replace(/[^0-9]/g, "") || "1");
        setDescription(initialData.description || "");
      } else {
        setName("");
        setPrice("0");
        setCurrency("NGN");
        setDuration("1");
        setDescription("");
      }
    }
  }, [open, isEdit, initialData]);

  const handleSubmit = () => {
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
            className="h-8 w-8 text-zinc-500 hover:text-emerald-600 bg-white shadow-sm border border-zinc-200 rounded-full"
          >
            <Edit2 size={14} />
          </Button>
        ) : (
          <Button className="bg-[#059669] hover:bg-[#047857] text-white font-bold text-[11px] tracking-widest uppercase rounded-md h-10 px-4">
            <Plus className="mr-2 h-4 w-4" /> New Package
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white text-zinc-900 rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
        {/* HEADER */}
        <DialogHeader className="p-6 pb-4 flex flex-row items-center gap-4 space-y-0 border-b border-zinc-100">
          <div className="h-12 w-12 rounded-full bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
            <Zap size={24} className="fill-current" />
          </div>
          <div className="text-left">
            <DialogTitle className="text-lg font-black uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              {isEdit ? "Edit" : "Add"} Boost Package
            </DialogTitle>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
              {isEdit ? "Update promotion tier details" : "Create a new promotion tier"}
            </p>
          </div>
        </DialogHeader>

        {/* BODY */}
        <div className="p-6 space-y-5">
          {/* Package Name */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-700">
              Package Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gold Boost"
              className="h-11 border-zinc-200 focus-visible:ring-[#059669] rounded-lg"
            />
          </div>

          {/* Price & Currency Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-700">
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-11 border-zinc-200 focus-visible:ring-[#059669] rounded-lg font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-700">
                Currency <span className="text-red-500">*</span>
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="h-11 border-zinc-200 focus:ring-[#059669] rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-700">
              Duration (Days) <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-11 border-zinc-200 focus-visible:ring-[#059669] rounded-lg font-mono"
            />
            <p className="text-[11px] text-zinc-500 font-medium">
              Days the boost remains active
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-700">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Package features and benefits..."
              className="resize-none border-zinc-200 focus-visible:ring-[#059669] rounded-lg min-h-[80px]"
            />
          </div>

          {/* Info Banner */}
          <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-lg p-3.5 flex gap-3 items-start mt-2">
            <Info size={16} className="text-[#059669] shrink-0 mt-0.5" />
            <p className="text-[9px] font-bold text-[#065f46] uppercase tracking-[0.15em] leading-relaxed">
              New boost packages are immediately visible to users. Verify all specifications before execution.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 pt-0">
          <Button
            onClick={handleSubmit}
            className="w-full h-12 bg-[#059669] hover:bg-[#047857] text-white font-bold tracking-widest uppercase text-xs rounded-xl"
          >
            {isEdit ? (
              "Update Package"
            ) : (
              <>
                <Plus size={16} className="mr-2" /> Deploy Package
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}