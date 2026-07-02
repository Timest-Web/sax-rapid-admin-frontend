/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { CreateCampaignInput } from "@/src/features/promotions/api";
import { useAdminRoles } from "@/src/features/roles/hooks"; // NOT needed; ignore if you don't want
import { useVendors } from "@/src/features/vendors/hooks";  // ✅ your existing vendors list hook

function toDateTimeLocal(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromDateTimeLocal(v: string) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

export function CreateCampaignModal(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isSaving?: boolean;
  onSubmit: (payload: CreateCampaignInput) => void;
  defaultVendorId?: string;
}) {
  const { open, onOpenChange, isSaving, onSubmit, defaultVendorId } = props;

  const vendorsQ = useVendors({ page: 1, pageSize: 50 }); // adjust page size if you want
  const vendors = vendorsQ.data?.items ?? (vendorsQ.data as any)?.data ?? (vendorsQ.data as any) ?? [];

  const [vendorId, setVendorId] = useState<string>(defaultVendorId ?? "");

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [subHeadline, setSubHeadline] = useState("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [themeColorHex, setThemeColorHex] = useState("#2563EB");
  const [callToActionText, setCallToActionText] = useState("Shop Now");
  const [targetUrl, setTargetUrl] = useState("");
  const [badgeTitle, setBadgeTitle] = useState("");
  const [badgeSubtitle, setBadgeSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState<number>(0);
  const [currency, setCurrency] = useState("NGN");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [adType, setAdType] = useState("Homepage Featured");

  const canSubmit = useMemo(() => {
    const vId = (defaultVendorId ?? vendorId).trim();
    return (
      !!vId &&
      name.trim().length > 1 &&
      budget >= 0 &&
      currency.trim().length > 0 &&
      !!startDate &&
      !!endDate &&
      adType.trim().length > 0
    );
  }, [defaultVendorId, vendorId, name, budget, currency, startDate, endDate, adType]);

  const reset = () => {
    setVendorId(defaultVendorId ?? "");
    setName("");
    setTagline("");
    setHeadline("");
    setSubHeadline("");
    setBackgroundImageUrl("");
    setThemeColorHex("#2563EB");
    setCallToActionText("Shop Now");
    setTargetUrl("");
    setBadgeTitle("");
    setBadgeSubtitle("");
    setDescription("");
    setBudget(0);
    setCurrency("NGN");
    setStartDate("");
    setEndDate("");
    setTargetAudience("");
    setAdType("Homepage Featured");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden p-0 bg-white border-zinc-200 rounded-2xl shadow-2xl flex flex-col">
        <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Campaign
            </DialogTitle>
            <DialogDescription className="text-xs">
              Uses <span className="font-mono">POST /api/admin/promotions/campaigns</span>.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 overflow-y-auto min-h-0 space-y-6">
          {/* Vendor */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Vendor *
            </Label>

            {defaultVendorId ? (
              <Input value={defaultVendorId} readOnly className="h-11 font-mono bg-zinc-50" />
            ) : (
              <Select value={vendorId} onValueChange={setVendorId} disabled={isSaving}>
                <SelectTrigger className="h-11 bg-zinc-50 border-zinc-200 rounded-lg">
                  <SelectValue placeholder={vendorsQ.isLoading ? "Loading vendors..." : "Select vendor"} />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(vendors) &&
                    vendors.map((v: any) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.shopName ?? v.name ?? v.ownerName ?? v.id}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}

            {!defaultVendorId && vendorsQ.isError ? (
              <div className="text-xs text-rose-600">Failed to load vendors.</div>
            ) : null}
          </div>

          {/* Basic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Ad Type *</Label>
              <Select value={adType} onValueChange={setAdType}>
                <SelectTrigger className="h-11 bg-zinc-50 border-zinc-200 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Homepage Featured">Homepage Featured</SelectItem>
                  <SelectItem value="Banner Ad">Banner Ad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-24" />
          </div>

          {/* Visuals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Background Image URL</Label>
              <Input value={backgroundImageUrl} onChange={(e) => setBackgroundImageUrl(e.target.value)} className="h-11 font-mono" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Theme Color (Hex)</Label>
              <Input value={themeColorHex} onChange={(e) => setThemeColorHex(e.target.value)} className="h-11 font-mono" />
            </div>
          </div>

          {/* Copy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Headline</Label>
              <Input value={headline} onChange={(e) => setHeadline(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Sub-headline</Label>
              <Input value={subHeadline} onChange={(e) => setSubHeadline(e.target.value)} className="h-11" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tagline</Label>
              <Input value={tagline} onChange={(e) => setTagline(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Call To Action</Label>
              <Input value={callToActionText} onChange={(e) => setCallToActionText(e.target.value)} className="h-11" />
            </div>
          </div>

          {/* Links & Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Target URL</Label>
              <Input value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} className="h-11 font-mono" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Target Audience</Label>
              <Input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="h-11" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Badge Title</Label>
              <Input value={badgeTitle} onChange={(e) => setBadgeTitle(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Badge Subtitle</Label>
              <Input value={badgeSubtitle} onChange={(e) => setBadgeSubtitle(e.target.value)} className="h-11" />
            </div>
          </div>

          {/* Budget + Dates */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Budget *</Label>
              <Input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="h-11 font-mono" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Currency *</Label>
              <Input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} className="h-11 font-mono" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Start Date *</Label>
              <Input type="datetime-local" value={toDateTimeLocal(startDate)} onChange={(e) => setStartDate(fromDateTimeLocal(e.target.value))} className="h-11" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">End Date *</Label>
              <Input type="datetime-local" value={toDateTimeLocal(endDate)} onChange={(e) => setEndDate(fromDateTimeLocal(e.target.value))} className="h-11" />
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-zinc-100 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>

          <Button
            disabled={!canSubmit || isSaving}
            onClick={() => {
              const payload: CreateCampaignInput = {
                name,
                tagline,
                headline,
                subHeadline,
                backgroundImageUrl,
                themeColorHex,
                callToActionText,
                targetUrl,
                badgeTitle,
                badgeSubtitle,
                description,
                budget,
                currency,
                startDate,
                endDate,
                vendorId: (defaultVendorId ?? vendorId).trim(),
                targetAudience,
                adType,
              };

              onSubmit(payload);
            }}
            className="bg-zinc-900 text-white hover:bg-[#D4AF37] hover:text-black"
          >
            {isSaving ? "Creating..." : "Create Campaign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}