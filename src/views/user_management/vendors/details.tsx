/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { StatusBadge } from "@/components/cards/status-badge";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Mail,
  Phone,
  ArrowLeft,
  Star,
  Wallet,
  ShoppingCart,
  Calendar
} from "lucide-react";
import { VENDORS, VENDOR_PRODUCTS } from "@/src/lib/dummy_data";
import { ColumnDef } from "@tanstack/react-table";
import {
  ApproveVendorModal,
  RejectVendorModal,
  SuspendStoreModal,
} from "./actions";
import { KycViewer } from "./kyc_viewer";
import { InfoRow } from "@/components/buyers/buyers-helper";
import { TabItem } from "@/components/tabs/tab-item";
import MetricCard from "@/components/cards/metric-card";

const productColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => (
      <span className="font-bold text-zinc-900">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <span className="font-mono text-zinc-600">{row.original.price}</span>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-zinc-500">
        {row.original.stock} Units
      </span>
    ),
  },
  {
    accessorKey: "sales",
    header: "Total Sales",
    cell: ({ row }) => (
      <span className="font-mono text-zinc-900 font-bold">
        {row.original.sales}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

export default function VendorDetailsView() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const vendor = VENDORS.find((v) => v.id === decodeURIComponent(id || ""));

  if (!vendor) return notFound();

  const isPending = vendor.status === "Pending";

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* ─── HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <div className="flex items-center gap-2 text-sm font-mono text-zinc-400">
            <Link
              href="/admin/vendors"
              className="hover:text-zinc-900 transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} /> VENDORS
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-bold">{vendor.storeName}</span>
          </div>
        </div>

        {/* ─── CONDITIONAL ACTIONS ─── */}
        <div className="flex gap-2">
          {isPending ? (
            <>
              <RejectVendorModal name={vendor.storeName} />
              <ApproveVendorModal name={vendor.storeName} />
            </>
          ) : (
            <SuspendStoreModal name={vendor.storeName} />
          )}
        </div>
      </header>

      <main className="p-6 max-w-400 mx-auto space-y-8">
        {/* ─── TOP SECTION: PROFILE ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 1. Store Identity */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-lg p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-start gap-5">
              <div className="h-20 w-20 rounded-lg bg-zinc-900 flex items-center justify-center text-2xl font-bold text-sax-gold border border-zinc-800 shrink-0 shadow-sm">
                {vendor.logo}
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 font-display">
                  {vendor.storeName}
                </h2>
                <p className="text-xs text-zinc-500 mt-1 mb-2">
                  Owner: {vendor.ownerName}
                </p>
                <StatusBadge status={vendor.status} />
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-100 space-y-3">
              <InfoRow icon={Mail} label="Email" value={vendor.email} />
              <InfoRow icon={Phone} label="Phone" value={vendor.phone} />
              <InfoRow icon={MapPin} label="HQ" value={vendor.location} />
            </div>
          </div>

          {/* 2. Performance Card */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-lg p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Store Rating
                </h3>
                <Star className="text-sax-gold fill-sax-gold" size={18} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-mono">
                  {vendor.rating}
                </span>
                <span className="text-xs text-zinc-400">/ 5.0</span>
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                Based on customer reviews
              </p>
            </div>

            {/* Conditional: Show KYC Status if pending */}
            {isPending ? (
              <div className="bg-amber-50 rounded p-3 flex justify-between items-center border border-amber-100 text-amber-700">
                <span className="text-xs font-bold">KYC Status</span>
                <span className="text-xs font-mono">In Review</span>
              </div>
            ) : (
              <div className="bg-zinc-50 rounded p-3 flex justify-between items-center border border-zinc-100">
                <span className="text-xs font-medium text-zinc-600">
                  Product Quality
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  Good Standing
                </span>
              </div>
            )}
          </div>

          {/* 3. Metrics Stack */}
          <div className="lg:col-span-4 flex flex-col gap-3 h-full">
            <MetricCard
              label="Total Revenue"
              value={vendor.totalSales}
              icon={Wallet}
              variant="gold"
            />
            <MetricCard
              label="Active Products"
              value={String(vendor.products)}
              icon={ShoppingCart}
              variant="emerald"
            />
            <MetricCard
              label="Joined Date"
              value={vendor.joinedDate}
              icon={Calendar}
              variant="indigo"
            />
          </div>
        </div>

        {/* ─── TABS: DATA & KYC ─── */}
        <div className="space-y-6">
          {/* Default to 'kyc' if pending, otherwise 'products' */}
          <Tabs
            defaultValue={isPending ? "kyc" : "products"}
            className="w-full flex flex-col"
          >
            <div className="border-b border-zinc-200 mb-6">
              <TabsList className="bg-transparent p-0 h-12 justify-start w-full">
                <TabItem value="products" label="Products" />

                <TabsTrigger
                  value="kyc"
                  className="rounded-none border-b-2 border-transparent px-6 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 data-[state=active]:border-sax-gold data-[state=active]:text-zinc-900 data-[state=active]:bg-transparent transition-all hover:text-zinc-600 flex items-center gap-2"
                >
                  KYC Documents
                  {isPending && (
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </TabsTrigger>

                <TabItem value="payouts" label="Payout History" />
              </TabsList>
            </div>

            {/* TAB 1: PRODUCTS TABLE */}
            <TabsContent value="products">
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-0">
                  <DataTable columns={productColumns} data={VENDOR_PRODUCTS} />
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: KYC VIEWER */}
            <TabsContent value="kyc">
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Submitted Documents
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {vendor.documents?.filter((d) => d.status === "Verified")
                      .length || 0}{" "}
                    / {vendor.documents?.length || 0} Verified
                  </span>
                </div>

                <KycViewer documents={vendor.documents} />
              </div>
            </TabsContent>

            {/* TAB 3: PAYOUTS (Dummy) */}
            <TabsContent value="payouts">
              <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center shadow-sm">
                <p className="text-zinc-400 font-mono text-sm">
                  No payout history available.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
