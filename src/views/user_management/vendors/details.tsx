/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { StatusBadge } from "@/components/cards/status-badge";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import MetricCard from "@/components/cards/metric-card";

// ─── HELPER FOR BLACK & GOLD TAB STYLING ───
function TabTriggerItem({ value, label, hasPulse = false }: { value: string; label: string; hasPulse?: boolean }) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 data-[state=active]:bg-zinc-900 data-[state=active]:text-[#D4AF37] transition-all hover:text-zinc-900 data-[state=active]:hover:text-[#D4AF37] flex items-center gap-2"
    >
      {label}
      {hasPulse && <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />}
    </TabsTrigger>
  );
}

// ─── PRODUCT COLUMNS WITH NEW "ACTION" COLUMN ───
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
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => (
      <div className="text-right">
        {/* Links to product details page */}
        <Link href={`/admin/products/${row.original.id}`}>
          <button className="p-1.5 border border-zinc-200 hover:bg-zinc-900 hover:text-[#D4AF37] text-zinc-500 transition-colors rounded inline-flex items-center justify-center">
            <Eye size={14} />
          </button>
        </Link>
      </div>
    ),
  },
];

// Mock Transactions for Payouts Tab
const MOCK_TRANSACTIONS = [
  {
    id: 1,
    type: "Wallet Debit",
    date: "2 days ago",
    amount: "-$5.00",
    isNegative: true,
  },
  {
    id: 2,
    type: "Wallet Topup",
    date: "2 days ago",
    amount: "+$50.00",
    isNegative: false,
  },
  {
    id: 3,
    type: "Wallet Topup",
    date: "2 days ago",
    amount: "+₦50,000.00",
    isNegative: false,
  },
];

