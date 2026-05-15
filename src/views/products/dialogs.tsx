"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Flag, XCircle } from "lucide-react";
import { useApproveProduct, useFlagProduct, useRejectProduct } from "@/src/features/products/hooks";


export function ApproveProductDialog({
  open,
  onOpenChange,
  productId,
  name,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  productId: string;
  name: string;
}) {
  const approve = useApproveProduct();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Approve Product
          </DialogTitle>
          <DialogDescription>
            This will set <strong>{name}</strong> to <strong>Active</strong> (approved).
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={approve.isPending}>
            Cancel
          </Button>
          <Button
            variant="gold"
            disabled={approve.isPending}
            onClick={() =>
              approve.mutate(productId, {
                onSuccess: () => onOpenChange(false),
              })
            }
          >
            {approve.isPending ? "Approving..." : "Confirm Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FlagProductDialog({
  open,
  onOpenChange,
  productId,
  name,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  productId: string;
  name: string;
}) {
  const flag = useFlagProduct();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-4 w-4" /> Flag for Review
          </DialogTitle>
          <DialogDescription>
            This will set <strong>{name}</strong> to <strong>Pending</strong>.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={flag.isPending}>
            Cancel
          </Button>
          <Button
            variant="outline"
            disabled={flag.isPending}
            onClick={() =>
              flag.mutate(productId, {
                onSuccess: () => onOpenChange(false),
              })
            }
          >
            {flag.isPending ? "Flagging..." : "Confirm Flag"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RejectProductDialog({
  open,
  onOpenChange,
  productId,
  name,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  productId: string;
  name: string;
}) {
  const reject = useRejectProduct();
  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-4 w-4" /> Reject Product
          </DialogTitle>
          <DialogDescription>
            Provide a reason for rejecting <strong>{name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Incomplete description, misleading price, prohibited item..."
            className="resize-none"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={reject.isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!reason.trim() || reject.isPending}
            onClick={() =>
              reject.mutate(
                { productId, reason: reason.trim() },
                {
                  onSuccess: () => {
                    setReason("");
                    onOpenChange(false);
                  },
                }
              )
            }
          >
            {reject.isPending ? "Rejecting..." : "Confirm Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}