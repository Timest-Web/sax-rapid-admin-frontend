"use client";

import { useState, useMemo } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  DollarSign,
  PieChart,
  Smartphone,
  Shirt,
  Sofa,
  Gamepad2,
  Briefcase,
  Settings,
  Plus,
  Car,
  Heart,
  BookOpen,
  Baby,
} from "lucide-react";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { getCommissionColumns, CategoryCommission } from "./column";
import { StatCard } from "@/components/cards/stat-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- DUMMY DATA ---
const INITIAL_COMMISSION_DATA: CategoryCommission[] = [
  {
    id: "1",
    name: "Electronics & Gadgets",
    slug: "electronics",
    icon: Smartphone,
    rate: 5.0,
    totalSales: "₦45,000,000",
    revenueGenerated: "₦2,250,000",
    lastUpdated: "2 days ago",
    status: "active",
  },
  {
    id: "2",
    name: "Fashion & Apparel",
    slug: "fashion",
    icon: Shirt,
    rate: 8.0,
    totalSales: "₦12,000,000",
    revenueGenerated: "₦960,000",
    lastUpdated: "1 month ago",
    status: "active",
  },
  {
    id: "3",
    name: "Home & Furniture",
    slug: "home",
    icon: Sofa,
    rate: 10.0,
    totalSales: "₦8,500,000",
    revenueGenerated: "₦850,000",
    lastUpdated: "3 months ago",
    status: "active",
  },
  {
    id: "4",
    name: "Gaming",
    slug: "gaming",
    icon: Gamepad2,
    rate: 4.5,
    totalSales: "₦22,000,000",
    revenueGenerated: "₦990,000",
    lastUpdated: "1 week ago",
    status: "active",
  },
  {
    id: "5",
    name: "Office Supplies",
    slug: "office",
    icon: Briefcase,
    rate: 6.0,
    totalSales: "₦3,200,000",
    revenueGenerated: "₦192,000",
    lastUpdated: "6 months ago",
    status: "active",
  },
];

// Dummy unconfigured categories to pick from
const UNCONFIGURED_CATEGORIES = [
  { name: "Automotive & Parts", slug: "automotive", icon: Car },
  { name: "Health & Beauty", slug: "health", icon: Heart },
  { name: "Books & Media", slug: "books", icon: BookOpen },
  { name: "Toys & Baby", slug: "toys", icon: Baby },
];

export default function CommissionView() {
  const [commissions, setCommissions] = useState<CategoryCommission[]>(
    INITIAL_COMMISSION_DATA
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- Handlers ---
  const handleUpdateRate = (id: string, newRate: number) => {
    setCommissions((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, rate: newRate, lastUpdated: "Just now" } : c
      )
    );
  };

  const handleAddCategory = (newCategory: CategoryCommission) => {
    setCommissions([newCategory, ...commissions]);
  };

  // Generate columns dynamically with the update handler
  const columns = useMemo(() => getCommissionColumns(handleUpdateRate), []);

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / Commission Rates
          </h1>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs gap-2 rounded-md shadow-sm"
        >
          <Plus size={14} /> Configure Category
        </Button>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-8 mt-4">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Commission Revenue"
            value="₦5,242,000"
            icon={DollarSign}
            variant="default"
          />
          <StatCard
            label="Avg. Platform Rate"
            value="6.7%"
            icon={PieChart}
            variant="indigo"
          />
          <StatCard
            label="Highest Earner"
            value="Electronics"
            icon={Smartphone}
            variant="gold"
          />
        </div>

        {/* INFO CARD */}
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-4 shadow-sm">
          <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600 shrink-0">
            <Settings size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest">
              Pricing Strategy Note
            </h3>
            <p className="text-xs text-indigo-700 mt-1.5 leading-relaxed max-w-3xl">
              Categories with lower margins (e.g., Electronics) typically have
              lower commission rates (3-5%), while high-margin categories (e.g.,
              Fashion, Art) can sustain higher rates (8-15%). Adjusting a rate
              only affects new transactions.
            </p>
          </div>
        </div>

        {/* TABS */}
        <Tabs defaultValue="active" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "active",
                  label: "Active Categories",
                  count: commissions.length,
                  variant: "emerald",
                },
                {
                  value: "archived",
                  label: "Archived",
                  count: 0,
                  variant: "indigo",
                },
              ]}
            />
          </div>

          {/* TAB 1: ACTIVE RATES */}
          <TabsContent value="active">
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden mt-6">
              <DataTable columns={columns} data={commissions} />
            </div>
          </TabsContent>

          {/* TAB 2: ARCHIVED */}
          <TabsContent value="archived">
            <div className="h-40 bg-white border border-zinc-200 rounded-xl flex items-center justify-center text-zinc-400 text-sm font-mono mt-6">
              No archived categories found.
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* MODAL: Configure New Category */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCategory}
      />
    </div>
  );
}

// ==========================================
// MODAL: Add Category Configuration
// ==========================================
function AddCategoryModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: CategoryCommission) => void;
}) {
  const [selectedSlug, setSelectedSlug] = useState("");
  const [rate, setRate] = useState("");

  const handleSubmit = () => {
    if (!selectedSlug || !rate) return;

    const categoryDef = UNCONFIGURED_CATEGORIES.find(
      (c) => c.slug === selectedSlug
    );
    if (!categoryDef) return;

    const newCommission: CategoryCommission = {
      id: Math.random().toString(36).substr(2, 9),
      name: categoryDef.name,
      slug: categoryDef.slug,
      icon: categoryDef.icon,
      rate: Number(rate),
      totalSales: "₦0",
      revenueGenerated: "₦0",
      lastUpdated: "Just now",
      status: "active",
    };

    onSave(newCommission);
    onClose();
    // Reset Form
    setSelectedSlug("");
    setRate("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white text-zinc-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={18} className="text-zinc-500" /> Configure New Category
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Select Category
            </Label>
            <Select value={selectedSlug} onValueChange={setSelectedSlug}>
              <SelectTrigger className="h-11 border-zinc-200 focus:ring-zinc-900 font-medium">
                <SelectValue placeholder="Choose an unconfigured category" />
              </SelectTrigger>
              <SelectContent>
                {UNCONFIGURED_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Commission Rate (%)
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="e.g. 7.5"
                className="h-11 border-zinc-200 focus-visible:ring-zinc-900 font-mono text-lg"
              />
              <span className="absolute right-4 top-3 text-zinc-400 font-bold">
                %
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mt-1">
              Set the percentage fee taken from total sales within this category.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedSlug || !rate}
            className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs"
          >
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}