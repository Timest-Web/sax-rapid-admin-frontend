"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatCard } from "@/components/cards/stat-card";
import { couponColumns, Coupon } from "./column";
import { 
  Ticket, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  FileEdit,
  Gift
} from "lucide-react";
import { toast } from "sonner";

// ─── MOCK DATA ───
const MOCK_COUPONS: Coupon[] = [
  { id: "1", code: "EASTER20", type: "Percentage", amount: 20, store: "TechHub", usageCount: 45, usageLimit: 100, expiryDate: "2026-04-15", status: "Active" },
  { id: "2", code: "WELCOME5K", type: "Fixed Amount", amount: 5000, store: "All Stores", usageCount: 120, usageLimit: null, expiryDate: "2026-12-31", status: "Active" },
  { id: "3", code: "FREESHIP", type: "Fixed Amount", amount: 2500, store: "Fresh Foods", usageCount: 100, usageLimit: 100, expiryDate: "2026-03-01", status: "Expired" },
  { id: "4", code: "BLACKFRIDAY", type: "Percentage", amount: 50, store: "SneakerVault", usageCount: 0, usageLimit: 500, expiryDate: "2026-11-27", status: "Draft" },
  { id: "5", code: "VIP10", type: "Percentage", amount: 10, store: "All Stores", usageCount: 8, usageLimit: 50, expiryDate: "2026-06-30", status: "Active" },
];

export default function CouponsView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Stats derivation
  const activeCount = MOCK_COUPONS.filter(c => c.status === "Active").length;
  const expiredCount = MOCK_COUPONS.filter(c => c.status === "Expired").length;
  const draftCount = MOCK_COUPONS.filter(c => c.status === "Draft").length;

  const filteredCoupons = MOCK_COUPONS.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.store.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-10">
      {/* ─── HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Promotions / Coupons
          </h1>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="h-9 text-xs font-bold uppercase tracking-wider bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shadow-sm rounded-lg"
        >
          <Plus className="mr-2 h-3.5 w-3.5" /> Add Coupon
        </Button>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* ─── STAT CARDS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Coupons" value={String(MOCK_COUPONS.length)} icon={Ticket} variant="default" />
          <StatCard label="Active Now" value={String(activeCount)} icon={CheckCircle2} variant="emerald" />
          <StatCard label="Expired" value={String(expiredCount)} icon={Clock} variant="rose" />
          <StatCard label="Drafts" value={String(draftCount)} icon={FileEdit} variant="amber" />
        </div>

        {/* ─── TABLE SECTION ─── */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <Ticket className="mr-2 h-4 w-4" /> Manage Listing
            </div>
            
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input 
                placeholder="Search code or store..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-9 bg-white border-zinc-200 text-xs focus-visible:ring-[#D4AF37] rounded-xl"
              />
            </div>
          </div>

          {/* Data Table */}
          <DataTable columns={couponColumns} data={filteredCoupons} />
        </div>

      </main>

      {/* ─── ADD COUPON MODAL ─── */}
      <AddCouponModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </div>
  );
}

// ==========================================
// MODAL COMPONENT
// ==========================================
function AddCouponModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [code, setCode] = useState("");

  const handleGenerateCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setCode(randomCode);
  };

  const handleSubmit = (e: React.FormEvent, status: "Active" | "Draft") => {
    e.preventDefault();
    toast.success(`Coupon saved as ${status}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
        
        {/* Header */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Gift size={16} />
              </div>
              Create Coupon
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              Configure discount rules, restrictions, and applicability for your marketplace or specific vendors.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form Body */}
        <form id="couponForm" className="p-6 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="code" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Coupon Code <span className="text-[#D4AF37]">*</span>
              </Label>
              <div className="flex gap-2">
                <Input 
                  id="code" 
                  placeholder="e.g. SUMMER24" 
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required 
                  className="h-11 font-mono font-bold text-lg tracking-wider uppercase bg-zinc-50/50 border-zinc-200 focus-visible:ring-[#D4AF37] rounded-lg" 
                />
                <Button 
                  type="button" 
                  onClick={handleGenerateCode}
                  variant="outline" 
                  className="h-11 px-4 text-xs font-bold uppercase tracking-widest border-zinc-200 hover:bg-zinc-100 text-zinc-600 rounded-lg"
                >
                  Generate
                </Button>
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="description" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Description (Internal)
              </Label>
              <Textarea 
                id="description" 
                placeholder="What is this coupon for?" 
                className="resize-none h-20 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-[#D4AF37] rounded-lg" 
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Discount Type <span className="text-[#D4AF37]">*</span>
              </Label>
              <Select defaultValue="percentage">
                <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 focus:ring-[#D4AF37] text-sm rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage Discount (%)</SelectItem>
                  <SelectItem value="fixed_cart">Fixed Amount (Cart)</SelectItem>
                  <SelectItem value="fixed_product">Fixed Amount (Product)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Coupon Amount <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="0" 
                required 
                className="h-11 font-mono text-sm bg-zinc-50/50 border-zinc-200 focus-visible:ring-[#D4AF37] rounded-lg" 
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="expiry" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Expiry Date
              </Label>
              <Input 
                id="expiry" 
                type="date" 
                className="h-11 text-sm bg-zinc-50/50 border-zinc-200 focus-visible:ring-[#D4AF37] text-zinc-600 rounded-lg" 
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Store Association
              </Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 focus:ring-[#D4AF37] text-sm rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Global (All Stores)</SelectItem>
                  <SelectItem value="vendor1">TechHub</SelectItem>
                  <SelectItem value="vendor2">Fresh Foods</SelectItem>
                  <SelectItem value="vendor3">SneakerVault</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 space-y-4 border-t border-zinc-100">
            <div className="flex items-center space-x-3 bg-zinc-50/50 p-3 rounded-lg border border-zinc-100">
              <Checkbox id="free_shipping" className="data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]" />
              <div className="flex flex-col">
                <Label htmlFor="free_shipping" className="text-sm font-bold text-zinc-900 cursor-pointer">Allow free shipping</Label>
                <span className="text-[10px] text-zinc-500">Check this if the coupon grants free shipping.</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-zinc-50/50 p-3 rounded-lg border border-zinc-100">
              <Checkbox id="show_store" className="data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]" />
              <div className="flex flex-col">
                <Label htmlFor="show_store" className="text-sm font-bold text-zinc-900 cursor-pointer">Show on store</Label>
                <span className="text-[10px] text-zinc-500">Display this coupon visibly on the storefront.</span>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-zinc-100 bg-white flex flex-col sm:flex-row justify-between gap-3 shrink-0">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="text-xs font-bold uppercase tracking-widest h-11 px-6 rounded-xl border-zinc-200"
          >
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button 
              type="button" 
              onClick={(e) => handleSubmit(e, "Draft")}
              className="bg-zinc-200 text-zinc-800 hover:bg-zinc-300 text-xs font-bold uppercase tracking-widest h-11 px-6 rounded-xl transition-all"
            >
              Save Draft
            </Button>
            <Button 
              type="submit" 
              onClick={(e) => handleSubmit(e, "Active")}
              className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs font-bold uppercase tracking-widest h-11 px-8 rounded-xl transition-all shadow-md"
            >
              Publish Coupon
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}