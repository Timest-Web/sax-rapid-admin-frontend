/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { AppDialog } from "@/components/custom-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/cards/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gavel, Eye } from "lucide-react";

import type { WithdrawalRequest } from "@/src/features/withdrawals/api";
import { useReviewWithdrawal } from "@/src/features/withdrawals/hooks";

function money(amount: number, currency: string) {
  const symbol =
    currency === "NGN" ? "₦" : currency === "ZAR" ? "R" : currency === "USD" ? "$" : "";
  return `${symbol}${Number(amount ?? 0).toLocaleString()}`;
}

function dateLabel(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

export function PayoutReviewModal({
  request,
  mode,
}: {
  request: WithdrawalRequest;
  mode: "review" | "view";
}) {
  const [open, setOpen] = useState(false);

  const isReview = mode === "review";

  const [action, setAction] = useState<"Approve" | "Reject" | "Hold">("Approve");
  const [note, setNote] = useState("");

  const reviewM = useReviewWithdrawal();

  const title = isReview ? "Review Withdrawal" : "Withdrawal Details";
  const description = isReview
    ? `Review request from ${request.vendorName}.`
    : `Viewing request from ${request.vendorName}.`;

  const Icon = isReview ? Gavel : Eye;

  const triggerLabel = isReview ? "Review" : "View";

  const canSubmit = useMemo(() => {
    if (!isReview) return false;
    return !!note.trim() && !reviewM.isPending;
  }, [isReview, note, reviewM.isPending]);

  return (
    <>
      <Button
        variant={isReview ? "default" : "outline"}
        size="sm"
        className="h-9 text-xs rounded-lg"
        onClick={() => setOpen(true)}
      >
        <Icon className="mr-2 h-3.5 w-3.5" />
        {triggerLabel}
      </Button>

      <AppDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        icon={<Icon size={16} />}
        size="custom"
        maxWidthClassName="sm:max-w-[560px]"
        footer={
          isReview ? (
            <>
              <Button
                type="submit"
                form="reviewWithdrawalForm"
                className="bg-zinc-900 text-[#D4AF37] px-8 h-11"
                disabled={!canSubmit}
              >
                {reviewM.isPending ? "Submitting..." : "Submit Review"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="px-6 h-11"
                disabled={reviewM.isPending}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="px-6 h-11"
            >
              Close
            </Button>
          )
        }
      >
        {/* Common details block */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-bold text-zinc-900">{request.vendorName}</div>
            <StatusBadge
              status={request.status}
              styles={{
                Pending: "bg-amber-50 text-amber-700 border-amber-200",
                Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
                Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
                Failed: "bg-rose-50 text-rose-700 border-rose-200",
                Rejected: "bg-rose-50 text-rose-700 border-rose-200",
                "On Hold": "bg-blue-50 text-blue-700 border-blue-200",
              }}
            />
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 text-xs text-zinc-700 space-y-2">
            <div className="flex justify-between gap-4">
              <span className="text-zinc-500">Amount</span>
              <span className="font-mono font-bold">{money(request.amount, request.currency)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-zinc-500">Bank</span>
              <span className="font-mono">{request.bankName}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-zinc-500">Account</span>
              <span className="font-mono">
                {request.accountNumber} • {request.accountName}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-zinc-500">Requested</span>
              <span className="font-mono">{dateLabel(request.createdAt)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-zinc-500">Processed</span>
              <span className="font-mono">{dateLabel(request.processedAt)}</span>
            </div>
          </div>

          {/* Review form only in review mode */}
          {isReview && (
            <form
              id="reviewWithdrawalForm"
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                reviewM.mutate(
                  { withdrawalId: request.id, payload: { action, note: note.trim() } },
                  { onSuccess: () => setOpen(false) },
                );
              }}
            >
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Action</Label>
                <Select value={action} onValueChange={(v) => setAction(v as any)}>
                  <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Approve">Approve</SelectItem>
                    <SelectItem value="Reject">Reject</SelectItem>
                    <SelectItem value="Hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">
                  Note <span className="text-rose-600">*</span>
                </Label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-27.5 bg-zinc-50/50 border-zinc-200"
                  placeholder="Reason / admin note..."
                />
              </div>
            </form>
          )}
        </div>
      </AppDialog>
    </>
  );
}