/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import type { ShippingPartner, CreateShippingPartnerInput, UpdateShippingPartnerInput } from "@/src/features/shipping/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent as AlertDialogContent2,
  AlertDialogDescription as AlertDialogDescription2,
  AlertDialogFooter as AlertDialogFooter2,
  AlertDialogHeader as AlertDialogHeader2,
  AlertDialogTitle as AlertDialogTitle2,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, Trash2 } from "lucide-react";

function safe(v: string | null | undefined) {
  return v ?? "";
}

export function ManageProviderModal(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: ShippingPartner | null;
  isSaving?: boolean;
  onCreate: (payload: CreateShippingPartnerInput) => void;
  onUpdate: (partnerId: string, payload: UpdateShippingPartnerInput) => void;
}) {
  const { open, onOpenChange, initial, isSaving, onCreate, onUpdate } = props;

  const isEdit = !!initial?.id;

  const [name, setName] = useState("");
  const [partnerType, setPartnerType] = useState("");
  const [website, setWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    if (!open) return;

    setName(initial?.name ?? "");
    setPartnerType(initial?.partnerType ?? "");
    setWebsite(safe(initial?.website));
    setContactEmail(safe(initial?.contactEmail));
    setContactPhone(safe(initial?.contactPhone));
    setStatus(initial?.status ?? "");
    setRating(Number(initial?.rating ?? 0));
  }, [open, initial?.id]);

  const canSave = useMemo(() => {
    return name.trim().length > 1 && partnerType.trim().length > 0 && status.trim().length > 0;
  }, [name, partnerType, status]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
      }}
    >
      <DialogContent
        className="
          sm:max-w-[700px]
          max-h-[90vh]
          overflow-hidden
          p-0
          bg-white border-zinc-200
          rounded-2xl shadow-2xl
          flex flex-col
        "
      >
        {/* Header (fixed) */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />

          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Truck size={16} />
              </div>
              {isEdit ? "Edit Logistics Partner" : "Add Logistics Partner"}
            </DialogTitle>

            <DialogDescription className="text-xs text-zinc-500 mt-2 leading-relaxed pl-11">
              {isEdit
                ? "Updates partner details"
                : "Adds a new partner using"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Name <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 bg-zinc-50/50 border-zinc-200"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Partner Type <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)}
                className="h-11 bg-zinc-50/50 border-zinc-200 font-mono"
                placeholder="e.g. Integrated / Manual"
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Status <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-11 bg-zinc-50/50 border-zinc-200 font-mono"
                placeholder="e.g. Active / Inactive"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Rating {isEdit ? "" : "(optional)"}
              </Label>
              <Input
                type="number"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="h-11 bg-zinc-50/50 border-zinc-200 font-mono"
                disabled={isSaving || !isEdit} // backend update includes rating, create does not
              />
              {!isEdit ? (
                <p className="text-[10px] text-zinc-500">
                  Rating can be set after creation.
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Website
              </Label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="h-11 bg-zinc-50/50 border-zinc-200 font-mono"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Contact Email
              </Label>
              <Input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="h-11 bg-zinc-50/50 border-zinc-200 font-mono"
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Contact Phone
            </Label>
            <Input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="h-11 bg-zinc-50/50 border-zinc-200 font-mono"
              disabled={isSaving}
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 pt-0 sm:justify-between flex-row-reverse shrink-0">
          <Button
            disabled={!canSave || isSaving}
            onClick={() => {
              if (isEdit && initial?.id) {
                onUpdate(initial.id, {
                  name: name.trim(),
                  partnerType: partnerType.trim(),
                  website: website.trim(),
                  contactEmail: contactEmail.trim(),
                  contactPhone: contactPhone.trim(),
                  status: status.trim(),
                  rating: Number(rating ?? 0),
                });
              } else {
                onCreate({
                  name: name.trim(),
                  partnerType: partnerType.trim(),
                  website: website.trim(),
                  contactEmail: contactEmail.trim(),
                  contactPhone: contactPhone.trim(),
                  status: status.trim(),
                });
              }
            }}
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs font-bold uppercase tracking-widest rounded-xl px-8 h-11"
          >
            {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Add Partner"}
          </Button>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="bg-white border-zinc-200 text-zinc-600 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDeleteProviderModal(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  partner: ShippingPartner | null;
  isDeleting?: boolean;
  onConfirm: (partnerId: string) => void;
}) {
  const { open, onOpenChange, partner, isDeleting, onConfirm } = props;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent2 className="p-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />

          <AlertDialogHeader2>
            <AlertDialogTitle2 className="flex items-center gap-2">
              <Trash2 size={18} className="text-rose-600" />
              Remove logistics partner
            </AlertDialogTitle2>
            <AlertDialogDescription2>
              This will remove{" "}
              <span className="font-semibold">{partner?.name ?? "this partner"}</span>.
            </AlertDialogDescription2>
          </AlertDialogHeader2>
        </div>

        <AlertDialogFooter2 className="p-6 pt-4 sm:justify-between flex-row-reverse">
          <AlertDialogAction
            className="bg-rose-600 hover:bg-rose-700"
            disabled={!partner?.id || isDeleting}
            onClick={() => partner?.id && onConfirm(partner.id)}
          >
            {isDeleting ? "Removing..." : "Remove"}
          </AlertDialogAction>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
        </AlertDialogFooter2>
      </AlertDialogContent2>
    </AlertDialog>
  );
}