export default function VendorDetailsView() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const vendor = VENDORS.find((v) => v.id === decodeURIComponent(id || ""));

  if (!vendor) return notFound();

  const isPending = vendor.status === "Pending";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-10">
      {/* ─── HEADER ─── */}
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
            <span className="text-zinc-900 font-mono">{vendor.storeName}</span>
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

      <main className="p-6 max-w-7xl mx-auto space-y-8 mt-2">
        
        {/* ─── TOP SECTION: PROFILE & METRICS ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 1. Store Identity & Account Info */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
            <div className="flex items-start gap-5">
              <div className="h-20 w-20 rounded-2xl bg-zinc-900 flex items-center justify-center text-2xl font-bold text-[#D4AF37] shrink-0 shadow-sm border border-zinc-800">
                {vendor.logo}
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 font-display leading-tight">
                  {vendor.storeName}
                </h2>
                <p className="text-xs text-zinc-500 mt-1 mb-2 font-mono">
                  Owner: {vendor.ownerName}
                </p>
                <StatusBadge status={vendor.status} />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-100 space-y-3">
              <InfoRow icon={Mail} label="Email" value={vendor.email} />
              <InfoRow icon={Phone} label="Phone" value={vendor.phone} />
              <InfoRow icon={MapPin} label="Location" value={vendor.location} />

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">User ID</span>
                <span className="text-xs font-mono font-bold text-zinc-900 uppercase bg-zinc-100 px-2 py-0.5 rounded-md">
                  {vendor.id.split("-")[0]}ZG
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Email Status</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-100">
                  <CheckCircle2 size={10} /> Verified
                </span>
              </div>
            </div>
          </div>

          {/* 2. Wallet Card */}
          <div className="lg:col-span-4 bg-zinc-900 text-white border border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col justify-between h-full relative overflow-hidden group">
            <Wallet className="absolute -right-6 -bottom-6 w-36 h-36 text-zinc-800/50 rotate-12 transition-transform group-hover:rotate-6" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-[#D4AF37] to-zinc-800" />

            <div className="relative z-10 space-y-6">
              {/* NGN Balance */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#D4AF37]">
                  <Wallet size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    NGN Wallet
                  </span>
                </div>
                <p className="text-3xl font-bold font-mono tracking-tight text-white mb-1">
                  ₦50,000.00
                </p>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Available Balance
                </p>
              </div>

              <div className="h-px w-full bg-zinc-800" />

              {/* USD Balance */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <Wallet size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    USD Wallet
                  </span>
                </div>
                <p className="text-3xl font-bold font-mono tracking-tight text-white mb-1">
                  $45.00
                </p>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  System Reserve
                </p>
              </div>
            </div>
          </div>

          {/* 3. Metrics Stack */}
          <div className="lg:col-span-4 flex flex-col gap-3 h-full">
            {/* Store Rating Mini Card */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                  Store Rating
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-zinc-900">
                    {vendor.rating}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">/ 5.0</span>
                </div>
              </div>
              <Star className="text-[#D4AF37] fill-[#D4AF37]" size={28} />
            </div>

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
          </div>
        </div>

        {/* ─── PREMIUM TABS ─── */}
        <div className="space-y-6">
          <Tabs
            defaultValue={isPending ? "kyc" : "products"}
            className="w-full flex flex-col"
          >
            {/* Tab List */}
            <div className="flex justify-center mb-8">
              <TabsList className="bg-zinc-200/50 p-1 h-12 rounded-full inline-flex gap-1 overflow-x-auto whitespace-nowrap">
                <TabTriggerItem value="products" label="Products" />
                <TabTriggerItem value="orders" label="Customer Orders" />
                <TabTriggerItem value="kyc" label="KYC Document" hasPulse={isPending} />
                <TabTriggerItem value="payouts" label="Payout History" />
                <TabTriggerItem value="settings" label="Settings" />
              </TabsList>
            </div>

            {/* TAB 1: PRODUCTS TABLE */}
            <TabsContent value="products" className="animate-in fade-in duration-500 m-0">
              <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-0">
                  <DataTable columns={productColumns} data={VENDOR_PRODUCTS} />
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: CUSTOMER ORDERS */}
            <TabsContent value="orders" className="animate-in fade-in duration-500 m-0">
              <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center shadow-sm">
                <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest font-bold">
                  Customer Orders Empty
                </p>
              </div>
            </TabsContent>

            {/* TAB 3: KYC VIEWER */}
            <TabsContent value="kyc" className="animate-in fade-in duration-500 m-0">
              <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Submitted Documents
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-white px-3 py-1.5 rounded-lg border border-zinc-200 shadow-sm">
                    {vendor.documents?.filter((d) => d.status === "Verified").length || 0}{" "}
                    / {vendor.documents?.length || 0} Verified
                  </span>
                </div>
                <div className="p-6">
                  <KycViewer documents={vendor.documents} />
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: PAYOUT HISTORY */}
            <TabsContent value="payouts" className="animate-in fade-in duration-500 m-0">
              <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Recent Wallet Activity
                  </h3>
                </div>
                <div className="divide-y divide-zinc-100">
                  {MOCK_TRANSACTIONS.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-5 flex justify-between items-center hover:bg-zinc-50/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-zinc-900">
                          {tx.type}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
                          {tx.date}
                        </p>
                      </div>
                      <p
                        className={`text-lg font-bold font-mono ${tx.isNegative ? "text-rose-600" : "text-emerald-600"}`}
                      >
                        {tx.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB 5: SETTINGS */}
            <TabsContent value="settings" className="animate-in fade-in duration-500 m-0">
              <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden max-w-3xl">
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 relative">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                    Vendor Configuration
                  </h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                    Edit core details for this vendor profile. These changes will reflect immediately.
                  </p>
                </div>

                <div className="p-6 space-y-5">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Store Name</Label>
                    <Input defaultValue={vendor.storeName} className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-medium focus-visible:ring-[#D4AF37] rounded-lg" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Owner Name</Label>
                      <Input defaultValue={vendor.ownerName} className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-medium focus-visible:ring-[#D4AF37] rounded-lg" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Phone Number</Label>
                      <Input
                        defaultValue={vendor.phone}
                        className="h-11 font-mono text-sm bg-zinc-50/50 border-zinc-200 focus-visible:ring-[#D4AF37] rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Headquarters / Address</Label>
                    <Input defaultValue={vendor.location} className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-[#D4AF37] rounded-lg" />
                  </div>

                  <div className="pt-4 mt-2 border-t border-zinc-100 flex justify-end">
                    <Button className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-xl shadow-md transition-all">
                      <Save className="mr-2 h-4 w-4" /> Save Changes
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