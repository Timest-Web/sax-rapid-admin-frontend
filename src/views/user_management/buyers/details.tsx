"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Phone, MapPin, Calendar, Wallet, ArrowLeft } from "lucide-react";
import { BUYER_ORDERS, BUYERS } from "@/src/lib/dummy_data";
import {
  CreditWalletModal,
  ResetPasswordModal,
  SuspendUserModal,
} from "@/components/buyers/buyers-action";
import { InfoRow, TabItem } from "@/components/buyers/buyers-helper";
import { orderColumns } from "./details_column";

export default function BuyerDetailsView() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId || "";

  const buyerId = decodeURIComponent(id);
  const buyer = BUYERS.find((b) => b.id === buyerId);

  if (!buyer && id) return notFound();
  if (!buyer) return null;

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      
      {/* ─── STICKY HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <div className="flex items-center gap-2 text-sm font-mono text-zinc-400">
            <Link
              href="/admin/buyers"
              className="hover:text-zinc-900 transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} /> BUYERS
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-bold">{buyer.id}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <ResetPasswordModal />
          <SuspendUserModal />
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="p-6 max-w-[1600px] mx-auto space-y-8">
        
        {/* ─── TOP SECTION: CARDS ROW ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 1. Identity Card (Cols 1-4) */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-lg p-6 shadow-sm flex flex-col justify-between h-full">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-full bg-zinc-100 flex items-center justify-center text-2xl font-bold text-zinc-400 border-4 border-zinc-50 shrink-0">
                {buyer.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 font-display">
                  {buyer.name}
                </h2>
                <p className="text-xs text-zinc-400 font-mono mt-1 mb-2">
                  {buyer.email}
                </p>
                <StatusBadge status={buyer.status} />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-100 space-y-3">
              <InfoRow icon={Phone} label="Phone" value={buyer.phone} />
              <InfoRow icon={MapPin} label="Location" value={buyer.location} />
              <InfoRow icon={Calendar} label="Joined" value={buyer.joinDate} />
            </div>
          </div>

          {/* 2. Wallet Card (Cols 5-8) */}
          <div className="lg:col-span-4 bg-sax-black text-white border border-zinc-900 rounded-lg p-6 shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-4 text-sax-gold">
                <Wallet size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Wallet Balance
                </span>
              </div>
              <p className="text-4xl font-bold font-mono tracking-tight">₦24,500.00</p>
            </div>
            
            <div className="mt-6 flex gap-3">
              <CreditWalletModal />
              <Button
                variant="outline"
                className="flex-1 bg-transparent text-white border-zinc-700 hover:bg-zinc-800 hover:text-white hover:border-white h-9"
              >
                View Logs
              </Button>
            </div>
          </div>

          {/* 3. Metrics Stack (Cols 9-12) */}
          <div className="lg:col-span-4 flex flex-col gap-3 h-full">
             <MetricCard label="Total Spent" value={buyer.totalSpent} />
             <MetricCard label="Total Orders" value={String(buyer.orders)} />
             <MetricCard label="Avg. Order Value" value="₦45,000" />
          </div>

        </div>

        {/* ─── BOTTOM SECTION: TABS & TABLE ─── */}
        <div className="space-y-6">
          <Tabs defaultValue="orders" className="w-full flex flex-col">
            
            <div className="border-b border-zinc-200 mb-6">
              <TabsList className="bg-transparent p-0 h-12 justify-start w-full">
                <TabItem value="orders" label="Order History" />
                <TabItem value="activity" label="Activity Log" />
                <TabItem value="settings" label="Settings" />
              </TabsList>
            </div>

            {/* ORDERS TAB */}
            <TabsContent value="orders" className="m-0">
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm">
                <div className="p-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/30">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Transaction History
                  </h3>
                  <Button variant="outline" size="sm" className="h-7 text-[10px]">
                    Export CSV
                  </Button>
                </div>
                <div className="p-0">
                  <DataTable columns={orderColumns} data={BUYER_ORDERS} />
                </div>
              </div>
            </TabsContent>

            {/* ACTIVITY TAB */}
            <TabsContent value="activity" className="m-0">
              <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center shadow-sm min-h-[300px] flex items-center justify-center">
                <p className="text-zinc-400 font-mono text-sm">
                  Activity logs will go here.
                </p>
              </div>
            </TabsContent>

            {/* SETTINGS TAB */}
            <TabsContent value="settings" className="m-0">
              <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center shadow-sm min-h-[300px] flex items-center justify-center">
                <p className="text-zinc-400 font-mono text-sm">
                  User settings form will go here.
                </p>
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </main>
    </div>
  );
}

// ─── LOCAL COMPONENT: METRIC CARD ───
// A cleaner, smaller card used for the stack on the right
function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 bg-white border border-zinc-200 rounded-lg px-5 flex items-center justify-between shadow-sm min-h-[70px]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        {label}
      </p>
      <p className="text-xl font-bold font-mono text-zinc-900">{value}</p>
    </div>
  );
}