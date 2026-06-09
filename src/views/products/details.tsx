/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { SidebarTrigger } from "@/components/ui/sidebar";
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

import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  UploadCloud,
  Store,
  PackageSearch,
  Plus,
  CheckCircle2,
  Flag,
  XCircle,
  Trash2,
} from "lucide-react";

import { StatusBadge } from "@/components/cards/status-badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useProduct, useUpdateProduct, useDeleteProduct } from "@/src/features/products/hooks";
import type { UpdateProductInput } from "@/src/features/products/api";

import {
  ApproveProductDialog,
  RejectProductDialog,
  FlagProductDialog,
} from "./dialogs";
import { DetailsPageSkeleton } from "@/components/skeletons/details";

function fmtMoney(n: number | null | undefined) {
  if (n === null || n === undefined) return "—";
  return `₦${Number(n).toLocaleString()}`;
}

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

// input[type="datetime-local"] expects: YYYY-MM-DDTHH:mm
function toDateTimeLocal(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function fromDateTimeLocal(v: string) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

function DetailRow({ label, value }: { label: string; value: any }) {
  const text =
    value === null || value === undefined || value === "" ? "—" : String(value);

  return (
    <div className="flex items-start justify-between gap-6 py-2 border-b border-zinc-100 last:border-b-0">
      <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        {label}
      </div>
      <div className="text-xs font-mono text-zinc-900 text-right break-all max-w-[70%]">
        {text}
      </div>
    </div>
  );
}

export default function ProductDetailsView() {
  // ✅ All hooks must run every render (no early returns before these)
  const router = useRouter();
  const params = useParams();

  const rawId = (params as any)?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const { data: product, isLoading, isError } = useProduct(id);
  const update = useUpdateProduct();
  const del = useDeleteProduct();

  // moderation dialogs
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [openFlag, setOpenFlag] = useState(false);

  // delete confirm dialog
  const [openDelete, setOpenDelete] = useState(false);

  // PUT payload state (matches swagger schema)
  const [edit, setEdit] = useState<UpdateProductInput>({
    name: "",
    description: "",
    categoryId: 0,
    brandId: 0,
    basePrice: 0,
    salePrice: 0,
    salePriceStartDate: "",
    salePriceEndDate: "",
    sku: "",
  });

  // ✅ Hydrate edit state once product is available (guard inside effect)
  useEffect(() => {
    if (!product) return;

    setEdit({
      name: product.name ?? "",
      description: product.description ?? "",
      categoryId: product.categoryId ?? 0,
      brandId: product.brandId ?? 0,
      basePrice: Number(product.basePrice ?? 0),
      salePrice: Number(product.salePrice ?? 0),
      salePriceStartDate: product.salePriceStartDate ?? "",
      salePriceEndDate: product.salePriceEndDate ?? "",
      sku: product.sku ?? "",
    });
  }, [product?.id]); // re-hydrate when navigating to another product id

  // ---- Now safe to early return UI states ----
  if (!id) {
    return (
      <div className="min-h-screen bg-zinc-50 p-10 text-sm text-rose-600">
        Missing product id.
      </div>
    );
  }

  if (isLoading) {
    return (
      <DetailsPageSkeleton/>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center text-center p-6">
        <PackageSearch className="h-16 w-16 text-zinc-300 mb-4" />
        <h1 className="text-xl font-bold text-zinc-900 font-display uppercase tracking-widest mb-2">
          Product Not Found
        </h1>
        <p className="text-sm text-zinc-500 mb-6">
          The product with ID "{String(id)}" does not exist or failed to load.
        </p>
        <Button
          asChild
          className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest h-11 px-8 rounded-xl transition-all"
        >
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Link>
        </Button>
      </div>
    );
  }

  // ---- product is defined below ----
  const primaryImageUrl =
    product.images?.find((x) => x.isPrimary)?.imageUrl ??
    product.images?.[0]?.imageUrl ??
    null;

  const stockStatus = product.stockQuantity > 0 ? "in-stock" : "out-of-stock";

  const isActive = product.status === "Active";
  const isPending = product.status === "Pending";
  const isRejected = product.status === "Rejected";

  const onSave = () => {
    update.mutate({ productId: product.id, payload: edit });
  };

  const onDelete = () => {
    del.mutate(product.id, {
      onSuccess: () => {
        setOpenDelete(false);
        router.push("/admin/products");
      },
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-16">
      {/* ─── HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Link
              href="/admin/products"
              className="hover:text-zinc-900 transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} /> PRODUCTS
            </Link>
            <span>/</span>
            {/* <span className="text-zinc-900 font-mono">#{product.id}</span> */}
            <StatusBadge status={product.status} />
          </div>
        </div>

        {/* Actions: moderation + CRUD */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg border-zinc-200"
            disabled={isPending}
            onClick={() => setOpenFlag(true)}
          >
            <Flag className="mr-2 h-3.5 w-3.5" /> Flag
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg border-zinc-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
            disabled={isRejected}
            onClick={() => setOpenReject(true)}
          >
            <XCircle className="mr-2 h-3.5 w-3.5" /> Reject
          </Button>

          <Button
            variant="gold"
            size="sm"
            className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg"
            disabled={isActive}
            onClick={() => setOpenApprove(true)}
          >
            <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Approve
          </Button>

          <div className="w-px h-6 bg-zinc-200 mx-1" />

          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg border-zinc-200 hover:bg-zinc-50"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg border-zinc-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
            onClick={() => setOpenDelete(true)}
            disabled={del.isPending}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            {del.isPending ? "Deleting..." : "Delete"}
          </Button>

          <Button
            size="sm"
            onClick={onSave}
            disabled={update.isPending}
            className="h-9 text-xs font-bold uppercase tracking-wider bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all rounded-lg shadow-sm"
          >
            <Save className="mr-2 h-3.5 w-3.5" />
            {update.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Moderation dialogs */}
        <ApproveProductDialog
          open={openApprove}
          onOpenChange={setOpenApprove}
          productId={product.id}
          name={product.name}
        />
        <FlagProductDialog
          open={openFlag}
          onOpenChange={setOpenFlag}
          productId={product.id}
          name={product.name}
        />
        <RejectProductDialog
          open={openReject}
          onOpenChange={setOpenReject}
          productId={product.id}
          name={product.name}
        />

        {/* Delete confirm */}
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogContent className="bg-white border-zinc-200">
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                This will soft-delete <strong>{product.name}</strong>. Proceed?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDelete(false)} disabled={del.isPending}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={onDelete} disabled={del.isPending}>
                {del.isPending ? "Deleting..." : "Confirm Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <main className="p-6 max-w-6xl mx-auto mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ─── LEFT COLUMN ─── */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. General Information */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                  General Information
                </h2>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Product Name <span className="text-[#D4AF37]">*</span>
                  </Label>
                  <Input
                    value={edit.name}
                    onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))}
                    className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-medium focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Description
                  </Label>
                  <Textarea
                    value={edit.description}
                    onChange={(e) => setEdit((s) => ({ ...s, description: e.target.value }))}
                    className="min-h-[120px] bg-zinc-50/50 border-zinc-200 text-sm leading-relaxed focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg resize-none"
                  />
                </div>

                {/* Category + Brand per your API (category list not wired yet) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Category (read-only)
                    </Label>
                    <Input value={product.categoryName} readOnly className="h-11 bg-zinc-50/50 border-zinc-200" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Brand ID
                    </Label>
                    <Input
                      type="number"
                      value={edit.brandId}
                      onChange={(e) => setEdit((s) => ({ ...s, brandId: Number(e.target.value) }))}
                      className="h-11 bg-zinc-50/50 border-zinc-200 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Pricing Details */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                  Pricing Details
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Base Price <span className="text-[#D4AF37]">*</span>
                    </Label>
                    <Input
                      type="number"
                      value={edit.basePrice}
                      onChange={(e) => setEdit((s) => ({ ...s, basePrice: Number(e.target.value) }))}
                      className="h-11 font-mono bg-zinc-50/50 border-zinc-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Sale Price
                    </Label>
                    <Input
                      type="number"
                      value={edit.salePrice}
                      onChange={(e) => setEdit((s) => ({ ...s, salePrice: Number(e.target.value) }))}
                      className="h-11 font-mono bg-zinc-50/50 border-zinc-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-100">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Sale Start Date
                    </Label>
                    <Input
                      type="datetime-local"
                      value={toDateTimeLocal(edit.salePriceStartDate)}
                      onChange={(e) =>
                        setEdit((s) => ({ ...s, salePriceStartDate: fromDateTimeLocal(e.target.value) }))
                      }
                      className="h-11 bg-zinc-50/50 border-zinc-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Sale End Date
                    </Label>
                    <Input
                      type="datetime-local"
                      value={toDateTimeLocal(edit.salePriceEndDate)}
                      onChange={(e) =>
                        setEdit((s) => ({ ...s, salePriceEndDate: fromDateTimeLocal(e.target.value) }))
                      }
                      className="h-11 bg-zinc-50/50 border-zinc-200"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100">
                  <DetailRow label="Effective Price (computed)" value={fmtMoney(product.effectivePrice)} />
                </div>
              </div>
            </div>

            {/* 3. Inventory (API has it, but PUT schema doesn’t → display read-only) */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                  Inventory
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      SKU / Barcode
                    </Label>
                    <Input
                      value={edit.sku}
                      onChange={(e) => setEdit((s) => ({ ...s, sku: e.target.value }))}
                      className="h-11 font-mono text-xs uppercase bg-zinc-50/50 border-zinc-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Stock Quantity (read-only)
                    </Label>
                    <Input value={String(product.stockQuantity)} readOnly className="h-11 font-mono bg-zinc-50/50 border-zinc-200" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-100">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Length (read-only)
                    </Label>
                    <Input value={String(product.dimensionLength)} readOnly className="h-11 font-mono bg-zinc-50/50 border-zinc-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Width (read-only)
                    </Label>
                    <Input value={String(product.dimensionWidth)} readOnly className="h-11 font-mono bg-zinc-50/50 border-zinc-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Height (read-only)
                    </Label>
                    <Input value={String(product.dimensionHeight)} readOnly className="h-11 font-mono bg-zinc-50/50 border-zinc-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* FULL DETAILS */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                  Product (Full Details)
                </h2>
              </div>
              <div className="p-6">
                <DetailRow label="status" value={product.status} />
                <DetailRow label="createdAt" value={fmtDate(product.createdAt)} />
                <DetailRow label="updatedAt" value={fmtDate(product.updatedAt)} />
                <DetailRow label="isActive" value={product.isActive} />
                <DetailRow label="isFeatured" value={product.isFeatured} />
                <DetailRow label="viewCount" value={product.viewCount} />
                <DetailRow label="favoriteCount" value={product.favoriteCount} />
                <DetailRow label="averageRating" value={product.averageRating} />
                <DetailRow label="reviewCount" value={product.reviewCount} />

                <div className="mt-6 space-y-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                      images
                    </div>
                    <pre className="text-xs font-mono bg-zinc-50 border border-zinc-200 rounded-lg p-3 overflow-auto">
                      {JSON.stringify(product.images ?? [], null, 2)}
                    </pre>
                  </div>
                  <div>
  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
    Variations
  </div>

  {!product.variations || product.variations.length === 0 ? (
    <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
      No variations available.
    </div>
  ) : (
    <div className="space-y-4">
      {product.variations.map((variation) => (
        <div
          key={variation.id}
          className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                SKU
              </p>
              <p className="font-mono text-sm">{variation.sku}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs uppercase text-zinc-400">Price</p>
                <p className="font-semibold">
                  ₦{variation.price.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-zinc-400">
                  Effective Price
                </p>
                <p className="font-semibold">
                  ₦{variation.effectivePrice.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-zinc-400">Stock</p>
                <p>{variation.stockQuantity}</p>
              </div>

              <div>
                <p className="text-xs uppercase text-zinc-400">Status</p>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    variation.isInStock
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {variation.isInStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>

          {variation.attributes &&
            Object.keys(variation.attributes).length > 0 && (
              <div className="mt-4 border-t border-zinc-200 pt-4 flex flex-wrap gap-2">
                {Object.entries(variation.attributes).map(([key, value]) => (
                  <span
                    key={key}
                    className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-medium"
                  >
                    <strong>{key}:</strong> {String(value)}
                  </span>
                ))}
              </div>
            )}

          {(variation.salePrice ||
            variation.salePriceStartDate ||
            variation.salePriceEndDate) && (
            <div className="mt-4 border-t border-zinc-200 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs uppercase text-zinc-400">
                  Sale Price
                </p>
                <p>
                  {variation.salePrice
                    ? `₦${variation.salePrice.toLocaleString()}`
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-zinc-400">
                  Sale Starts
                </p>
                <p>{variation.salePriceStartDate ?? "—"}</p>
              </div>

              <div>
                <p className="text-xs uppercase text-zinc-400">
                  Sale Ends
                </p>
                <p>{variation.salePriceEndDate ?? "—"}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Vendor */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
                Vendor Information
              </h3>
              <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="h-10 w-10 bg-zinc-900 rounded-lg flex items-center justify-center text-[#D4AF37] shadow-sm">
                  <Store size={18} />
                </div>
                <div>
                  <span className="font-bold text-sm text-zinc-900 block font-display">
                    {product.vendorName}
                  </span>
                  <Link
                    href={`/admin/vendors/${product.vendorId}`}
                    className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:underline"
                  >
                    View Store Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Marketplace Visibility
              </h2>

              <div className="space-y-1.5">
                <Select defaultValue={product.status} disabled>
                  <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-bold rounded-lg">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>

                {isRejected ? (
                  <p className="text-[10px] text-rose-600 mt-2 leading-relaxed font-semibold">
                    Rejection reason is available on the admin list endpoint.
                  </p>
                ) : (
                  <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">
                    Use the Approve / Flag / Reject buttons in the header to moderate this listing.
                  </p>
                )}
              </div>
            </div>

            {/* Media */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                  Product Media
                </h2>
              </div>

              <div className="p-5 space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Featured Image
                  </Label>

                  <div className="relative aspect-square w-full border border-zinc-200 rounded-xl overflow-hidden group bg-zinc-100 flex items-center justify-center">
                    {primaryImageUrl ? (
                      <>
                        <Image src={primaryImageUrl} alt={product.name} fill className="object-cover object-center" />
                        <div className="absolute inset-0 bg-zinc-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <Button
                            variant="outline"
                            className="bg-transparent border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-9"
                          >
                            Replace Image
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center">
                        <ImageIcon className="h-10 w-10 text-zinc-300 mb-2" />
                        <span className="text-xs font-bold text-zinc-400">No Image</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-5 border-t border-zinc-100">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 block">
                    Product Gallery
                  </Label>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-200 flex items-center justify-center cursor-pointer hover:bg-zinc-100 hover:border-[#D4AF37] transition-all group">
                      <UploadCloud className="h-5 w-5 text-zinc-400 group-hover:text-[#D4AF37]" />
                    </div>

                    {(product.images ?? []).slice(0, 2).map((img) => (
                      <div
                        key={img.id}
                        className="relative aspect-square bg-zinc-100 rounded-lg border border-zinc-200 overflow-hidden"
                      >
                        <Image src={img.imageUrl} alt="Product image" fill className="object-cover" />
                      </div>
                    ))}

                    {(!product.images || product.images.length === 0) && (
                      <>
                        <div className="aspect-square bg-zinc-100 rounded-lg border border-zinc-200 flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-zinc-300" />
                        </div>
                        <div className="aspect-square bg-zinc-100 rounded-lg border border-zinc-200 flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-zinc-300" />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-5 border-t border-zinc-100">
                  <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">
                    Stock Status (read-only)
                  </Label>
                  <Input value={stockStatus} readOnly className="h-11 font-mono bg-zinc-50/50 border-zinc-200" />
                </div>
              </div>
            </div>

            {/* Engagement */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
                Engagement
              </h3>
              <DetailRow label="views" value={product.viewCount} />
              <DetailRow label="favorites" value={product.favoriteCount} />
              <DetailRow label="avg rating" value={product.averageRating} />
              <DetailRow label="reviews" value={product.reviewCount} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}