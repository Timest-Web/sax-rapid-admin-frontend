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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Ban, Banknote, Gavel, Truck } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is installed, or use alert

// ─── 1. CANCEL ORDER MODAL ───
export function CancelOrderModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      toast.success("Order cancelled successfully");
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Ban className="mr-2 h-3 w-3" /> Cancel Order
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
          <DialogDescription>
            This will cancel the order and notify the customer. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Reason for Cancellation</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stock">Out of Stock</SelectItem>
                <SelectItem value="fraud">Suspected Fraud</SelectItem>
                <SelectItem value="customer">Customer Request</SelectItem>
                <SelectItem value="price">Pricing Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Internal Note</Label>
            <Textarea
              placeholder="Add details for the audit log..."
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Back
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 2. PROCESS REFUND MODAL ───
export function RefundModal({ maxAmount }: { maxAmount: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hover:bg-zinc-100">
          <Banknote className="mr-2 h-3 w-3" /> Process Refund
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
          <DialogDescription>
            Issue a partial or full refund to the customer&apos;s wallet or original
            payment method.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-600">
            Max Refundable Amount:{" "}
            <span className="font-bold text-zinc-900">{maxAmount}</span>
          </div>
          <div className="space-y-2">
            <Label>Refund Amount (₦)</Label>
            <Input placeholder="0.00" className="font-mono text-lg" />
          </div>
          <div className="space-y-2">
            <Label>Reason</Label>
            <Input placeholder="e.g. Item returned damaged" />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="default"
            onClick={() => {
              setOpen(false);
              toast.success("Refund processed");
            }}
          >
            Issue Refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 3. RESOLVE DISPUTE MODAL ───
export function ResolveDisputeModal() {
  const [open, setOpen] = useState(false);
  const [verdict, setVerdict] = useState("buyer");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full h-8 text-xs">
          <Gavel className="mr-2 h-3 w-3" /> Resolve Dispute
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Dispute Resolution</DialogTitle>
          <DialogDescription>
            Review the case and decide who receives the funds.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <RadioGroup
            defaultValue="buyer"
            onValueChange={setVerdict}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem
                value="buyer"
                id="r-buyer"
                className="peer sr-only"
              />
              <Label
                htmlFor="r-buyer"
                className="flex flex-col items-center justify-between rounded-md border-2 border-zinc-100 bg-white p-4 hover:bg-zinc-50 peer-data-[state=checked]:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500 cursor-pointer"
              >
                <span className="mb-2 text-sm font-bold">Refund Buyer</span>
                <span className="text-[10px] text-zinc-500 text-center">
                  Funds returned to customer wallet. Items may be returned.
                </span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="vendor"
                id="r-vendor"
                className="peer sr-only"
              />
              <Label
                htmlFor="r-vendor"
                className="flex flex-col items-center justify-between rounded-md border-2 border-zinc-100 bg-white p-4 hover:bg-zinc-50 peer-data-[state=checked]:border-[#EAB308] [&:has([data-state=checked])]:border-[#EAB308] cursor-pointer"
              >
                <span className="mb-2 text-sm font-bold">
                  Release to Vendor
                </span>
                <span className="text-[10px] text-zinc-500 text-center">
                  Dispute rejected. Funds released to vendor wallet.
                </span>
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label>Resolution Note (Sent to both parties)</Label>
            <Textarea
              placeholder="Explain your decision..."
              className="h-20 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="default"
            onClick={() => {
              setOpen(false);
              toast.success("Dispute Resolved");
            }}
          >
            Confirm Decision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 4. UPDATE STATUS MODAL ───
export function UpdateStatusModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-[10px] font-bold uppercase tracking-wider text-[#EAB308] hover:underline flex items-center gap-1">
          <Truck size={12} /> Update Status
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>New Status</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tracking Number (Optional)</Label>
            <Input placeholder="e.g. FEDEX-12345" className="font-mono" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="default" onClick={() => setOpen(false)}>
            Save Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
