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

// --- DUMMY DATA ---
const REVIEWS_DATA: Review[] = [
  {
    id: "1",
    customerName: "Alice M.",
    avatar: "AM",
    vendorName: "Tech Haven",
    productName: "iPhone 15 Pro Max Case",
    rating: 5,
    comment:
      "Amazing service and fast delivery! The quality exceeds expectations.",
    date: "2023-10-25",
    status: "active",
  },
  {
    id: "2",
    customerName: "John D.",
    avatar: "JD",
    vendorName: "Burger King",
    productName: "Double Whopper Meal",
    rating: 1,
    comment: "Food was cold and arrived late. Totally unacceptable experience.",
    date: "2023-10-24",
    status: "flagged",
  },
  {
    id: "3",
    customerName: "Sarah W.",
    avatar: "SW",
    vendorName: "Style Loft",
    productName: "Floral Summer Dress",
    rating: 4,
    comment: "Great fabric but size runs small. Order one size up.",
    date: "2023-10-23",
    status: "active",
  },
  {
    id: "4",
    customerName: "Mike R.",
    avatar: "MR",
    vendorName: "Tech Haven",
    productName: "Wireless Earbuds Gen 2",
    rating: 2,
    comment: "Product stopped working after 2 days. Trying to get a refund.",
    date: "2023-10-22",
    status: "flagged",
  },
  {
    id: "5",
    customerName: "Jenny L.",
    avatar: "JL",
    vendorName: "Fresh Mart",
    productName: "Organic Avocados (Pack of 4)",
    rating: 5,
    comment: "Freshest vegetables in town. Will order again.",
    date: "2023-10-22",
    status: "active",
  },
];

const VENDOR_RATINGS_DATA: VendorRating[] = [
  {
    id: "1",
    vendorName: "Tech Haven",
    logo: "TH",
    category: "Electronics",
    avgRating: 4.2,
    totalReviews: 128,
    status: "active",
  },
  {
    id: "2",
    vendorName: "Burger King",
    logo: "BK",
    category: "Food",
    avgRating: 3.5,
    totalReviews: 850,
    status: "active",
  },
  {
    id: "3",
    vendorName: "Style Loft",
    logo: "SL",
    category: "Fashion",
    avgRating: 4.8,
    totalReviews: 45,
    status: "active",
  },
  {
    id: "4",
    vendorName: "Fresh Mart",
    logo: "FM",
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
      </header>

      <main className="p-6 max-w-400 mx-auto space-y-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Reviews"
            value="1,245"
            icon={MessageSquare}
            variant="default"
          />
          <StatCard
            label="Avg Platform Rating"
            value="4.5"
            icon={Star}
            variant="gold"
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
