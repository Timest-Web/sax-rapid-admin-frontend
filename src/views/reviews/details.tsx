"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useParams } from "next/navigation";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/cards/status-badge";

import { Star, ArrowLeft, Flag, User, Package, Store } from "lucide-react";

import { useReview, useFlagReview } from "@/src/features/reviews/hooks";
import { DetailsPageSkeleton } from "@/components/skeletons/details";

function dateLabel(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

function Stars({ rating }: { rating: number }) {
  const r = Math.max(0, Math.min(5, Number(rating ?? 0)));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < Math.round(r) ? "text-[#D4AF37] fill-[#D4AF37]" : "text-zinc-300"}
        />
      ))}
      <span className="ml-2 text-xs font-mono text-zinc-600">{r.toFixed(1)}</span>
    </div>
  );
}

export default function ReviewDetailsView() {
  const params = useParams();
  const raw = (params as any)?.reviewId ?? (params as any)?.id;
  const reviewId = Array.isArray(raw) ? raw[0] : raw;

  const reviewQ = useReview(reviewId);
  const flagM = useFlagReview();

  // local UI status if backend doesn't provide isFlagged
  const [flaggedLocal, setFlaggedLocal] = useState(false);

  const review = reviewQ.data;

  const isFlagged = Boolean((review as any)?.isFlagged ?? flaggedLocal);
  const statusLabel = isFlagged ? "Flagged" : "Active";

  const avatarUrl = review?.userAvatarUrl || null;

  const canFlag = !!reviewId && !flagM.isPending;

  if (!reviewId) {
    return (
      <div className="min-h-screen bg-zinc-50 p-10 text-sm text-rose-600">
        Missing reviewId in route.
      </div>
    );
  }

  if (reviewQ.isLoading) return <DetailsPageSkeleton />;

  if (reviewQ.isError || !review) {
    return (
      <div className="min-h-screen bg-zinc-50 p-10">
        <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3 max-w-xl">
          <p className="text-sm text-rose-600 font-semibold">
            Review not found or failed to load.
          </p>
          <Link href="/admin/reviews" className="text-xs underline text-zinc-700">
            Back to Reviews
          </Link>
        </div>
      </div>
    );
  }

  const productTitle =
    (review.productName && review.productName.trim()) ||
    (review.productSlug && review.productSlug.trim()) ||
    "—";

  // keep your existing product route by ID
  const productHref = `/admin/products/${review.productId}`;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-10">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Link
              href="/admin/reviews"
              className="hover:text-zinc-900 transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} /> REVIEWS
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-mono">{review.id.slice(0, 8)}</span>
            <StatusBadge status={statusLabel} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg border-zinc-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
            disabled={!canFlag}
            onClick={() => {
              flagM.mutate(review.id, {
                onSuccess: () => setFlaggedLocal(true),
              });
            }}
          >
            <Flag className="mr-2 h-3.5 w-3.5" />
            {flagM.isPending ? "Flagging..." : isFlagged ? "Flagged" : "Flag Review"}
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto space-y-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* User card */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={review.userName}/>
                ) : (
                  <User className="text-zinc-400" size={22} />
                )}
              </div>

              <div className="min-w-0">
                <div className="font-bold text-zinc-900 truncate">{review.userName}</div>
                <div className="text-[10px] font-mono text-zinc-500 truncate">
                  {review.userId}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-zinc-100 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Country
                </span>
                <span className="text-xs font-mono text-zinc-900 text-right">
                  {(review.userCountry || "—")}
                  {review.userCountryCode ? ` (${review.userCountryCode})` : ""}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Verified purchase
                </span>
                <span className="text-xs font-mono text-zinc-900">
                  {review.isVerifiedPurchase ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Review card */}
          <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Rating
                </div>
                <Stars rating={review.rating} />
              </div>

              <div className="text-right text-[11px] text-zinc-500 font-mono">
                <div>Created: {dateLabel(review.createdAt)}</div>
                <div>Updated: {dateLabel(review.updatedAt)}</div>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-zinc-100">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                Comment
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {review.comment || "—"}
              </p>
            </div>

            {/* Product/Vendor */}
            <div className="mt-5 pt-5 border-t border-zinc-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {review.vendorImageUrl ? (
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                    <Image
                      src={review.vendorImageUrl}
                      alt={review.vendorName ?? "Vendor"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                    <Store size={14} className="text-zinc-400" />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-900 truncate">
                    {productTitle}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono truncate">
                    Vendor: {review.vendorName ?? "—"}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono truncate">
                    Product ID: {review.productId}
                  </div>
                </div>
              </div>

              <Link
                href={productHref}
                className="shrink-0 text-xs font-bold uppercase tracking-widest text-blue-600 hover:underline inline-flex items-center gap-2"
              >
                <Package size={14} />
                View Product
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}