/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { StatusBadge } from "@/components/cards/status-badge";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  MapPin,
  Mail,
  Phone,
  ArrowLeft,
  Star,
  Wallet,
  ShoppingCart,
  Eye,
  CheckCircle2,
  Save,
  FileText,
  Receipt,
  BadgeDollarSign,
  Package,
} from "lucide-react";

import { InfoRow } from "@/components/buyers/buyers-helper";
import MetricCard from "@/components/cards/metric-card";

import {
  ApproveVendorModal,
  RejectVendorModal,
  SuspendStoreModal,
} from "./actions";
import { KycViewer } from "./kyc_viewer";

import {
  useVendor,
  useUpdateVendor,
  useVendorOrders,
  useVendorKyc,
  useVendorPayouts,
  useVendorReviewSummary,
  useVendorReviews,
} from "@/src/features/vendors/hooks";

import { useVendorProducts } from "@/src/features/products/hooks"; // <- the hook you added for /api/Products/vendor/{userId}
import type { VendorProductListItem } from "@/src/features/products/api";
import type {
  VendorOrderListItem,
  VendorPayout,
  VendorKycDoc,
  VendorReview,
} from "@/src/features/vendors/api";
import { DetailsPageSkeleton } from "@/components/skeletons/details";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function initials(text: string) {
  const parts = String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const a = parts[0]?.[0] ?? "V";
  const b = parts[parts.length - 1]?.[0] ?? "D";
  return (a + b).toUpperCase();
}

