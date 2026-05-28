"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/cards/stat-card";
import { Ticket, Plus, Search, CheckCircle2, Clock, FileEdit, Gift } from "lucide-react";
import { toast } from "sonner";
import { makeCouponColumns, type CouponRow } from "./column";
import { AddCouponModal } from "./modals";

import { useCoupons, useCouponStats, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from "@/src/features/coupons/hooks";
import type { CreateCouponInput } from "@/src/features/coupons/api";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

export default function CouponsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<CouponRow | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const pageNumber = 1;
  const pageSize = 20;

  const statsQ = useCouponStats();
  const listQ = useCoupons({ pageNumber, pageSize });

  const createM = useCreateCoupon();
  const updateM = useUpdateCoupon();
  const deleteM = useDeleteCoupon();

  const coupons = listQ.data ?? [];

  const filtered = coupons.filter((c) => {
    const t = searchTerm.toLowerCase();
    return (
      c.code.toLowerCase().includes(t) ||
      c.scope.toLowerCase().includes(t) ||
      c.status.toLowerCase().includes(t)
    );
  });

  const columns = useMemo(
    () =>
      makeCouponColumns({
        onEdit: (c) => {
          setEditing(c);
          setIsModalOpen(true);
        },
        onDelete: (id) => {
          const ok = confirm("Delete this coupon?");
          if (!ok) return;
          deleteM.mutate(id);
        },
      }),
    [deleteM],
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-10">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Promotions / Coupons
          </h1>
        </div>

        <Button
          onClick={() => {
            setEditing(null);
            setIsModalOpen(true);
          }}
          className="h-9 text-xs font-bold uppercase tracking-wider bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shadow-sm rounded-lg"
        >
          <Plus className="mr-2 h-3.5 w-3.5" /> Add Coupon
        </Button>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Coupons" value={statsQ.isLoading ? "—" : String(statsQ.data?.totalCoupons ?? 0)} icon={Ticket} variant="default" />
          <StatCard label="Active Now" value={statsQ.isLoading ? "—" : String(statsQ.data?.activeNow ?? 0)} icon={CheckCircle2} variant="emerald" />
          <StatCard label="Expired" value={statsQ.isLoading ? "—" : String(statsQ.data?.expired ?? 0)} icon={Clock} variant="rose" />
          <StatCard label="Drafts" value={statsQ.isLoading ? "—" : String(statsQ.data?.drafts ?? 0)} icon={FileEdit} variant="amber" />
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <Ticket className="mr-2 h-4 w-4" /> Manage Listing
            </div>

            {/* <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search code/scope/status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-9 bg-white border-zinc-200 text-xs focus-visible:ring-[#D4AF37] rounded-xl"
              />
            </div> */}
          </div>

          {listQ.isLoading ? (
            <TableSkeleton columns={columns.length} rows={10} withToolbar={false} />
          ) : listQ.isError ? (
            <div className="p-6 text-sm text-rose-600">Failed to load coupons.</div>
          ) : (
            <DataTable columns={columns} data={filtered} />
          )}
        </div>
      </main>

      <AddCouponModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        icon={<Gift size={16} />}
        initialData={editing}
        isSubmitting={createM.isPending || updateM.isPending}
        onSubmit={(payload, mode) => {
          // mode is "Active" | "Draft"
          const finalPayload: CreateCouponInput = { ...payload, status: mode };

          if (editing) {
            updateM.mutate(
              { couponId: editing.id, payload: finalPayload },
              { onSuccess: () => setIsModalOpen(false) },
            );
          } else {
            createM.mutate(finalPayload, { onSuccess: () => setIsModalOpen(false) });
          }
        }}
      />
    </div>
  );
}