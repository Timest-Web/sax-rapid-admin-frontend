"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Store, UserCheck, FileText, UserMinus, Plus } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { VENDORS } from "@/src/lib/dummy_data";
import { vendorColumns } from "./column";
import { StatCard } from "@/components/cards/stat-card";
import { FilterTabs } from "@/components/tabs/filter-tab";

// --- Dialog & Form Imports ---
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VendorsView() {
  // Modal State
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);

  // Enhanced Filter Data
  const pendingVendors = VENDORS.filter((v) => v.status === "Pending");
  const activeVendors = VENDORS.filter((v) => v.status === "Active");
  const inactiveVendors = VENDORS.filter(
    (v) => v.status === "Inactive" || v.status === "Suspended",
  );

  // Mock Form Submission
  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    // Add API logic here
    console.log("New Vendor Saved!");
    setIsAddVendorModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* ─── HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Marketplace / Vendors
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 text-xs">
            Export Report
          </Button>
          {/* Trigger Modal on Click */}
          <Button
            size="sm"
            className="h-9 text-xs bg-zinc-900 text-white hover:bg-[#D4AF37] hover:text-black transition-colors"
            onClick={() => setIsAddVendorModalOpen(true)}
          >
            <Plus className="mr-2 h-3.5 w-3.5" /> Add Vendor
          </Button>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* ─── METRICS ROW ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Stores"
            value={String(VENDORS.length)}
            icon={Store}
            variant="default"
          />
          <StatCard
            label="Active Vendors"
            value={String(activeVendors.length)}
            icon={UserCheck}
            variant="emerald"
          />
          <StatCard
            label="KYC Pending"
            value={String(pendingVendors.length)}
            icon={FileText}
            variant="amber"
          />
          <StatCard
            label="Inactive Vendors"
            value={String(inactiveVendors.length)}
            icon={UserMinus}
            variant="rose"
          />
        </div>

        {/* ─── MAIN TABS ─── */}
        <div className="space-y-4">
          <Tabs defaultValue="all" className="w-full flex flex-col">
            <div className="flex items-center justify-between">
              <FilterTabs
                tabs={[
                  {
                    value: "all",
                    label: "All Stores",
                    count: VENDORS.length,
                    variant: "default",
                  },
                  {
                    value: "active",
                    label: "Active",
                    count: activeVendors.length,
                    variant: "emerald",
                  },
                  {
                    value: "applications",
                    label: "Pending KYC",
                    count: pendingVendors.length,
                    variant: "amber",
                  },
                ]}
              />
            </div>

            <div className="mt-4 bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
              <TabsContent value="all" className="m-0">
                <DataTable columns={vendorColumns} data={VENDORS} />
              </TabsContent>

              <TabsContent value="active" className="m-0">
                <DataTable columns={vendorColumns} data={activeVendors} />
              </TabsContent>

              <TabsContent value="applications" className="m-0">
                <DataTable columns={vendorColumns} data={pendingVendors} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      {/* ─── ADD VENDOR MODAL (Black & Gold Theme) ─── */}
      <Dialog
        open={isAddVendorModalOpen}
        onOpenChange={setIsAddVendorModalOpen}
      >
        <DialogContent className="sm:max-w-125 bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
          {/* Modal Header */}
          <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />

            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                  <Store size={16} />
                </div>
                Create New Vendor
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 mt-2 leading-relaxed pl-11">
                Enter the primary details for the new store. The vendor will
                receive an email to set up their password and complete KYC.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSaveVendor} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="storeName"
                className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
              >
                Store Name <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                id="storeName"
                placeholder="e.g. TechHub Gadgets"
                required
                className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="firstName"
                  className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
                >
                  Owner First Name <span className="text-[#D4AF37]">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  required
                  className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="lastName"
                  className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
                >
                  Owner Last Name <span className="text-[#D4AF37]">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  required
                  className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
              >
                Business Email <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@techhub.com"
                required
                className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
                >
                  Phone Number <span className="text-[#D4AF37]">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+27 12 345 6789"
                  required
                  className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="category"
                  className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
                >
                  Primary Category <span className="text-[#D4AF37]">*</span>
                </Label>
                <Input
                  id="category"
                  placeholder="e.g. Electronics"
                  required
                  className="h-11 bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <DialogFooter className="pt-6 mt-2 border-t border-zinc-100 sm:justify-between flex-row-reverse">
              <Button
                type="submit"
                className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs font-bold uppercase tracking-widest rounded-xl px-8 h-11 transition-all duration-300 shadow-md"
              >
                Create Vendor
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddVendorModalOpen(false)}
                className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11 transition-all"
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
