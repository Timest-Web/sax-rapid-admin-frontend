/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Crown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AppDialog } from "@/components/custom-dialog";

import type { SubscriptionPlan } from "@/src/features/subscriptions/api";

type ModalValues = {
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  maxProducts: string;
  displayOrder: string;
  canBoostProducts: boolean;
  hasAnalytics: boolean;
  hasPrioritySupport: boolean;
};

export function SubscriptionModal(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: SubscriptionPlan | null;
  onSubmit: (payload: {
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    maxProducts: number;
    displayOrder: number;
    canBoostProducts: boolean;
    hasAnalytics: boolean;
    hasPrioritySupport: boolean;
  }) => void;
  isSubmitting?: boolean;
}) {
  const { open, onOpenChange, initialData, onSubmit, isSubmitting } = props;
  const isEdit = !!initialData;

  const [v, setV] = useState<ModalValues>({
    name: "",
    description: "",
    monthlyPrice: "",
    yearlyPrice: "",
    maxProducts: "",
    displayOrder: "1",
    canBoostProducts: false,
    hasAnalytics: false,
    hasPrioritySupport: false,
  });

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setV({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        monthlyPrice: String(initialData.monthlyPrice ?? ""),
        yearlyPrice: String(initialData.yearlyPrice ?? ""),
        maxProducts: String(initialData.maxProducts ?? ""),
        displayOrder: String(initialData.displayOrder ?? 1),
        canBoostProducts: !!initialData.canBoostProducts,
        hasAnalytics: !!initialData.hasAnalytics,
        hasPrioritySupport: !!initialData.hasPrioritySupport,
      });
    } else {
      setV({
        name: "",
        description: "",
        monthlyPrice: "",
        yearlyPrice: "",
        maxProducts: "",
        displayOrder: "1",
        canBoostProducts: false,
        hasAnalytics: false,
        hasPrioritySupport: false,
      });
    }
  }, [open, initialData]);

  const formId = "subscriptionPlanForm";

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Subscription Plan" : "Create Subscription Plan"}
      description="Define pricing and feature limits for vendors."
      icon={<Crown size={16} />}
      size="custom"
      maxWidthClassName="sm:max-w-[620px]"
      bodyMaxHeightClassName="max-h-[40vh]"
      footer={
        <>
          <Button
            type="submit"
            form={formId}
            className="bg-zinc-900 text-[#D4AF37] px-8 h-11"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : isEdit ? "Update Plan" : "Create Plan"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-6 h-11"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </>
      }
    >
      <form
        id={formId}
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();

          onSubmit({
            name: v.name.trim(),
            description: v.description.trim(),
            monthlyPrice: Number(v.monthlyPrice),
            yearlyPrice: Number(v.yearlyPrice),
            maxProducts: Number(v.maxProducts),
            displayOrder: Number(v.displayOrder),
            canBoostProducts: v.canBoostProducts,
            hasAnalytics: v.hasAnalytics,
            hasPrioritySupport: v.hasPrioritySupport,
          });
        }}
      >
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Plan Name <span className="text-[#D4AF37]">*</span>
          </Label>
          <Input
            value={v.name}
            onChange={(e) => setV((s) => ({ ...s, name: e.target.value }))}
            required
            className="h-11 bg-zinc-50/50 border-zinc-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Monthly Price <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input
              type="number"
              value={v.monthlyPrice}
              onChange={(e) => setV((s) => ({ ...s, monthlyPrice: e.target.value }))}
              required
              className="h-11 font-mono bg-zinc-50/50 border-zinc-200"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Yearly Price <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input
              type="number"
              value={v.yearlyPrice}
              onChange={(e) => setV((s) => ({ ...s, yearlyPrice: e.target.value }))}
              required
              className="h-11 font-mono bg-zinc-50/50 border-zinc-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Max Products <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input
              type="number"
              value={v.maxProducts}
              onChange={(e) => setV((s) => ({ ...s, maxProducts: e.target.value }))}
              required
              className="h-11 font-mono bg-zinc-50/50 border-zinc-200"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Display Order <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input
              type="number"
              value={v.displayOrder}
              onChange={(e) => setV((s) => ({ ...s, displayOrder: e.target.value }))}
              required
              className="h-11 font-mono bg-zinc-50/50 border-zinc-200"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Description
          </Label>
          <Textarea
            value={v.description}
            onChange={(e) => setV((s) => ({ ...s, description: e.target.value }))}
            className="resize-none h-24 bg-zinc-50/50 border-zinc-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={v.canBoostProducts}
              onChange={(e) => setV((s) => ({ ...s, canBoostProducts: e.target.checked }))}
            />
            Can boost products
          </label>

          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={v.hasAnalytics}
              onChange={(e) => setV((s) => ({ ...s, hasAnalytics: e.target.checked }))}
            />
            Has analytics
          </label>

          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={v.hasPrioritySupport}
              onChange={(e) => setV((s) => ({ ...s, hasPrioritySupport: e.target.checked }))}
            />
            Priority support
          </label>
        </div>
      </form>
    </AppDialog>
  );
}