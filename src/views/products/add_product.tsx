/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, RefreshCw, Package, AlertTriangle, X, Image as ImageIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { CreateProductInput } from "@/src/features/products/api";
import { useCreateProduct } from "@/src/features/products/hooks";

// Optional: if you already built currencies feature/hooks earlier, use it.
// If you don't have this hook, remove this import + related code and keep hardcoded currency options.
import { useSystemCurrencies } from "@/src/features/currencies/hooks";

type AttrRow = { name: string; value: string };

function num(v: string) {
  const n = Number(String(v ?? "").replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

function toIso(dtLocal: string) {
  if (!dtLocal) return "";
  return new Date(dtLocal).toISOString();
}

function isValidUrl(s: string) {
  try {
    // allow http/https
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function CreateProductModal() {
  const [open, setOpen] = useState(false);

  // core
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");

  // ids
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("0");

  // money/inventory
  const currenciesQ = useSystemCurrencies(); // optional
  const activeCurrencies = (currenciesQ.data ?? []).filter((c) => c.isActive);

  const [currency, setCurrency] = useState("NGN");
  const [basePrice, setBasePrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  // sale
  const [onSale, setOnSale] = useState(false);
  const [salePrice, setSalePrice] = useState("");
  const [saleStart, setSaleStart] = useState("");
  const [saleEnd, setSaleEnd] = useState("");

  // shipping
  const [weight, setWeight] = useState("0");
  const [dimensionLength, setDimensionLength] = useState("0");
  const [dimensionWidth, setDimensionWidth] = useState("0");
  const [dimensionHeight, setDimensionHeight] = useState("0");

  // attributes + images
  const [attributes, setAttributes] = useState<AttrRow[]>([{ name: "", value: "" }]);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  const createM = useCreateProduct();

  const cleanAttributes = useMemo(() => {
    return attributes
      .map((a) => ({ name: a.name.trim(), value: a.value.trim() }))
      .filter((a) => a.name.length > 0 && a.value.length > 0);
  }, [attributes]);

  const cleanImages = useMemo(() => {
    return imageUrls
      .map((u) => u.trim())
      .filter((u) => u.length > 0)
      .filter((u) => isValidUrl(u));
  }, [imageUrls]);

  const canSubmit = useMemo(() => {
    if (!name.trim()) return false;
    if (!sku.trim()) return false;
    if (num(categoryId) <= 0) return false;
    if (!currency.trim()) return false;
    if (num(basePrice) <= 0) return false;
    if (num(stockQuantity) < 0) return false;

    // If sale is enabled, enforce sale rules
    if (onSale) {
      if (num(salePrice) <= 0) return false;
      if (!saleStart || !saleEnd) return false;
      const startIso = toIso(saleStart);
      const endIso = toIso(saleEnd);
      if (!startIso || !endIso) return false;
      if (new Date(startIso) >= new Date(endIso)) return false;
      if (num(salePrice) >= num(basePrice)) return false;
    }

    return true;
  }, [name, sku, categoryId, currency, basePrice, stockQuantity, onSale, salePrice, saleStart, saleEnd]);

  const reset = () => {
    setName("");
    setSku("");
    setDescription("");
    setCategoryId("");
    setBrandId("0");
    setCurrency("NGN");
    setBasePrice("");
    setStockQuantity("");
    setOnSale(false);
    setSalePrice("");
    setSaleStart("");
    setSaleEnd("");
    setWeight("0");
    setDimensionLength("0");
    setDimensionWidth("0");
    setDimensionHeight("0");
    setAttributes([{ name: "", value: "" }]);
    setImageUrls([""]);
  };

  const submit = async () => {
    if (!canSubmit) return;

    // Base payload: no sale fields unless onSale
    const payloadBase: CreateProductInput = {
      name: name.trim(),
      description: description.trim(),
      categoryId: num(categoryId),
      brandId: num(brandId),

      basePrice: num(basePrice),
      currency,

      stockQuantity: num(stockQuantity),
      weight: num(weight),
      dimensionLength: num(dimensionLength),
      dimensionWidth: num(dimensionWidth),
      dimensionHeight: num(dimensionHeight),

      sku: sku.trim(),

      attributes: cleanAttributes,
      variations: [], // simple product for now
      imageUrls: cleanImages,
    };

    let payload: CreateProductInput = payloadBase;

    if (onSale) {
      const startIso = toIso(saleStart);
      const endIso = toIso(saleEnd);

      if (!startIso || !endIso) {
        toast.error("Sale start and end date are required.");
        return;
      }
      if (new Date(startIso) >= new Date(endIso)) {
        toast.error("Sale end date must be after start date.");
        return;
      }
      if (num(salePrice) <= 0) {
        toast.error("Sale price must be greater than 0.");
        return;
      }
      if (num(salePrice) >= num(basePrice)) {
        toast.error("Sale price must be less than base price.");
        return;
      }

      payload = {
        ...payloadBase,
        salePrice: num(salePrice),
        salePriceStartDate: startIso,
        salePriceEndDate: endIso,
      };
    }

    try {
      await createM.mutateAsync(payload);
      toast.success("Product created");
      setOpen(false);
      reset();
    } catch {
      // mutation hook already toasts error
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-9 text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white hover:bg-[#D4AF37] hover:text-black transition-colors"
        >
          <Plus className="mr-2 h-3.5 w-3.5" />
          Add New Product
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[780px] w-[calc(100vw-2rem)] max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col">
        {/* HEADER */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Package size={16} />
              </div>
              Create Product
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              Creates a new product listing. Sale price is applied only within the sale date window.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Core */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Product Name <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 bg-zinc-50/50 border-zinc-200 rounded-lg"
                placeholder="e.g. Apple AirPods Pro 2"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                SKU <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
                placeholder="e.g. AIRPODS-PRO-2"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Currency <span className="text-[#D4AF37]">*</span>
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(activeCurrencies.length ? activeCurrencies : [{ code: "NGN" }, { code: "ZAR" }] as any[]).map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Category ID <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
                placeholder="e.g. 12"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Brand ID
              </Label>
              <Input
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
                placeholder="0"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Description
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[110px] resize-none bg-zinc-50/50 border-zinc-200 rounded-lg"
                placeholder="Short description..."
              />
            </div>
          </div>

          <div className="h-px w-full bg-zinc-100" />

          {/* Pricing + Inventory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Base Price <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
                placeholder="e.g. 150000"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Stock Quantity <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
                placeholder="e.g. 25"
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between p-4 bg-white rounded-xl border border-zinc-200 shadow-sm">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-zinc-900 uppercase tracking-widest">
                  Sale Pricing
                </Label>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
                  Only applies within the date window
                </p>
              </div>
              <Switch checked={onSale} onCheckedChange={setOnSale} className="data-[state=checked]:bg-[#D4AF37]" />
            </div>

            {onSale && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Sale Price <span className="text-[#D4AF37]">*</span>
                  </Label>
                  <Input
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
                    placeholder="e.g. 135000"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Sale Start <span className="text-[#D4AF37]">*</span>
                  </Label>
                  <Input
                    type="datetime-local"
                    value={saleStart}
                    onChange={(e) => setSaleStart(e.target.value)}
                    className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Sale End <span className="text-[#D4AF37]">*</span>
                  </Label>
                  <Input
                    type="datetime-local"
                    value={saleEnd}
                    onChange={(e) => setSaleEnd(e.target.value)}
                    className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
                  />
                </div>
              </>
            )}
          </div>

          <div className="h-px w-full bg-zinc-100" />

          {/* Attributes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Attributes
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-[10px] uppercase tracking-widest"
                onClick={() => setAttributes((a) => [...a, { name: "", value: "" }])}
              >
                <Plus className="mr-2 h-3 w-3" />
                Add Attribute
              </Button>
            </div>

            <div className="space-y-2">
              {attributes.map((a, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    value={a.name}
                    onChange={(e) => {
                      const next = [...attributes];
                      next[idx] = { ...next[idx], name: e.target.value };
                      setAttributes(next);
                    }}
                    className="h-11 bg-zinc-50/50 border-zinc-200 rounded-lg"
                    placeholder="Name (e.g. Color)"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={a.value}
                      onChange={(e) => {
                        const next = [...attributes];
                        next[idx] = { ...next[idx], value: e.target.value };
                        setAttributes(next);
                      }}
                      className="h-11 bg-zinc-50/50 border-zinc-200 rounded-lg"
                      placeholder="Value (e.g. Black)"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-11 p-0"
                      onClick={() => setAttributes((old) => old.filter((_, i) => i !== idx))}
                      disabled={attributes.length === 1}
                      title="Remove"
                    >
                      <X className="h-4 w-4 text-zinc-500" />
                    </Button>
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-zinc-400">
                Only filled attributes are sent to the backend.
              </p>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Image URLs
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-[10px] uppercase tracking-widest"
                onClick={() => setImageUrls((u) => [...u, ""])}
              >
                <Plus className="mr-2 h-3 w-3" />
                Add Image
              </Button>
            </div>

            <div className="space-y-2">
              {imageUrls.map((u, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                    <Input
                      value={u}
                      onChange={(e) => {
                        const next = [...imageUrls];
                        next[idx] = e.target.value;
                        setImageUrls(next);
                      }}
                      className="h-11 pl-10 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-11 p-0"
                    onClick={() => setImageUrls((old) => old.filter((_, i) => i !== idx))}
                    disabled={imageUrls.length === 1}
                    title="Remove"
                  >
                    <X className="h-4 w-4 text-zinc-500" />
                  </Button>
                </div>
              ))}

              <p className="text-[10px] text-zinc-400">
                Only valid http/https URLs are submitted.
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-zinc-100" />

          {/* Shipping */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Shipping & Dimensions
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
                placeholder="Weight"
              />
              <Input
                value={dimensionLength}
                onChange={(e) => setDimensionLength(e.target.value)}
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
                placeholder="Length"
              />
              <Input
                value={dimensionWidth}
                onChange={(e) => setDimensionWidth(e.target.value)}
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
                placeholder="Width"
              />
              <Input
                value={dimensionHeight}
                onChange={(e) => setDimensionHeight(e.target.value)}
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
                placeholder="Height"
              />
            </div>

            <div className="bg-[#fff9e6] border border-[#f5e6b3] rounded-lg p-3.5 flex gap-3 items-start">
              <AlertTriangle size={16} className="text-[#b38a00] shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold text-[#806200] uppercase tracking-widest leading-relaxed">
                Sale price is sent ONLY when enabled and within a valid start/end window.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 bg-white shrink-0 flex items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={submit}
            disabled={!canSubmit || createM.isPending}
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-xl transition-all shadow-md disabled:opacity-50 min-w-[180px]"
          >
            {createM.isPending ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Creating...
              </span>
            ) : (
              "Create Product"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}