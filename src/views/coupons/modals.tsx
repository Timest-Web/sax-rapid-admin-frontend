/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppDialog } from "@/components/custom-dialog";

import type { CouponRow } from "./column";
import type { CreateCouponInput } from "@/src/features/coupons/api";

function toIsoOrDefault(dateOnly: string) {
  if (!dateOnly) return "0001-01-01T00:00:00";
  return new Date(dateOnly + "T00:00:00Z").toISOString();
}

function randomCode(len = 8) {
  return Math.random().toString(36).slice(2, 2 + len).toUpperCase();
}

export function AddCouponModal(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon?: React.ReactNode;
  initialData?: CouponRow | null;
  isSubmitting?: boolean;
  onSubmit: (
    payload: Omit<CreateCouponInput, "status">,
    mode: "Active" | "Draft",
  ) => void;
}) {
  const { open, onOpenChange, initialData, onSubmit, isSubmitting, icon } = props;
  const isEdit = !!initialData;

  // Form state
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("Percentage"); // "Percentage" | "FixedCart"
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [scope, setScope] = useState("Global"); // "Global" | "Vendor"
  const [vendorId, setVendorId] = useState(""); // required when scope === "Vendor"

  const [usageLimit, setUsageLimit] = useState<string>(""); // empty => null
  const [expiryDate, setExpiryDate] = useState<string>(""); // YYYY-MM-DD
  const [allowFreeShipping, setAllowFreeShipping] = useState(false);
  const [showOnStore, setShowOnStore] = useState(true);

  // which footer button user clicked
  const [submitMode, setSubmitMode] = useState<"Active" | "Draft">("Active");

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setCode(initialData.code ?? "");
      setDescription(""); // list endpoint doesn't return description
      setDiscountType(initialData.discountType ?? "Percentage");
      setDiscountValue(Number(initialData.value ?? 0));
      setScope(initialData.scope ?? "Global");

      // list endpoint doesn't return vendorId; leave blank
      setVendorId("");

      setUsageLimit(initialData.usageLimit === null ? "" : String(initialData.usageLimit));
      setExpiryDate(
        initialData.expiryDate?.startsWith("0001-01-01")
          ? ""
          : (initialData.expiryDate ?? "").slice(0, 10),
      );

      // list endpoint doesn't return these; default
      setAllowFreeShipping(false);
      setShowOnStore(true);
    } else {
      setCode("");
      setDescription("");
      setDiscountType("Percentage");
      setDiscountValue(0);
      setScope("Global");
      setVendorId("");
      setUsageLimit("");
      setExpiryDate("");
      setAllowFreeShipping(false);
      setShowOnStore(true);
    }
  }, [open, initialData]);

  const payloadBase: Omit<CreateCouponInput, "status"> = useMemo(
    () => ({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),

      scope,
      vendorId: scope === "Vendor" ? (vendorId.trim() || null) : null,
      adCampaignId: null,

      allowFreeShipping,
      showOnStore,

      usageLimit: usageLimit === "" ? null : Number(usageLimit),
      expiryDate: toIsoOrDefault(expiryDate),

      description: description.trim() || null,
    }),
    [
      code,
      discountType,
      discountValue,
      scope,
      vendorId,
      allowFreeShipping,
      showOnStore,
      usageLimit,
      expiryDate,
      description,
    ],
  );

  const canSubmit =
    !!payloadBase.code &&
    !Number.isNaN(payloadBase.discountValue) &&
    (scope !== "Vendor" || !!vendorId.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(payloadBase, submitMode);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Coupon" : "Create Coupon"}
      description="Configure discount rules, restrictions, and applicability."
      icon={icon}
      size="custom"
      maxWidthClassName="sm:max-w-[600px]"
      bodyMaxHeightClassName="max-h-[40vh]" 
      contentClassName=""
      footer={
        <>
          <Button
            type="submit"
            form="couponForm"
            onClick={() => setSubmitMode("Active")}
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs font-bold uppercase tracking-widest h-11 px-8 rounded-xl"
            disabled={isSubmitting || !canSubmit}
          >
            {isSubmitting ? "Saving..." : "Publish Coupon"}
          </Button>

          <Button
            type="submit"
            form="couponForm"
            onClick={() => setSubmitMode("Draft")}
            className="bg-zinc-200 text-zinc-800 hover:bg-zinc-300 text-xs font-bold uppercase tracking-widest h-11 px-6 rounded-xl"
            disabled={isSubmitting || !canSubmit}
          >
            Save Draft
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs font-bold uppercase tracking-widest h-11 px-6 rounded-xl border-zinc-200"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </>
      }
    >
      <form id="couponForm" onSubmit={handleSubmit} className="space-y-5 py-8">
        {/* Code + Generate */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Coupon Code <span className="text-[#D4AF37]">*</span>
          </Label>

          <div className="flex gap-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
              className="h-11 font-mono font-bold text-lg tracking-wider uppercase bg-zinc-50/50 border-zinc-200"
              placeholder="e.g. SUMMER24"
            />
            <Button
              type="button"
              variant="outline"
              className="h-11 px-4 text-xs font-bold uppercase tracking-widest border-zinc-200"
              onClick={() => setCode(randomCode())}
              disabled={isSubmitting}
            >
              Generate
            </Button>
          </div>

          {scope === "Vendor" && !vendorId.trim() && (
            <p className="text-[11px] text-rose-600">Vendor ID is required for Vendor scope.</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Description (Internal)
          </Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none h-20 bg-zinc-50/50 border-zinc-200"
            placeholder="What is this coupon for?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Discount Type */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Discount Type
            </Label>
            <Select value={discountType} onValueChange={setDiscountType}>
              <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Percentage">Percentage</SelectItem>
                <SelectItem value="FixedCart">FixedCart</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Discount Value */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Discount Value
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg pr-10"
              />
              {discountType === "Percentage" && (
                <span className="absolute right-3 top-3 text-zinc-400 font-bold">%</span>
              )}
            </div>
          </div>

          {/* Scope */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Scope
            </Label>
            <Select value={scope} onValueChange={setScope}>
              <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Global">Global</SelectItem>
                <SelectItem value="Vendor">Vendor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Usage Limit */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Usage Limit (optional)
            </Label>
            <Input
              type="number"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              placeholder="Leave blank for unlimited"
              className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
            />
          </div>

          {/* VendorId (only when Vendor scope) */}
          {scope === "Vendor" && (
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Vendor ID <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                placeholder="Vendor UUID"
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
              />
            </div>
          )}

          {/* Expiry */}
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Expiry Date (optional)
            </Label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="h-11 bg-zinc-50/50 border-zinc-200 rounded-lg"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center space-x-3 bg-zinc-50/50 p-3 rounded-lg border border-zinc-100">
            <Checkbox
              checked={allowFreeShipping}
              onCheckedChange={(v) => setAllowFreeShipping(Boolean(v))}
              className="data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
            />
            <div className="flex flex-col">
              <Label className="text-sm font-bold text-zinc-900 cursor-pointer">
                Allow free shipping
              </Label>
              <span className="text-[10px] text-zinc-500">
                Check this if the coupon grants free shipping.
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-zinc-50/50 p-3 rounded-lg border border-zinc-100">
            <Checkbox
              checked={showOnStore}
              onCheckedChange={(v) => setShowOnStore(Boolean(v))}
              className="data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
            />
            <div className="flex flex-col">
              <Label className="text-sm font-bold text-zinc-900 cursor-pointer">
                Show on store
              </Label>
              <span className="text-[10px] text-zinc-500">
                Display this coupon visibly on the storefront.
              </span>
            </div>
          </div>
        </div>
      </form>
    </AppDialog>
  );
}



import { Trash2 } from "lucide-react";


type DeleteCouponModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDeleting?: boolean;
  onConfirm: () => void;
};

export function DeleteCouponModal({
  open,
  onOpenChange,
  isDeleting,
  onConfirm,
}: DeleteCouponModalProps) {
  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Coupon"
      description="This action cannot be undone."
      icon={<Trash2 size={16} />}
      size="sm"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="h-11 px-6 rounded-xl text-xs font-bold uppercase tracking-widest"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-11 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest"
          >
            {isDeleting ? "Deleting..." : "Delete Coupon"}
          </Button>
        </>
      }
    >
      <div className="py-6">
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm text-zinc-700">
            Are you sure you want to permanently delete this coupon?
          </p>

          <p className="mt-2 text-xs text-zinc-500">
            This action cannot be reversed and the coupon will no longer be
            available for use.
          </p>
        </div>
      </div>
    </AppDialog>
  );
}