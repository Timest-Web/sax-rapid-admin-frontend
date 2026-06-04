"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Store } from "lucide-react";

import { useDispute, useResolveDispute } from "@/src/features/disputes/hooks";

export default function DisputeDetailsView() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data: dispute, isLoading } = useDispute(id);
  const resolveMutation = useResolveDispute();

  const [adminNotes, setAdminNotes] = useState("");

  const caseStatus = useMemo(() => {
    const s = (dispute?.status ?? "").toLowerCase();
    if (s.includes("resolve")) return "resolved";
    if (s.includes("open")) return "open";
    return "open";
  }, [dispute?.status]);

  const resolveCase = async (decision: "refund" | "vendor") => {
    if (!dispute?.caseId) return;

    await resolveMutation.mutateAsync({
      caseId: dispute.caseId,
      body: {
        action: decision === "refund" ? "RefundBuyer" : "ReleaseToVendor",
        adminNotes,
      },
    });
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!dispute) return <div className="p-6">Dispute not found</div>;

  return (
    <div className="p-6">
      <div className="mb-4">
        <div className="text-sm font-bold">Case #{dispute.caseId}</div>
        <div className="text-xs text-zinc-500">Status: {dispute.status}</div>
        <div className="text-xs text-zinc-500">Order: {dispute.orderNumber}</div>
        <div className="text-xs text-zinc-500">Reason: {dispute.reason}</div>
      </div>

      {caseStatus === "open" ? (
        <div className="space-y-3">
          <Textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Admin notes..."
          />

          <div className="flex gap-2">
            <Button
              disabled={resolveMutation.isPending}
              onClick={() => resolveCase("refund")}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Refund Buyer
            </Button>

            <Button
              disabled={resolveMutation.isPending}
              onClick={() => resolveCase("vendor")}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Store className="mr-2 h-4 w-4" />
              Release to Vendor
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-zinc-600">
          Resolution complete (resolvedAt: {dispute.resolvedAt ?? "—"})
        </div>
      )}
    </div>
  );
}