function money(amount: number, currency: string) {
  const symbol =
    currency === "NGN"
      ? "₦"
      : currency === "ZAR"
        ? "R"
        : currency === "USD"
          ? "$"
          : "";
  return `${symbol}${Number(amount ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function dateLabel(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

// ─── TAB TRIGGER ─────────────────────────────────────────────────────────────
function TabTriggerItem({
  value,
  label,
  hasPulse = false,
}: {
  value: string;
  label: string;
  hasPulse?: boolean;
}) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 data-[state=active]:bg-zinc-900 data-[state=active]:text-[#D4AF37] transition-all hover:text-zinc-900 data-[state=active]:hover:text-[#D4AF37] flex items-center gap-2"
    >
      {label}
      {hasPulse && (
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
      )}
    </TabsTrigger>
  );
}

// ─── COLUMNS (Vendor Products) ───────────────────────────────────────────────
const vendorProductColumns: ColumnDef<VendorProductListItem>[] = [
  {
    header: "Product",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-zinc-900">{row.original.name}</span>
        <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
          SKU: {row.original.sku || "—"}
        </span>
      </div>
    ),
  },
  {
    header: "Category",
    accessorKey: "categoryName",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-zinc-600">
        {row.original.categoryName || "—"}
      </span>
    ),
  },
  {
    header: "Price",
    accessorKey: "effectivePrice",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-zinc-900">
        {money(
          row.original.effectivePrice ?? row.original.basePrice ?? 0,
          row.original.currency,
        )}
      </span>
    ),
  },
  {
    header: "Stock",
    accessorKey: "stockQuantity",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-zinc-600">
        {Number(row.original.stockQuantity ?? 0).toLocaleString()} units
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <StatusBadge
        status={
          row.original.status || (row.original.isActive ? "Active" : "Inactive")
        }
      />
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Link href={`/admin/products/${row.original.id}`}>
          <button className="p-1.5 border border-zinc-200 hover:bg-zinc-900 hover:text-[#D4AF37] text-zinc-500 transition-colors rounded inline-flex items-center justify-center">
            <Eye size={14} />
          </button>
        </Link>
      </div>
    ),
  },
];

// ─── COLUMNS (Vendor Orders) ────────────────────────────────────────────────
const vendorOrdersColumns: ColumnDef<VendorOrderListItem>[] = [
  {
    header: "Order",
    accessorKey: "orderNumber",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-zinc-900">
        {row.original.orderNumber ?? row.original.orderId ?? "—"}
      </span>
    ),
  },
  {
    header: "Customer",
    accessorKey: "customerName",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-zinc-700">
        {row.original.customerName ?? "—"}
      </span>
    ),
  },
  {
    header: "Product",
    accessorKey: "productName",
    cell: ({ row }) => (
      <span className="text-xs text-zinc-600">
        {row.original.productName ?? "—"}
      </span>
    ),
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-zinc-900">
        {money(
          Number(row.original.amount ?? 0),
          String(row.original.currency ?? "NGN"),
        )}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <StatusBadge status={String(row.original.status ?? "—")} />
    ),
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-zinc-500">
        {dateLabel(row.original.date)}
      </span>
    ),
  },
];

// ─── COLUMNS (Vendor Payouts) ───────────────────────────────────────────────
const vendorPayoutColumns: ColumnDef<VendorPayout>[] = [
  {
    header: "Payout ID",
    accessorKey: "payoutId",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-bold text-zinc-900">
        {row.original.payoutId}
      </span>
    ),
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-zinc-900">
        {money(row.original.amount, row.original.currency)}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-zinc-500">
        {dateLabel(row.original.date)}
      </span>
    ),
  },
];

// ─── COLUMNS (Vendor Reviews) ───────────────────────────────────────────────
const vendorReviewColumns: ColumnDef<VendorReview>[] = [
  {
    header: "Reviewer",
    accessorKey: "reviewerName",
    cell: ({ row }) => (
      <span className="text-xs font-bold text-zinc-900">
        {row.original.reviewerName || "—"}
      </span>
    ),
  },
  {
    header: "Rating",
    accessorKey: "rating",
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-2 text-xs font-bold text-zinc-900">
        <Star size={14} className="text-[#D4AF37] fill-[#D4AF37]" />
        {Number(row.original.rating ?? 0).toFixed(1)}
      </span>
    ),
  },
  {
    header: "Item",
    accessorKey: "itemDetails",
    cell: ({ row }) => (
      <span className="text-xs text-zinc-600">
        {row.original.itemDetails || "—"}
      </span>
    ),
  },
  {
    header: "Comment",
    accessorKey: "comment",
    cell: ({ row }) => (
      <span className="text-xs text-zinc-600 line-clamp-1 max-w-105">
        {row.original.comment || "—"}
      </span>
    ),
  },
  {
    header: "Date",
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-zinc-500">
        {dateLabel(row.original.createdAt)}
      </span>
    ),
  },
];

export default function VendorDetailsView() {
  const params = useParams();

  const vendorId =
    typeof (params as any)?.id === "string"
      ? decodeURIComponent((params as any).id)
      : decodeURIComponent(((params as any)?.id?.[0] as string) ?? "");

  // ---- Hooks (must be called unconditionally) ----
  const vendorQ = useVendor(vendorId);
  const vendor = vendorQ.data;

  const updateVendorM = useUpdateVendor();

  // Sub-resources
  const ordersQ = useVendorOrders(vendorId, {
    currency: "NGN",
    pageNumber: 1,
    pageSize: 20,
  });
  const kycQ = useVendorKyc(vendorId);
  const payoutsQ = useVendorPayouts(vendorId, {
    currency: "NGN",
    pageNumber: 1,
    pageSize: 20,
  });
  const reviewSummaryQ = useVendorReviewSummary(vendorId);
  const reviewsQ = useVendorReviews(vendorId, { pageNumber: 1, pageSize: 20 });

  // Products-by-vendor is keyed by USER ID (backend design)
  const vendorUserId = vendor?.userId;
  const vendorProductsQ = useVendorProducts(vendorUserId, {
    pageIndex: 1,
    pageSize: 20,
  });

  // Settings form state (controlled)
  const [shopName, setShopName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessRegNo, setBusinessRegNo] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeCity, setStoreCity] = useState("");
  const [storeState, setStoreState] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!vendor) return;
    setShopName(vendor.shopName ?? "");
    setCompanyName(vendor.companyName ?? "");
    setBusinessRegNo(vendor.businessRegistrationNumber ?? "");
    setStoreAddress(vendor.storeAddress ?? "");
    setStoreCity(vendor.storeCity ?? "");
    setStoreState(vendor.storeState ?? "");
    setLogoUrl(vendor.logoUrl ?? "");
    setBannerUrl(vendor.bannerUrl ?? "");
    setDescription(vendor.description ?? "");
  }, [
    vendor?.shopName,
    vendor?.companyName,
    vendor?.businessRegistrationNumber,
    vendor?.storeAddress,
    vendor?.storeCity,
    vendor?.storeState,
    vendor?.logoUrl,
    vendor?.bannerUrl,
    vendor?.description,
  ]);

  // ---- Conditional UI after hooks ----
  if (!vendorId) {
    return (
      <div className="min-h-screen bg-zinc-50 p-10 text-sm text-rose-600">
        Missing vendor id in route.
      </div>
    );
  }

  if (vendorQ.isLoading) {
    return <DetailsPageSkeleton />;
  }

  if (vendorQ.isError || !vendor) {
    return (
      <div className="min-h-screen bg-zinc-50 p-10">
        <div className="max-w-xl bg-white border border-zinc-200 rounded-xl p-6">
          <p className="text-sm text-rose-600 font-semibold">
            Vendor not found or failed to load.
          </p>
          <Link
            href="/admin/vendors"
            className="text-xs underline text-zinc-700 mt-3 inline-block"
          >
            Back to Vendors
          </Link>
        </div>
      </div>
    );
  }

  const isPending =
    vendor.verificationStatus === "NotVerified" && !vendor.verifiedAt;

  // Map verification -> a simple badge label
  const statusLabel =
    vendor.verificationStatus === "Verified" ? "Active" : "Pending";

  const locationLabel =
    [vendor.storeAddress, vendor.storeCity, vendor.storeState]
      .filter(Boolean)
      .join(", ") || "—";

  const kycDocs: VendorKycDoc[] = kycQ.data ?? [];
  const verifiedKycCount = kycDocs.filter(
    (d) => String(d.status).toLowerCase() === "verified",
  ).length;

  const reviewSummary = reviewSummaryQ.data;
  const avgRating = reviewSummary?.averageRating ?? vendor.averageRating ?? 0;
  const totalReviews =
    reviewSummary?.totalReviews ?? vendor.totalReviewsCount ?? 0;

  const walletCurrency = vendor.currency ?? "NGN";
  const walletBalance = vendor.walletBalance ?? 0;

  const productTotal =
    vendorProductsQ.data?.totalCount ?? vendor.totalProductsCount ?? 0;

  const isDirty =
    shopName.trim() !== (vendor.shopName ?? "").trim() ||
    companyName.trim() !== (vendor.companyName ?? "").trim() ||
    businessRegNo.trim() !== (vendor.businessRegistrationNumber ?? "").trim() ||
    storeAddress.trim() !== (vendor.storeAddress ?? "").trim() ||
    storeCity.trim() !== (vendor.storeCity ?? "").trim() ||
    storeState.trim() !== (vendor.storeState ?? "").trim() ||
    logoUrl.trim() !== (vendor.logoUrl ?? "").trim() ||
    bannerUrl.trim() !== (vendor.bannerUrl ?? "").trim() ||
    description.trim() !== (vendor.description ?? "").trim();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Link
              href="/admin/vendors"
              className="hover:text-zinc-900 transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} /> VENDORS
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-mono">{vendor.shopName}</span>
            <StatusBadge status={statusLabel} />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2">
          {isPending ? (
            <>
              <RejectVendorModal vendorId={vendor.id} name={vendor.shopName} />
              <ApproveVendorModal vendorId={vendor.id} name={vendor.shopName} />
            </>
          ) : (
            <SuspendStoreModal vendorId={vendor.id} name={vendor.shopName} />
          )}
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-8 mt-2">
        {/* TOP: PROFILE + METRICS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Identity */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-200 via-zinc-300 to-zinc-200" />

            <div className="flex items-start gap-5">
              <div className="h-20 w-20 rounded-2xl bg-zinc-900 flex items-center justify-center text-2xl font-bold text-[#D4AF37] shrink-0 shadow-sm border border-zinc-800">
                {initials(vendor.shopName)}
              </div>

              <div>
                <h2 className="text-xl font-bold text-zinc-900 font-display leading-tight">
                  {vendor.shopName}
                </h2>
                <p className="text-xs text-zinc-500 mt-1 mb-2 font-mono">
                  Owner: {vendor.ownerName}
                </p>
                <StatusBadge status={statusLabel} />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-100 space-y-3">
              <InfoRow
                icon={Mail}
                label="Email"
                value={vendor.ownerEmail || "—"}
              />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={(vendor as any)?.phone ?? "—"}
              />
              <InfoRow icon={MapPin} label="Location" value={locationLabel} />

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Vendor ID
                </span>
                <span className="text-xs font-mono font-bold text-zinc-900 uppercase bg-zinc-100 px-2 py-0.5 rounded-md">
                  {vendor.id.split("-")[0]}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Verification
                </span>
                <span
                  className={[
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 border",
                    vendor.verificationStatus === "Verified"
                      ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                      : "text-amber-700 bg-amber-50 border-amber-100",
                  ].join(" ")}
                >
                  <CheckCircle2 size={10} />
                  {vendor.verificationStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet */}
          <div className="lg:col-span-4 bg-zinc-900 text-white border border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
            <Wallet className="absolute -right-6 -bottom-6 w-36 h-36 text-zinc-800/50 rotate-12" />
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-800 via-[#D4AF37] to-zinc-800" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-[#D4AF37]">
                <Wallet size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Wallet Balance
                </span>
              </div>

              <p className="text-3xl font-bold font-mono tracking-tight text-white mb-1">
                {money(walletBalance, walletCurrency)}
              </p>

              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                Available Balance
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="lg:col-span-4 flex flex-col gap-3 h-full">
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                  Store Rating
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-zinc-900">
                    {Number(avgRating).toFixed(1)}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    / 5.0
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {Number(totalReviews).toLocaleString()} review(s)
                </p>
              </div>
              <Star className="text-[#D4AF37] fill-[#D4AF37]" size={28} />
            </div>

            <MetricCard
              label="Product Limit"
              value={String(vendor.productLimit ?? 0)}
              icon={Package}
              variant="gold"
            />
            <MetricCard
              label="Total Products"
              value={String(productTotal)}
              icon={ShoppingCart}
              variant="emerald"
            />
          </div>
        </div>

        {/* TABS */}
        <div className="space-y-6">
          <Tabs
            defaultValue={isPending ? "kyc" : "products"}
            className="w-full flex flex-col"
          >
            <div className="flex justify-center mb-8">
              <TabsList className="bg-zinc-200/50 p-1 h-12 rounded-full inline-flex gap-1 overflow-x-auto whitespace-nowrap">
                <TabTriggerItem value="products" label="Products" />
                <TabTriggerItem value="orders" label="Orders" />
                <TabTriggerItem value="kyc" label="KYC" hasPulse={isPending} />
                <TabTriggerItem value="payouts" label="Payouts" />
                <TabTriggerItem value="reviews" label="Reviews" />
                <TabTriggerItem value="settings" label="Settings" />
              </TabsList>
            </div>

            {/* PRODUCTS */}
            <TabsContent
              value="products"
              className="m-0 animate-in fade-in duration-500"
            >
             

                {vendorProductsQ.isLoading ? (
                  <div className="p-6 text-sm text-zinc-500">
                    Loading products…
                  </div>
                ) : vendorProductsQ.isError ? (
                  <div className="p-6 text-sm text-rose-600">
                    Failed to load vendor products.
                  </div>
                ) : (
                  <DataTable
                    columns={vendorProductColumns}
                    data={vendorProductsQ.data?.items ?? []}
                  />
                )}
             
            </TabsContent>

            {/* ORDERS */}
            <TabsContent
              value="orders"
              className="m-0 animate-in fade-in duration-500"
            >
             
                {ordersQ.isLoading ? (
                  <div className="p-6 text-sm text-zinc-500">
                    Loading orders…
                  </div>
                ) : ordersQ.isError ? (
                  <div className="p-6 text-sm text-rose-600">
                    Failed to load orders.
                  </div>
                ) : (
                  <DataTable
                    columns={vendorOrdersColumns}
                    data={ordersQ.data?.items ?? []}
                  />
                )}
         
            </TabsContent>

            {/* KYC */}
            <TabsContent
              value="kyc"
              className="m-0 animate-in fade-in duration-500"
            >
             

                <div className="p-6">
                  {kycQ.isLoading ? (
                    <div className="text-sm text-zinc-500">Loading KYC…</div>
                  ) : kycQ.isError ? (
                    <div className="text-sm text-rose-600">
                      Failed to load KYC.
                    </div>
                  ) : (
                    <KycViewer documents={kycDocs} />
                  )}
                </div>
             
            </TabsContent>

            {/* PAYOUTS */}
            <TabsContent
              value="payouts"
              className="m-0 animate-in fade-in duration-500"
            >
              
                {payoutsQ.isLoading ? (
                  <div className="p-6 text-sm text-zinc-500">
                    Loading payouts…
                  </div>
                ) : payoutsQ.isError ? (
                  <div className="p-6 text-sm text-rose-600">
                    Failed to load payouts.
                  </div>
                ) : (
                  <DataTable
                    columns={vendorPayoutColumns}
                    data={payoutsQ.data?.items ?? []}
                  />
                )}
         
            </TabsContent>

            {/* REVIEWS */}
            <TabsContent
              value="reviews"
              className="m-0 animate-in fade-in duration-500"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600">
                    <FileText size={14} /> Review Summary
                  </div>

                  {reviewSummaryQ.isLoading ? (
                    <div className="mt-4 text-sm text-zinc-500">
                      Loading summary…
                    </div>
                  ) : reviewSummaryQ.isError ? (
                    <div className="mt-4 text-sm text-rose-600">
                      Failed to load summary.
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500">
                          Average rating
                        </span>
                        <span className="font-mono font-bold text-zinc-900">
                          {Number(avgRating).toFixed(1)} / 5.0
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500">
                          Total reviews
                        </span>
                        <span className="font-mono font-bold text-zinc-900">
                          {Number(totalReviews).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-8">
                  {reviewsQ.isLoading ? (
                    <div className="p-6 text-sm text-zinc-500">
                      Loading reviews…
                    </div>
                  ) : reviewsQ.isError ? (
                    <div className="p-6 text-sm text-rose-600">
                      Failed to load reviews.
                    </div>
                  ) : (
                    <DataTable
                      columns={vendorReviewColumns}
                      data={reviewsQ.data?.items ?? []}
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            {/* SETTINGS */}
            <TabsContent value="settings" className="m-0">
              <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-lg font-bold text-[#D4AF37]">
                      {initials(shopName)}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-zinc-900">
                        Vendor Settings
                      </h3>

                      <p className="text-sm text-zinc-500">
                        Update store information, branding, and business
                        details.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* BUSINESS INFORMATION */}
                  <div>
                    <div className="mb-5">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                        Business Information
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          Store Name
                        </Label>

                        <Input
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          className="h-11 bg-zinc-50 border-zinc-200 rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          Company Name
                        </Label>

                        <Input
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="h-11 bg-zinc-50 border-zinc-200 rounded-xl"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          Business Registration Number
                        </Label>

                        <Input
                          value={businessRegNo}
                          onChange={(e) => setBusinessRegNo(e.target.value)}
                          className="h-11 bg-zinc-50 border-zinc-200 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* STORE LOCATION */}
                  <div>
                    <div className="mb-5">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                        Store Location
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          Store Address
                        </Label>

                        <Input
                          value={storeAddress}
                          onChange={(e) => setStoreAddress(e.target.value)}
                          className="h-11 bg-zinc-50 border-zinc-200 rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          City
                        </Label>

                        <Input
                          value={storeCity}
                          onChange={(e) => setStoreCity(e.target.value)}
                          className="h-11 bg-zinc-50 border-zinc-200 rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          State
                        </Label>

                        <Input
                          value={storeState}
                          onChange={(e) => setStoreState(e.target.value)}
                          className="h-11 bg-zinc-50 border-zinc-200 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* BRANDING */}
                  <div>
                    <div className="mb-5">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                        Branding
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          Logo URL
                        </Label>

                        <Input
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          className="h-11 bg-zinc-50 border-zinc-200 rounded-xl font-mono"
                          placeholder="https://..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          Banner URL
                        </Label>

                        <Input
                          value={bannerUrl}
                          onChange={(e) => setBannerUrl(e.target.value)}
                          className="h-11 bg-zinc-50 border-zinc-200 rounded-xl font-mono"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <div className="mb-5">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                        Store Description
                      </h4>
                    </div>

                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-32 bg-zinc-50 border-zinc-200 rounded-xl resize-none"
                      placeholder="Enter a description about this store..."
                    />
                  </div>

                  {/* FOOTER */}
                  <div className="border-t border-zinc-100 pt-6 flex items-center justify-end">
                    <Button
                      disabled={!isDirty || updateVendorM.isPending}
                      className="h-11 px-8 bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-xl font-bold uppercase tracking-widest"
                      onClick={() => {
                        updateVendorM.mutate({
                          vendorId: vendor.userId,
                          payload: {
                            shopName: shopName.trim() || undefined,
                            companyName: companyName.trim() || undefined,
                            businessRegistrationNumber:
                              businessRegNo.trim() || undefined,
                            storeAddress: storeAddress.trim() || undefined,
                            storeCity: storeCity.trim() || undefined,
                            storeState: storeState.trim() || undefined,
                            logoUrl: logoUrl.trim() ? logoUrl.trim() : null,
                            bannerUrl: bannerUrl.trim()
                              ? bannerUrl.trim()
                              : null,
                            description: description.trim()
                              ? description.trim()
                              : null,
                          },
                        });
                      }}
                    >
                      <Save className="mr-2 h-4 w-4" />

                      {updateVendorM.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
