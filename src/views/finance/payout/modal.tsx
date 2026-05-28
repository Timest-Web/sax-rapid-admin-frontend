/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { AppDialog } from "@/components/custom-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gavel } from "lucide-react";

import type { WithdrawalRequest } from "@/src/features/withdrawals/api";
import { useReviewWithdrawal } from "@/src/features/withdrawals/hooks";

export function PayoutReviewModal({ request }: { request: WithdrawalRequest }) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<"Approve" | "Reject" | "Hold">("Approve");
  const [note, setNote] = useState("");

  const reviewM = useReviewWithdrawal();

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      title="Review Withdrawal"
      description={`Review request from ${request.vendorName}.`}
      icon={<Gavel size={16} />}
      size="custom"
      maxWidthClassName="sm:max-w-[560px]"
      footer={
        <>
          <Button
            type="submit"
            form="reviewWithdrawalForm"
            className="bg-zinc-900 text-[#D4AF37] px-8 h-11"
            disabled={reviewM.isPending || !note.trim()}
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
      }
    >
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
    </AppDialog>
  );
}