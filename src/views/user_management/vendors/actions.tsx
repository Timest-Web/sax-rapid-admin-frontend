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
import { toast } from "sonner";

export function ApproveVendorModal({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  const handleApprove = () => {
    toast.success(`${name} has been approved as a vendor.`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gold" size="sm">
          <CheckCircle className="mr-2 h-3 w-3" /> Approve Vendor
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Approve Application</DialogTitle>
          <DialogDescription>
            This will activate the store for <strong>{name}</strong>. They will
            be notified via email.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="gold" onClick={handleApprove}>
            Confirm Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RejectVendorModal({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  const handleReject = () => {
    toast.error(`Application for ${name} rejected.`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
        >
          <XCircle className="mr-2 h-3 w-3" /> Reject Application
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Reject Application</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting <strong>{name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="e.g. Invalid ID document..."
            className="resize-none"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReject}>
            Reject Vendor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SuspendStoreModal({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <ShieldBan className="mr-2 h-3 w-3" /> Suspend Store
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Suspend Store</DialogTitle>
          <DialogDescription>
            This will temporarily hide <strong>{name}</strong> and all its
            products from the marketplace.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Reason for suspension..."
            className="resize-none"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              toast.success("Store suspended");
              setOpen(false);
            }}
          >
            Confirm Suspension
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
