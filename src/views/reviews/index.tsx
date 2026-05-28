"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Star, AlertTriangle, MessageSquare, ShieldCheck } from "lucide-react";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { StatCard } from "@/components/cards/stat-card";

import { makeReviewColumns, vendorRatingColumns, type ReviewRow, type VendorRatingRow } from "./column";
import { useFlagReview, useRecentReviews, useReviewStats, useVendorRatings } from "@/src/features/reviews/hooks";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

function initials(name: string) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts[parts.length - 1]?.[0] ?? "R";
  return (a + b).toUpperCase();
}

export default function ReviewsView() {
  const statsQ = useReviewStats();
  const recentQ = useRecentReviews(1, 20);
  const vendorsQ = useVendorRatings(1, 20);
  const flagM = useFlagReview();

  const reviews: ReviewRow[] = useMemo(() => {
    const items: any[] = recentQ.data?.items ?? [];
    return items.map((r) => ({
      id: r.id,
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      productId: r.productId,
      isVerifiedPurchase: r.isVerifiedPurchase,
      status: r.isFlagged ? "flagged" : "active",
      avatar: initials(r.userName),
    }));
  }, [recentQ.data]);

  const vendorRows: VendorRatingRow[] = useMemo(() => {
    const items = vendorsQ.data?.items ?? [];
    return items.map((v) => ({
      vendorId: v.vendorId,
      vendorName: v.vendorName,
      rating: v.rating,
      totalProducts: v.totalProducts,
      totalRevenue: v.totalRevenue,
      currency: v.currency,
      status: v.status,
      verificationStatus: v.verificationStatus,
      storeCity: v.storeCity,
      storeState: v.storeState,
      email: v.email,
    }));
  }, [vendorsQ.data]);

  const reviewColumns = useMemo(
    () =>
      makeReviewColumns({
        onFlag: (reviewId) => flagM.mutate(reviewId),
      }),
    [flagM],
  );

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / Reviews & Ratings
          </h1>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Reviews"
            value={statsQ.isLoading ? "—" : String(statsQ.data?.totalReviews ?? 0)}
            icon={MessageSquare}
            variant="default"
          />
          <StatCard
            label="Avg Platform Rating"
            value={statsQ.isLoading ? "—" : String(statsQ.data?.averageRating ?? 0)}
            icon={Star}
            variant="gold"
          />
          <StatCard
            label="Flagged / Abusive"
            value={statsQ.isLoading ? "—" : String(statsQ.data?.flagged ?? 0)}
            icon={AlertTriangle}
            variant="rose"
          />
        </div>

        <Tabs defaultValue="reviews" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "reviews",
                  label: "Recent Reviews",
                  count: recentQ.data?.totalCount ?? reviews.length,
                  variant: "indigo",
                },
                {
                  value: "vendors",
                  label: "Vendor Ratings",
                  count: vendorsQ.data?.totalCount ?? vendorRows.length,
                  variant: "amber",
                },
              ]}
            />
          </div>

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

              {recentQ.isLoading ? (
               <TableSkeleton columns={6} rows={10} withToolbar />
              ) : recentQ.isError ? (
                <div className="p-6 text-sm text-rose-600">Failed to load reviews.</div>
              ) : (
                <DataTable columns={reviewColumns} data={reviews} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="vendors">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              {vendorsQ.isLoading ? (
                <div className="p-6 text-sm text-zinc-500">Loading vendor ratings…</div>
              ) : vendorsQ.isError ? (
                <div className="p-6 text-sm text-rose-600">Failed to load vendor ratings.</div>
              ) : (
                <DataTable columns={vendorRatingColumns} data={vendorRows} />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}