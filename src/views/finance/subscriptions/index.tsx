/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";

import { useState, useMemo } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Crown, Database, Activity, Filter, X } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { getPackageColumns, SubscriptionPackage } from "./column";
import { SubscriptionModal } from "./modal";

// --- DUMMY DATA ---
const INITIAL_PACKAGES: SubscriptionPackage[] = [
  {
    id: "PKG-01",
    name: "Sax Rapid Basic",
    duration: 30,
    amount: 5000,
    currency: "NGN",
    uploadLimit: 50,
    description: "Standard package for entry-level vendors.",
    status: "active",
    createdAt: "2024-10-01",
  },
  {
    id: "PKG-02",
    name: "Sax Rapid Premium",
    duration: 90,
    amount: 1500,
    currency: "ZAR",
    uploadLimit: 200,
    description: "High-volume listing plan with priority support.",
    status: "active",
    createdAt: "2024-10-15",
  },
  {
    id: "PKG-03",
    name: "Sax Rapid Enterprise",
    duration: 365,
    amount: 50000,
    currency: "NGN",
    uploadLimit: 1000,
    description: "Unlimited listings for large scale businesses.",
    status: "inactive",
    createdAt: "2024-11-01",
  },
];

export default function SubscriptionsView() {
  const [packages, setPackages] =
    useState<SubscriptionPackage[]>(INITIAL_PACKAGES);

  // Global Currency State
  const [globalCurrency, setGlobalCurrency] = useState("NGN");

  // Filters State
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] =
    useState<SubscriptionPackage | null>(null);

  // Handlers
  const handleEdit = (convertedPkg: SubscriptionPackage) => {
    // Find the ORIGINAL package data so we edit the base values, not the converted ones
    const originalPkg =
      packages.find((p) => p.id === convertedPkg.id) || convertedPkg;
    setEditingPackage(originalPkg);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setPackages(
      packages.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "inactive" : "active" }
          : p,
      ),
    );
  };

  const handleSave = (pkg: SubscriptionPackage) => {
    const exists = packages.find((p) => p.id === pkg.id);
    if (exists) {
      setPackages(packages.map((p) => (p.id === pkg.id ? pkg : p)));
    } else {
      setPackages([pkg, ...packages]);
    }
  };

  // 1. Filter Logic
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchStatus = filterStatus === "all" || pkg.status === filterStatus;
      const matchPlan = filterPlan === "all" || pkg.name === filterPlan;
      const matchDate = !filterDate || pkg.createdAt === filterDate;
      return matchStatus && matchPlan && matchDate;
    });
  }, [packages, filterStatus, filterPlan, filterDate]);

  // 2. Currency Conversion Logic for Display
  const displayPackages = useMemo(() => {
    return filteredPackages.map((pkg) => {
      // Step A: Normalize original amount to Base NGN
      let baseInNgn = pkg.amount;
      if (pkg.currency === "ZAR") baseInNgn = pkg.amount / 0.0117; // Mock rate: 1 NGN = ~0.0117 ZAR
      if (pkg.currency === "USD") baseInNgn = pkg.amount * 1500; // Mock rate: 1 USD = 1500 NGN

      // Step B: Convert from Base NGN to Selected Global Currency
      let finalAmount = baseInNgn;
      if (globalCurrency === "ZAR") finalAmount = baseInNgn * 0.0117;
      if (globalCurrency === "USD") finalAmount = baseInNgn / 1500;

      return {
        ...pkg,
        amount: finalAmount, // Overwrite with converted amount for the table
        currency: globalCurrency, // Overwrite with global currency for the table
      };
    });
  }, [filteredPackages, globalCurrency]);

  const columns = useMemo(
    () =>
      getPackageColumns({
        onEdit: handleEdit,
        onToggleStatus: handleToggleStatus,
      }),
    [packages], // Dependency on packages so toggle uses latest
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-10">
      {/* ─── HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Finance / Subscriptions
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Currency Switcher */}
          <Select value={globalCurrency} onValueChange={setGlobalCurrency}>
            <SelectTrigger className="h-9 w-28 bg-zinc-50 border-zinc-200 text-xs font-bold text-zinc-700 shadow-sm focus:ring-zinc-900 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">NGN (₦)</SelectItem>
              <SelectItem value="ZAR">ZAR (R)</SelectItem>
            </SelectContent>
          </Select>

          {/* Create Button */}
          <Button
            onClick={() => {
              setEditingPackage(null);
              setIsModalOpen(true);
            }}
            className="h-9 text-xs font-bold uppercase tracking-wider bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors rounded-lg shadow-sm"
          >
            <Plus size={14} className="mr-2" /> Create Package
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6 mt-2">
        {/* ─── STATS OVERVIEW ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Packages"
            value={packages.length.toString()}
            icon={Database}
            variant="default"
          />
          <StatCard
            label="Active Packages"
            value={packages
              .filter((p) => p.status === "active")
              .length.toString()}
            icon={Activity}
            variant="emerald"
          />
          <StatCard
            label="Total Subscribers"
            value="1,240"
            icon={Crown}
            variant="gold"
          />
        </div>

        {/* ─── FILTER BAR ─── */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-zinc-200 flex flex-wrap gap-3 items-center">
          <div className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest mr-2">
            <Filter className="mr-2 h-3.5 w-3.5" /> Filters:
          </div>

          {/* Plan Filter */}
          <Select value={filterPlan} onValueChange={setFilterPlan}>
            <SelectTrigger className="w-[180px] h-10 text-xs font-bold bg-zinc-50/50 border-zinc-200 rounded-xl text-zinc-600 focus:ring-[#D4AF37]">
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              {packages.map((p) => (
                <SelectItem key={p.id} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] h-10 text-xs font-bold uppercase tracking-wider bg-zinc-50/50 border-zinc-200 rounded-xl text-zinc-600 focus:ring-[#D4AF37]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <div className="relative">
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="h-10 w-[160px] text-xs font-mono bg-zinc-50/50 border-zinc-200 rounded-xl text-zinc-600 focus-visible:ring-[#D4AF37]"
            />
          </div>

          {/* Reset Button */}
          {(filterPlan !== "all" ||
            filterStatus !== "all" ||
            filterDate !== "") && (
            <Button
              variant="ghost"
              onClick={() => {
                setFilterPlan("all");
                setFilterStatus("all");
                setFilterDate("");
              }}
              className="h-10 text-xs font-bold uppercase tracking-widest text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl px-4 ml-auto"
            >
              <X size={14} className="mr-2" /> Clear
            </Button>
          )}
        </div>

        {/* ─── DATA TABLE ─── */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <DataTable columns={columns} data={displayPackages} />
        </div>
      </main>

      {/* ─── MODAL ─── */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingPackage}
        onSave={handleSave}
      />
    </div>
  );
}
