"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Store, UserCheck, FileText, UserMinus, Plus } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { vendorColumns } from "./column";
import { StatCard } from "@/components/cards/stat-card";
import { FilterTabs } from "@/components/tabs/filter-tab";

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
import { useVendors } from "@/src/features/vendors/hooks";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

export default function VendorsView() {
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);

  const [page] = useState(1);
  const pageSize = 20;

  const {
    data: vendors = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useVendors({ page, pageSize });

  // Until backend provides vendor "status", we can segment by verificationStatus
  const verifiedVendors = useMemo(
    () =>
      vendors.filter(
        (v: { verificationStatus: string }) =>
          v.verificationStatus === "Verified",
      ),
    [vendors],
  );
  const pendingVendors = useMemo(
    () =>
      vendors.filter(
        (v: { verificationStatus: string }) =>
          v.verificationStatus === "NotVerified",
      ),
    [vendors],
  );

  // API doesn't currently provide inactive/suspended vendor status
  const inactiveVendors = useMemo(() => [], []);

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Vendor Saved!");
    setIsAddVendorModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Stores"
            value={isLoading ? "—" : String(vendors.length)}
            icon={Store}
            variant="default"
          />
          <StatCard
            label="Verified Vendors"
            value={isLoading ? "—" : String(verifiedVendors.length)}
            icon={UserCheck}
            variant="emerald"
          />
          <StatCard
            label="KYC Pending"
            value={isLoading ? "—" : String(pendingVendors.length)}
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

        <div className="space-y-4">
          <Tabs defaultValue="all" className="w-full flex flex-col">
            <div className="flex items-center justify-between">
              <FilterTabs
                tabs={[
                  {
                    value: "all",
                    label: "All Stores",
                    count: vendors.length,
                    variant: "default",
                  },
                  {
                    value: "active",
                    label: "Verified",
                    count: verifiedVendors.length,
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
              {isLoading ? (
                  <TableSkeleton columns={vendorColumns.length} rows={12} withToolbar={false} />
              ) : isError ? (
                <div className="p-6 text-sm">
                  <p className="text-red-600">
                    Failed to load vendors:{" "}
                    {(error as any)?.response?.data?.message ??
                      (error as any)?.message ??
                      "Unknown error"}
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="mt-3 text-xs font-semibold underline text-zinc-700"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <>
                  {isFetching && (
                    <div className="px-6 py-2 text-[11px] text-zinc-500 border-b border-zinc-100">
                      Refreshing…
                    </div>
                  )}

                  <TabsContent value="all" className="m-0">
                    <DataTable columns={vendorColumns} data={vendors} />
                  </TabsContent>

                  <TabsContent value="active" className="m-0">
                    <DataTable columns={vendorColumns} data={verifiedVendors} />
                  </TabsContent>

                  <TabsContent value="applications" className="m-0">
                    <DataTable columns={vendorColumns} data={pendingVendors} />
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        </div>
      </main>

      {/* Modal stays the same */}
      <Dialog
        open={isAddVendorModalOpen}
        onOpenChange={setIsAddVendorModalOpen}
      >
        <DialogContent className="sm:max-w-125 bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
          <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                  <Store size={16} />
                </div>
                Create New Vendor
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 mt-2 leading-relaxed pl-11">
                Enter the primary details for the new store...
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSaveVendor} className="p-6 space-y-5">
            {/* keep your form fields */}
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
                className="h-11 bg-zinc-50/50 border-zinc-200"
              />
            </div>

            <DialogFooter className="pt-6 mt-2 border-t border-zinc-100 sm:justify-between flex-row-reverse">
              <Button
                type="submit"
                className="bg-zinc-900 text-[#D4AF37] px-8 h-11"
              >
                Create Vendor
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddVendorModalOpen(false)}
                className="px-6 h-11"
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
