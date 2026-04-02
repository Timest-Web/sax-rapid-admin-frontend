/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Crown } from "lucide-react";
import { SubscriptionPackage } from "./column"; // Make sure to adjust import path if needed

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SubscriptionPackage | null;
  onSave: (pkg: SubscriptionPackage) => void;
}

export function SubscriptionModal({ isOpen, onClose, initialData, onSave }: ModalProps) {
  const isEdit = !!initialData;

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [uploadLimit, setUploadLimit] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setDuration(initialData.duration.toString());
        setAmount(initialData.amount.toString());
        setCurrency(initialData.currency);
        setUploadLimit(initialData.uploadLimit.toString());
        setDescription(initialData.description);
      } else {
        setName("");
        setDuration("30");
        setAmount("");
        setCurrency("NGN");
        setUploadLimit("");
        setDescription("");
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !duration || !amount || !uploadLimit) return;

    onSave({
      id: initialData?.id || `PKG-${Math.floor(Math.random() * 1000)}`,
      name,
      duration: Number(duration),
      amount: Number(amount),
      currency,
      uploadLimit: Number(uploadLimit),
      description,
      status: initialData?.status || "active",
      createdAt: initialData?.createdAt || new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-137.5 max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
        
        {/* ─── MODAL HEADER ─── */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Crown size={16} />
              </div>
              {isEdit ? "Edit Sax Rapid Plan" : "Create Subscription Plan"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              Define the billing cycle, pricing, and product upload limits for vendors using this package.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* ─── FORM BODY ─── */}
        <form id="subscriptionForm" onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Package Name */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Package Name <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sax Rapid Premium"
              required
              className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-medium focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Duration */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Duration (Days) <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 30"
                required
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
              />
            </div>
            {/* Upload Limit */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Upload Limit <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                type="number"
                value={uploadLimit}
                onChange={(e) => setUploadLimit(e.target.value)}
                placeholder="e.g. 100"
                required
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Amount */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Amount <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
              />
            </div>
            {/* Currency */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Currency <span className="text-[#D4AF37]">*</span>
              </Label>
              <Select value={currency} onValueChange={setCurrency} required>
                <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-bold focus:ring-[#D4AF37] transition-all rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN (Naira)</SelectItem>
                  <SelectItem value="ZAR">ZAR (Rand)</SelectItem>
                  <SelectItem value="USD">USD (Dollars)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Plan Description
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the features..."
              className="resize-none h-24 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-[#D4AF37] rounded-lg custom-scrollbar"
            />
          </div>
        </form>

        {/* ─── MODAL FOOTER ─── */}
        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 sm:justify-between flex-row-reverse">
          <Button 
            type="submit" 
            form="subscriptionForm"
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-xl transition-all shadow-md"
          >
            {isEdit ? "Update Plan" : "Create Plan"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11 transition-all"
          >
            Cancel
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}