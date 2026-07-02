"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, ShieldBan } from "lucide-react";
import {
  useApproveVendor,
  useRejectVendor,
  useSuspendVendor,
} from "@/src/features/vendors/hooks";

export function ApproveVendorModal({
  vendorProfileId,
  name,
}: {
  vendorProfileId: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const approve = useApproveVendor();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gold" size="sm" disabled={approve.isPending}>
          <CheckCircle className="mr-2 h-3 w-3" />
          {approve.isPending ? "Approving..." : "Approve Vendor"}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Approve Application</DialogTitle>
          <DialogDescription>
            This will approve <strong>{name}</strong> and grant Vendor access.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={approve.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="gold"
            disabled={approve.isPending}
            onClick={() => approve.mutate(vendorProfileId, { onSuccess: () => setOpen(false) })}
          >
            Confirm Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RejectVendorModal({
  vendorProfileId,
  name,
}: {
  vendorProfileId: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const reject = useRejectVendor();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
          disabled={reject.isPending}
        >
          <XCircle className="mr-2 h-3 w-3" />
          {reject.isPending ? "Rejecting..." : "Reject Application"}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Reject Application</DialogTitle>
          <DialogDescription>
            Provide a reason for rejecting <strong>{name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Invalid registration document..."
            className="resize-none"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={reject.isPending}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={!reason.trim() || reject.isPending}
            onClick={() => {
              reject.mutate(
                { vendorProfileId, reason: reason.trim() }, // ✅ fixed
                {
                  onSuccess: () => {
                    setOpen(false);
                    setReason("");
                  },
                },
              );
            }}
          >
            Reject Vendor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SuspendStoreModal({
  vendorProfileId,
  name,
}: {
  vendorProfileId: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const suspend = useSuspendVendor();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={suspend.isPending}>
          <ShieldBan className="mr-2 h-3 w-3" />
          {suspend.isPending ? "Suspending..." : "Suspend Store"}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Suspend Store</DialogTitle>
          <DialogDescription>
            This will suspend <strong>{name}</strong> and prevent selling.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for suspension..."
            className="resize-none"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={suspend.isPending}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={!reason.trim() || suspend.isPending}
            onClick={() => {
              suspend.mutate(
                { vendorProfileId, reason: reason.trim() }, // ✅ fixed
                {
                  onSuccess: () => {
                    setOpen(false);
                    setReason("");
                  },
                },
              );
            }}
          >
            Confirm Suspension
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}