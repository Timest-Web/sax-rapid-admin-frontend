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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, PauseCircle } from "lucide-react";
import { toast } from "sonner";

interface PayoutRequest {
  id: string;
  vendor: string;
  amount: string;
  bank: string;
}

export function PayoutReviewModal({ request }: { request: PayoutRequest }) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("approve"); // approve | reject | hold
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    // In real app: call API
    toast.success(`Payout ${action.toUpperCase()} successfully`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="h-8 text-[10px]">
          Review Request
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Review Payout Request</DialogTitle>
          <DialogDescription>
            Request ID:{" "}
            <span className="font-mono font-bold text-zinc-900">
              {request.id}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Summary Card */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase">
                Amount Requested
              </p>
              <p className="text-2xl font-bold font-mono text-zinc-900">
                {request.amount}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-900">
                {request.vendor}
              </p>
              <p className="text-[10px] font-mono text-zinc-500">
                {request.bank}
              </p>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="space-y-3">
            <Label>Select Decision</Label>
            <Tabs value={action} onValueChange={setAction} className="w-full">
              <TabsList className="w-full grid grid-cols-3 h-10 bg-zinc-100 p-1">
                <TabsTrigger
                  value="approve"
                  className="text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Approve
                </TabsTrigger>
                <TabsTrigger
                  value="hold"
                  className="text-xs font-bold data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                >
                  Hold
                </TabsTrigger>
                <TabsTrigger
                  value="reject"
                  className="text-xs font-bold data-[state=active]:bg-rose-600 data-[state=active]:text-white"
                >
                  Reject
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Dynamic Note Field */}
          <div className="space-y-2">
            <Label>
              {action === "approve"
                ? "Transaction Ref (Optional)"
                : "Reason for Rejection/Hold"}
            </Label>
            <Textarea
              placeholder={
                action === "approve" ? "Enter bank ref ID..." : "Explain why..."
              }
              className="resize-none"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className={`
               ${action === "approve" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
               ${action === "reject" ? "bg-rose-600 hover:bg-rose-700 text-white" : ""}
               ${action === "hold" ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
             `}
            onClick={handleSubmit}
          >
            {action === "approve" && <CheckCircle className="mr-2 h-4 w-4" />}
            {action === "reject" && <XCircle className="mr-2 h-4 w-4" />}
            {action === "hold" && <PauseCircle className="mr-2 h-4 w-4" />}
            Confirm {action.charAt(0).toUpperCase() + action.slice(1)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
