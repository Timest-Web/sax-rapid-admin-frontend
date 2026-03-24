"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Star, AlertTriangle, MessageSquare, ShieldCheck } from "lucide-react";
import { FilterTabs } from "@/components/tabs/filter-tab";
import {
  reviewColumns,
  vendorRatingColumns,
  Review,
  VendorRating,
} from "./column";
import { StatCard } from "@/components/cards/stat-card";

// --- DUMMY DATA (Ideally move to lib/dummy_data.ts) ---
const REVIEWS_DATA: Review[] = [
  {
    id: "1",
    customerName: "Alice M.",
    vendorName: "Tech Haven",
    rating: 5,
    comment: "Amazing service and fast delivery!",
    date: "2023-10-25",
    status: "published",
  },
  {
    id: "2",
    customerName: "John D.",
    vendorName: "Burger King",
    rating: 1,
    comment: "Food was cold and arrived late. Totally unacceptable.",
    date: "2023-10-24",
    status: "flagged",
  },
  {
    id: "3",
    customerName: "Sarah W.",
    vendorName: "Style Loft",
    rating: 4,
    comment: "Great fabric but size runs small.",
    date: "2023-10-23",
    status: "published",
  },
  {
    id: "4",
    customerName: "Mike R.",
    vendorName: "Tech Haven",
    rating: 2,
    comment: "Product stopped working after 2 days.",
    date: "2023-10-22",
    status: "flagged",
  },
  {
    id: "5",
    customerName: "Jenny L.",
    vendorName: "Fresh Mart",
    rating: 5,
    comment: "Freshest vegetables in town.",
    date: "2023-10-22",
    status: "published",
  },
];

const VENDOR_RATINGS_DATA: VendorRating[] = [
  {
    id: "1",
    vendorName: "Tech Haven",
    category: "Electronics",
    avgRating: 4.2,
    totalReviews: 128,
    status: "active",
  },
  {
    id: "2",
    vendorName: "Burger King",
    category: "Food",
    avgRating: 3.5,
    totalReviews: 850,
    status: "active",
  },
  {
    id: "3",
    vendorName: "Style Loft",
    category: "Fashion",
    avgRating: 4.8,
    totalReviews: 45,
    status: "active",
  },
  {
    id: "4",
    vendorName: "Fresh Mart",
    category: "Groceries",
    avgRating: 4.9,
    totalReviews: 312,
    status: "active",
  },
];

export default function ReviewsView() {
  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / Reviews & Ratings
          </h1>
        </div>
        {/* Optional: Add a 'Export Report' button here if needed */}
      </header>

      <main className="p-6 max-w-400 mx-auto space-y-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Reviews"
            value="1,245"
            icon={MessageSquare}
            variant="gold"
          />
          <StatCard
            label="Avg Platform Rating"
            value="4.5"
            icon={Star}
            variant="emerald"
          />
          <StatCard
            label="Flagged / Abusive"
            value="12"
            icon={AlertTriangle}
            variant="rose"
          />
        </div>

        {/* TABS */}
        <Tabs defaultValue="reviews" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "reviews",
                  label: "Recent Reviews",
                  count: 5,
                  variant: "indigo",
                },
                {
                  value: "vendors",
                  label: "Vendor Ratings",
                  count: 4,
                  variant: "amber",
                },
              ]}
            />
          </div>

          {/* TAB 1: MODERATE REVIEWS */}
          <TabsContent value="reviews">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-bold text-sm text-zinc-700">
                  Moderation Queue
                </h3>
                <div className="text-xs text-zinc-500 flex gap-2 items-center">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Auto-moderation is active</span>
                </div>
              </div>
              <DataTable columns={reviewColumns} data={REVIEWS_DATA} />
            </div>
          </TabsContent>

          {/* TAB 2: VENDOR RATINGS MONITORING */}
          <TabsContent value="vendors">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <DataTable
                columns={vendorRatingColumns}
                data={VENDOR_RATINGS_DATA}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
