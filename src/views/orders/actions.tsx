/* eslint-disable react/no-unescaped-entities */
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
import { toast } from "sonner";

// ─── CANCEL ORDER MODAL ───
export function CancelOrderModal({ onCancel }: { onCancel: (reason: string) => void }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    if (!reason) return;
    setLoading(true);
    setTimeout(() => {
      onCancel(reason);
      setLoading(false);
      setOpen(false);
      toast.success("Order cancelled successfully");
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold uppercase tracking-widest text-xs h-9 rounded-lg">
          <Ban className="mr-2 h-3.5 w-3.5" /> Cancel Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-700" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
                <Ban size={16} />
              </div>
              Cancel Order
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              This will cancel the order and notify the customer. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Reason for Cancellation <span className="text-rose-500">*</span>
            </Label>
            <Select onValueChange={setReason}>
              <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 rounded-lg focus:ring-rose-500 text-sm">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                <SelectItem value="Suspected Fraud">Suspected Fraud</SelectItem>
                <SelectItem value="Customer Request">Customer Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Internal Note</Label>
            <Textarea placeholder="Add details for the audit log..." className="h-24 resize-none bg-zinc-50/50 border-zinc-200 rounded-lg focus-visible:ring-rose-500 text-sm" />
          </div>
        </div>
        <DialogFooter className="p-6 pt-0 sm:justify-between flex-row-reverse">
          <Button variant="destructive" onClick={handleConfirm} disabled={!reason || loading} className="font-bold uppercase tracking-widest text-xs h-11 px-6 rounded-xl transition-all">
            {loading ? "Processing..." : "Confirm Cancel"}
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)} className="font-bold uppercase tracking-widest text-xs h-11 px-6 rounded-xl border-zinc-200 hover:bg-zinc-50">
            Back
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── PROCESS REFUND MODAL ───
export function RefundModal({ maxAmount, onRefund }: { maxAmount: string; onRefund: (amt: string) => void }) {
  const [open, setOpen] = useState(false);
  const [amt, setAmt] = useState("");

  const handleConfirm = () => {
    onRefund(amt || maxAmount);
    setOpen(false);
    toast.success("Refund processed");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-bold uppercase tracking-widest text-xs h-9 rounded-lg">
          <Banknote className="mr-2 h-3.5 w-3.5 text-[#D4AF37]" /> Process Refund
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Banknote size={16} />
              </div>
              Process Refund
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              Issue a partial or full refund to the customer's wallet or original payment method.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6 space-y-5">
          <div className="p-4 bg-zinc-900 rounded-xl text-xs text-[#D4AF37] flex justify-between items-center shadow-sm">
            <span className="font-bold uppercase tracking-widest text-[10px] text-zinc-400">Max Refundable:</span>
            <span className="font-mono font-bold text-base">{maxAmount}</span>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Refund Amount</Label>
            <Input 
              placeholder={maxAmount.replace(/[^0-9.]/g, '')} 
              value={amt} 
              onChange={(e) => setAmt(e.target.value)} 
              className="h-11 font-mono text-lg bg-zinc-50/50 border-zinc-200 rounded-lg focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37]" 
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Reason</Label>
            <Input placeholder="e.g. Item returned damaged" className="h-11 bg-zinc-50/50 border-zinc-200 rounded-lg focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] text-sm" />
          </div>
        </div>
        <DialogFooter className="p-6 pt-0">
          <Button onClick={handleConfirm} className="w-full bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 rounded-xl transition-all shadow-md">
            Issue Refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── RESOLVE DISPUTE MODAL ───
export function ResolveDisputeModal({ onResolve }: { onResolve: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [verdict, setVerdict] = useState("Refund Buyer");

  const handleConfirm = () => {
    onResolve(verdict);
    setOpen(false);
    toast.success("Dispute Resolved");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full h-10 text-xs font-bold uppercase tracking-widest rounded-xl">
          <Gavel className="mr-2 h-3.5 w-3.5" /> Resolve Dispute
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Gavel size={16} />
              </div>
              Dispute Resolution
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              Review the case and decide who receives the funds. Notifications will be sent automatically.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6 space-y-6">
          <RadioGroup defaultValue={verdict} onValueChange={setVerdict} className="grid grid-cols-2 gap-4">
            <div>
              <RadioGroupItem value="Refund Buyer" id="r-buyer" className="peer sr-only" />
              <Label htmlFor="r-buyer" className="flex flex-col items-center justify-center text-center rounded-xl border-2 border-zinc-100 bg-zinc-50/50 p-5 hover:bg-zinc-100 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 cursor-pointer transition-all h-full">
                <span className="mb-2 text-xs uppercase tracking-widest font-bold text-zinc-900">Refund Buyer</span>
                <span className="text-[10px] text-zinc-500 leading-relaxed">Funds returned to customer wallet.</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="Release to Vendor" id="r-vendor" className="peer sr-only" />
              <Label htmlFor="r-vendor" className="flex flex-col items-center justify-center text-center rounded-xl border-2 border-zinc-100 bg-zinc-50/50 p-5 hover:bg-zinc-100 peer-data-[state=checked]:border-[#D4AF37] peer-data-[state=checked]:bg-[#D4AF37]/10 cursor-pointer transition-all h-full">
                <span className="mb-2 text-xs uppercase tracking-widest font-bold text-zinc-900">Release to Vendor</span>
                <span className="text-[10px] text-zinc-500 leading-relaxed">Dispute rejected. Funds released to vendor.</span>
              </Label>
            </div>
          </RadioGroup>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Resolution Note</Label>
            <Textarea placeholder="Explain your decision..." className="h-24 resize-none bg-zinc-50/50 border-zinc-200 rounded-lg focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] text-sm" />
          </div>
        </div>
        <DialogFooter className="p-6 pt-0">
          <Button onClick={handleConfirm} className="w-full bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 rounded-xl transition-all shadow-md">
            Confirm Decision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── UPDATE STATUS MODAL ───
export function UpdateStatusModal({ currentStatus, onUpdate }: { currentStatus: string; onUpdate: (s: string, t?: string) => void }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [tracking, setTracking] = useState("");

  const handleConfirm = () => {
    onUpdate(status, tracking);
    setOpen(false);
    toast.success("Status updated");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] hover:underline flex items-center gap-1 bg-zinc-900 px-3 py-1.5 rounded-lg transition-colors">
          <Truck size={12} /> Update Status
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Truck size={16} />
              </div>
              Update Order Status
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">New Status</Label>
            <Select onValueChange={setStatus} defaultValue={status}>
              <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 rounded-lg focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="On-Hold">On-Hold</SelectItem>
                <SelectItem value="Dispute">Dispute Raised</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {status === "Shipped" && (
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tracking Number</Label>
              <Input placeholder="e.g. FEDEX-12345" value={tracking} onChange={(e) => setTracking(e.target.value)} className="h-11 font-mono text-sm bg-zinc-50/50 border-zinc-200 rounded-lg focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37]" />
            </div>
          )}
        </div>
        <DialogFooter className="p-6 pt-0">
          <Button onClick={handleConfirm} className="w-full bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 rounded-xl transition-all shadow-md">
            Save Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}