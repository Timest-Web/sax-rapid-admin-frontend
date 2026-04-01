/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { SubscriptionPackage } from "./column";

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

  const handleSubmit = () => {
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
      <DialogContent className="sm:max-w-[500px] bg-white text-zinc-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown size={18} className="text-zinc-500" />
            {isEdit ? "Edit Subscription Plan" : "Create Subscription Plan"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Package Name */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-700">Package Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Premium Plan"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-700">Duration (Days)</Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 30"
              />
            </div>
            {/* Upload Limit */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-700">Product Upload Limit</Label>
              <Input
                type="number"
                value={uploadLimit}
                onChange={(e) => setUploadLimit(e.target.value)}
                placeholder="e.g. 100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-700">Amount</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="font-mono"
              />
            </div>
            {/* Currency */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-700">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
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
          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-700">Row Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the features..."
              className="resize-none min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-zinc-900 hover:bg-zinc-800 text-white">
            {isEdit ? "Update Plan" : "Create Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}