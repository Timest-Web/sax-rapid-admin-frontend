"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  ArrowLeft,
  CheckCircle2,
  Store,
  FileText,
  ShieldAlert,
  Receipt,
  Calendar,
} from "lucide-react";

import { StatusBadge } from "@/components/cards/status-badge";
import { DetailsPageSkeleton } from "@/components/skeletons/details";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDispute, useResolveDispute } from "@/src/features/disputes/hooks";

function money(amount: number, currency: string) {
  const symbol =
    currency === "NGN" ? "₦" : currency === "ZAR" ? "R" : currency === "USD" ? "$" : "";
  return `${symbol}${Number(amount ?? 0).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
}

function dateLabel(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

function statusTone(status?: string) {
  const s = String(status ?? "").toLowerCase();
  if (s.includes("resolve")) return "Resolved";
  if (s.includes("close")) return "Closed";
  return "Open";
}

function InfoLine({ label, value }: { label: string; value: any }) {
  const text = value === null || value === undefined || value === "" ? "—" : String(value);
  return (
    <div className="flex items-start justify-between gap-6 py-2 border-b border-zinc-100 last:border-0">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        {label}
      </span>
      <span className="text-xs font-mono text-zinc-900 text-right break-all max-w-[70%]">
        {text}
      </span>
    </div>
  );
}

export default function DisputeDetailsView() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data: dispute, isLoading, isError } = useDispute(id);
  const resolveMutation = useResolveDispute();

  const [adminNotes, setAdminNotes] = useState("");

  // confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [decision, setDecision] = useState<"refund" | "vendor" | null>(null);

  const caseStatus = useMemo(() => {
    const s = (dispute?.status ?? "").toLowerCase();
    if (s.includes("resolve")) return "resolved";
    if (s.includes("close")) return "closed";
    return "open";
  }, [dispute?.status]);

  const uiStatusLabel = statusTone(dispute?.status);

  const canResolve = caseStatus === "open";

  const resolveCase = async () => {
    if (!dispute?.caseId || !decision) return;

    await resolveMutation.mutateAsync({
      caseId: dispute.caseId,
      body: {
        action: decision === "refund" ? "RefundBuyer" : "ReleaseToVendor",
        adminNotes: adminNotes.trim() || undefined,
      },
    });

    setConfirmOpen(false);
    setDecision(null);
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-zinc-50 p-10 text-sm text-rose-600">
        Missing dispute id in route.
      </div>
    );
  }

  if (isLoading) return <DetailsPageSkeleton />;

  if (isError || !dispute) {
    return (
      <div className="min-h-screen bg-zinc-50 p-10">
        <div className="max-w-xl bg-white border border-zinc-200 rounded-xl p-6 space-y-3">
          <p className="text-sm text-rose-600 font-semibold">
            Dispute not found or failed to load.
          </p>
          <Link
            href="/admin/disputes"
            className="text-xs underline text-zinc-700 inline-flex items-center gap-1"
          >
            <ArrowLeft size={12} /> Back to Disputes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <button
              onClick={() => router.back()}
              className="hover:text-zinc-900 transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} /> DISPUTES
            </button>
            <span>/</span>
            <span className="text-zinc-900 font-mono">{dispute.caseId}</span>
            <StatusBadge status={uiStatusLabel} />
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg border-zinc-200"
            asChild
          >
            <Link href={`/admin/orders/${dispute.orderId}`}>
              <Receipt className="mr-2 h-3.5 w-3.5" />
              View Order
            </Link>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg border-zinc-200"
            asChild
          >
            <Link href={`/admin/vendors/${(dispute as any)?.vendorId ?? ""}`}>
              <Store className="mr-2 h-3.5 w-3.5" />
              Vendor
            </Link>
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-6 mt-4">
        {/* TOP SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Case summary */}
          <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Dispute Case
                  </div>
                  <div className="text-xl font-bold text-zinc-900 font-display mt-1">
                    {dispute.caseId}
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">
                    <span className="font-semibold text-zinc-900">Reason:</span>{" "}
                    {dispute.reason || "—"}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Disputed Amount
                  </div>
                  <div className="text-2xl font-bold font-mono text-zinc-900 mt-1">
                    {money(dispute.disputedAmount, dispute.currency)}
                  </div>
                  <div className="mt-2">
                    <StatusBadge status={uiStatusLabel} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50/40 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600">
                    <Calendar size={14} /> Timeline
                  </div>
                  <div className="mt-3 space-y-2">
                    <InfoLine label="Created" value={dateLabel(dispute.createdAt)} />
                    <InfoLine label="Resolved" value={dateLabel(dispute.resolvedAt)} />
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50/40 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600">
                    <FileText size={14} /> Order
                  </div>
                  <div className="mt-3 space-y-2">
                    <InfoLine label="Order Number" value={dispute.orderNumber} />
                    <InfoLine label="Order ID" value={dispute.orderId} />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600">
                  <ShieldAlert size={14} /> Notes / Evidence
                </div>
                <p className="mt-3 text-sm text-zinc-700 whitespace-pre-wrap">
                  {dispute.notes || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Action panel */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
              <div className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                Resolution
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                Decide where the funds should go. This action is typically irreversible.
              </p>
            </div>

            <div className="p-6 space-y-4">
              {!canResolve ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  Resolution complete.
                  <div className="text-xs text-emerald-700/80 mt-1">
                    Resolved at: {dateLabel(dispute.resolvedAt)}
                  </div>
                </div>
              ) : null}

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Admin Notes (optional)
                </Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Write notes for audit trail..."
                  className="min-h-28 bg-zinc-50/50 border-zinc-200"
                  disabled={!canResolve || resolveMutation.isPending}
                />
              </div>

              <div className="grid grid-cols-1 gap-2 pt-2">
                <Button
                  disabled={!canResolve || resolveMutation.isPending}
                  onClick={() => {
                    setDecision("refund");
                    setConfirmOpen(true);
                  }}
                  className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-xs rounded-xl"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Refund Buyer
                </Button>

                <Button
                  disabled={!canResolve || resolveMutation.isPending}
                  onClick={() => {
                    setDecision("vendor");
                    setConfirmOpen(true);
                  }}
                  className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-xs rounded-xl"
                >
                  <Store className="mr-2 h-4 w-4" />
                  Release to Vendor
                </Button>
              </div>

              {resolveMutation.isPending ? (
                <div className="text-[11px] text-zinc-500 font-mono">
                  Processing resolution…
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-white border-zinc-200 sm:max-w-[520px] p-0 overflow-hidden rounded-2xl shadow-2xl">
          <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-zinc-900">
                Confirm resolution
              </DialogTitle>
              <DialogDescription className="text-sm text-zinc-600">
                You are about to{" "}
                <span className="font-semibold">
                  {decision === "refund" ? "refund the buyer" : "release funds to the vendor"}
                </span>{" "}
                for case <span className="font-mono">{dispute.caseId}</span>.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 text-sm text-zinc-700">
            Amount:{" "}
            <span className="font-mono font-bold text-zinc-900">
              {money(dispute.disputedAmount, dispute.currency)}
            </span>
          </div>

          <DialogFooter className="p-6 pt-0 sm:justify-between flex-row-reverse">
            <Button
              onClick={resolveCase}
              disabled={resolveMutation.isPending || !decision}
              className="h-11 px-8 bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs rounded-xl"
            >
              {resolveMutation.isPending ? "Confirming..." : "Confirm"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={resolveMutation.isPending}
              className="h-11 px-6 rounded-xl"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}