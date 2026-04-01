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
import { Plus, Crown, Database, Activity } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { getPackageColumns, SubscriptionPackage } from "./column";
import { SubscriptionModal } from "./modal";

// --- DUMMY DATA ---
const INITIAL_PACKAGES: SubscriptionPackage[] = [
  {
    id: "PKG-01",
    name: "Vidza Basic",
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
    name: "Vidza Premium",
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
    name: "Vidza Enterprise",
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
  const [packages, setPackages] = useState<SubscriptionPackage[]>(INITIAL_PACKAGES);

  // Filters State
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<SubscriptionPackage | null>(null);

  // Handlers
  const handleEdit = (pkg: SubscriptionPackage) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setPackages(
      packages.map((p) =>
        p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
      )
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

  // Filter Logic
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchStatus = filterStatus === "all" || pkg.status === filterStatus;
      const matchPlan = filterPlan === "all" || pkg.name === filterPlan;
      const matchDate = !filterDate || pkg.createdAt === filterDate;
      return matchStatus && matchPlan && matchDate;
    });
  }, [packages, filterStatus, filterPlan, filterDate]);

  const columns = useMemo(
    () => getPackageColumns({ onEdit: handleEdit, onToggleStatus: handleToggleStatus }),
    []
  );

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Finance / Subscriptions
          </h1>
        </div>
        <Button
          onClick={() => {
            setEditingPackage(null);
            setIsModalOpen(true);
          }}
          className="bg-zinc-900 hover:bg-zinc-800 text-xs text-white"
        >
          <Plus size={16} className="mr-2" /> Create Package
        </Button>
      </header>

      <main className="p-6 max-w-5xl mx-auto space-y-6 mt-4">
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Packages"
            value={packages.length.toString()}
            icon={Database}
            variant="default"
          />
          <StatCard
            label="Active Packages"
            value={packages.filter((p) => p.status === "active").length.toString()}
            icon={Activity}
            variant="emerald"
          />
          <StatCard
            label="Total Subscribers"
            value="1,240"
            icon={Crown}
            variant="indigo"
          />
        </div>

        {/* FILTER BAR */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-3 flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Filter by Plan
            </label>
            <Select value={filterPlan} onValueChange={setFilterPlan}>
              <SelectTrigger className="h-9 text-xs">
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
          </div>

          <div className="flex-1 w-full space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Filter by Status
            </label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 w-full space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Filter by Date Created
            </label>
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="h-9 text-xs font-mono"
            />
          </div>

          <Button
            variant="outline"
            className="h-9 w-full sm:w-auto text-xs"
            onClick={() => {
              setFilterPlan("all");
              setFilterStatus("all");
              setFilterDate("");
            }}
          >
            Reset Filters
          </Button>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
          <DataTable columns={columns} data={filteredPackages} />
        </div>
      </main>

      {/* MODAL */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingPackage}
        onSave={handleSave}
      />
    </div>
  );
}