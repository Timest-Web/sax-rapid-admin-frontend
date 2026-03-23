/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FINANCE_STATS,
  VENDOR_WALLETS,
  GLOBAL_TRANSACTIONS,
} from "@/src/lib/dummy_data";
import { walletColumns, transactionColumns } from "./column";
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Download,
  Activity,
} from "lucide-react";
import { GatewayConfigModal } from "./actions";
import { StatCard } from "@/components/stat-card"; 

export default function FinancePage() {
  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Finance & Payments
          </h1>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-3 w-3" /> Export Audit Log
        </Button>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* TOP METRICS (PLATFORM WALLET) */}
        <section className="space-y-3">
          <h3 className="tech-label">Platform Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Revenue"
              value={FINANCE_STATS.totalRevenue}
              icon={TrendingUp}
            />
            <StatCard
              label="Commission Earned"
              value={FINANCE_STATS.platformCommission}
              icon={Wallet}
            />
            <StatCard
              label="Pending Payouts"
              value={FINANCE_STATS.pendingPayouts}
              icon={Activity}
            />
            <div className="bg-sax-black text-white p-6 rounded-xl flex flex-col justify-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sax-gold">
                Net Profit
              </p>
              <p className="text-3xl font-bold font-mono">₦11,025,000</p>
            </div>
          </div>
        </section>

        {/* MAIN TABS */}
        <div className="space-y-4">
          <Tabs defaultValue="wallets" className="w-full flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-200">
              <TabsList className="bg-transparent p-0 h-12 justify-start w-full">
                <TabItem value="wallets" label="Vendor Wallets" />
                <TabItem value="transactions" label="Transaction Log" />
                <TabItem value="gateways" label="Payment Gateways" />
              </TabsList>
            </div>

            {/* TAB 1: VENDOR WALLETS */}
            <TabsContent value="wallets">
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                <DataTable
                  columns={walletColumns}
                  data={VENDOR_WALLETS}
                />
              </div>
            </TabsContent>

            {/* TAB 2: TRANSACTIONS */}
            <TabsContent value="transactions">
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                <DataTable
                  columns={transactionColumns}
                  data={GLOBAL_TRANSACTIONS}
                />
              </div>
            </TabsContent>

            {/* TAB 3: GATEWAY SETTINGS */}
            <TabsContent value="gateways">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Paystack Card */}
                <GatewayCard
                  name="Paystack"
                  logo="https://upload.wikimedia.org/wikipedia/commons/0/0b/Paystack_Logo.png"
                  status="Active"
                  transactions="4,200"
                  volume="₦85M"
                />

                {/* PayFast Card */}
                <GatewayCard
                  name="PayFast"
                  logo="" // Use text fallback
                  status="Active"
                  transactions="1,150"
                  volume="R 450k"
                />

                {/* Stripe (Disabled) */}
                <div className="bg-zinc-50 border border-dashed border-zinc-300 rounded-lg p-6 flex flex-col items-center justify-center text-center opacity-70">
                  <CreditCard className="h-10 w-10 text-zinc-300 mb-3" />
                  <h3 className="font-bold text-zinc-900">Stripe</h3>
                  <p className="text-xs text-zinc-500 mb-4">
                    International payments (USD)
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

// ─── LOCAL COMPONENTS ───

function TabItem({ value, label }: { value: string; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-none border-b-2 border-transparent px-6 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 data-[state=active]:border-[#EAB308] data-[state=active]:text-zinc-900 data-[state=active]:bg-transparent transition-all"
    >
      {label}
    </TabsTrigger>
  );
}

function GatewayCard({ name, logo, status, transactions, volume }: any) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm flex flex-col justify-between h-56">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-zinc-100 rounded flex items-center justify-center font-bold text-xs text-zinc-600">
            {name[0]}P
          </div>
          <div>
            <h3 className="font-bold text-lg text-zinc-900">{name}</h3>
            <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              {status}
            </span>
          </div>
        </div>
        <GatewayConfigModal name={name} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Monthly Volume</span>
          <span className="font-mono font-bold text-zinc-900">{volume}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Transactions</span>
          <span className="font-mono font-bold text-zinc-900">
            {transactions}
          </span>
        </div>
        <div className="w-full bg-zinc-100 h-1.5 rounded-full mt-2 overflow-hidden">
          <div className="bg-[#EAB308] h-full w-[70%]" />
        </div>
      </div>
    </div>
  );
}
