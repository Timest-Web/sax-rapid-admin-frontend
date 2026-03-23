/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";

export function PlanEditorSheet({ open, onOpenChange, initialData }: any) {
  const [features, setFeatures] = useState<string[]>(
    initialData?.features || [""],
  );

  const addFeature = () => setFeatures([...features, ""]);
  const updateFeature = (index: number, val: string) => {
    const newFeatures = [...features];
    newFeatures[index] = val;
    setFeatures(newFeatures);
  };
  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-white border-l border-zinc-200">
        <SheetHeader className="mb-6">
          <SheetTitle>Plan Configuration</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input
                defaultValue={initialData?.name}
                placeholder="e.g. Gold Tier"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (₦)</Label>
                <Input
                  defaultValue={initialData?.price}
                  placeholder="0.00"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label>Billing Interval</Label>
                <Input
                  defaultValue={initialData?.interval}
                  placeholder="Month / Year"
                />
              </div>
            </div>
          </div>

          {/* Features Builder */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Plan Features</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={addFeature}
                className="h-6 text-[10px]"
              >
                <Plus className="mr-1 h-3 w-3" /> Add Row
              </Button>
            </div>
            <div className="space-y-2">
              {features.map((feat, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={feat}
                    onChange={(e) => updateFeature(idx, e.target.value)}
                    placeholder={`Feature ${idx + 1}`}
                    className="h-9 text-xs"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-zinc-400 hover:text-rose-500"
                    onClick={() => removeFeature(idx)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-zinc-50 rounded border border-zinc-200">
            <div className="space-y-0.5">
              <Label>Active Plan</Label>
              <p className="text-[10px] text-zinc-500">
                Visible to vendors during signup
              </p>
            </div>
            <Switch defaultChecked={initialData?.status === "Active"} />
          </div>
        </div>

        <SheetFooter className="mt-8">
          <Button
            variant="default"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Save Plan
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
