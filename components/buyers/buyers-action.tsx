/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { RefreshCw, ShieldBan, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Shared styles ───
const fieldLabel = "text-[10px] font-semibold uppercase tracking-widest text-zinc-400";
const inputBase  = "bg-zinc-50 border-zinc-200 text-zinc-800 placeholder:text-zinc-400 font-mono text-xs focus:border-zinc-400 focus:ring-0";


// ─── 1. SUSPEND USER MODAL ───
export function SuspendUserModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSuspend = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => {
        setOpen(false);
        setDone(false);
      }, 1200);
    }, 1400);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 hover:text-red-600 hover:border-red-300 font-semibold text-xs tracking-wide"
        >
          <ShieldBan className="mr-2 h-3.5 w-3.5" /> Suspend User
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white border border-zinc-200 shadow-xl shadow-zinc-200/60 p-7 gap-0 max-w-[440px]">
        {/* Icon */}
        <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mb-5">
          <ShieldBan className="h-5 w-5 text-red-500" />
        </div>

        <DialogHeader className="space-y-1 mb-5">
          <DialogTitle className="text-lg font-bold tracking-tight text-zinc-900">
            Suspend Account
          </DialogTitle>
          <DialogDescription className="text-zinc-400 font-mono text-xs leading-relaxed">
            This will immediately revoke platform access for this user.
          </DialogDescription>
        </DialogHeader>

        {/* Warning strip */}
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
          <AlertTriangle className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
          <p className="text-xs font-mono text-red-500 leading-relaxed">
            All active sessions will be terminated. The user will be notified by email.
          </p>
        </div>

        <div className="h-px bg-zinc-100 mb-5" />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className={fieldLabel}>Reason</Label>
            <Select>
              <SelectTrigger className={cn(inputBase, "h-9")}>
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-zinc-200 text-zinc-800 font-mono text-xs">
                <SelectItem value="fraud">Fraudulent Activity</SelectItem>
                <SelectItem value="abuse">Abusive Behavior</SelectItem>
                <SelectItem value="payment">Payment Issues</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className={fieldLabel}>Internal Notes</Label>
            <Textarea
              placeholder="Add context for the moderation log..."
              className={cn(inputBase, "resize-none min-h-[80px] leading-relaxed")}
            />
            <p className="text-[10px] text-zinc-400 font-mono">Not visible to the user.</p>
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2 flex-row">
          <Button
            variant="ghost"
            className="flex-1 border border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 text-xs"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className={cn(
              "flex-1 text-xs font-semibold tracking-wide transition-all",
              done
                ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            )}
            onClick={handleSuspend}
            disabled={loading || done}
          >
            {done ? "✓ Suspended" : loading ? "Suspending..." : "Confirm Suspension"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


// ─── 2. RESET PASSWORD MODAL ───
export function ResetPasswordModal() {
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [open, setOpen]       = useState(false);

  const handleReset = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => { setOpen(false); setDone(false); }, 1200);
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="border border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 font-semibold text-xs tracking-wide"
        >
          <RefreshCw className="mr-2 h-3.5 w-3.5" /> Reset Password
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white border border-zinc-200 shadow-xl shadow-zinc-200/60 p-7 gap-0 max-w-[440px]">
        {/* Icon */}
        <div className="w-11 h-11 rounded-xl bg-black/5 border border-black flex items-center justify-center mb-5 text-lg">
          🔑
        </div>

        <DialogHeader className="space-y-1 mb-5">
          <DialogTitle className="text-lg font-bold tracking-tight text-zinc-900">
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-zinc-400 font-mono text-xs leading-relaxed">
            Send a secure reset link to the user's registered email.
          </DialogDescription>
        </DialogHeader>

        <div className="h-px bg-zinc-100 mb-5" />

        {/* Info box */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3.5 font-mono text-xs text-zinc-500 leading-relaxed">
          A reset link will be sent to{" "}
          <span className="text-zinc-900 font-medium">user@email.com</span>.<br />
          Valid for <span className="text-zinc-900 font-medium">24 hours</span> · Single use · Invalidates existing sessions.
        </div>

        <div className="space-y-2 mt-4">
          <Label className={fieldLabel}>Notification Method</Label>
          <Select defaultValue="email">
            <SelectTrigger className={cn(inputBase, "h-9")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-zinc-200 text-zinc-800 font-mono text-xs">
              <SelectItem value="email">Email only</SelectItem>
              <SelectItem value="sms">SMS + Email</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="mt-6 gap-2 flex-row">
          <Button
            variant="ghost"
            className="border border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 text-xs"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className={cn(
              "flex-1 text-xs font-semibold tracking-wide",
              done
                ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                : "bg-black hover:bg-black/70 hover:text-white text-white"
            )}
            onClick={handleReset}
            disabled={loading || done}
          >
            {done ? "✓ Link Sent" : loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


// ─── 3. CREDIT WALLET MODAL ───
export function CreditWalletModal() {
  const [open, setOpen]       = useState(false);
  const [type, setType]       = useState<"credit" | "debit">("credit");
  const [amount, setAmount]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const isDebit   = type === "debit";
  const numAmount = parseFloat(amount) || 0;
  const preview   = numAmount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleProcess = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => {
        setOpen(false);
        setDone(false);
        setAmount("");
        setType("credit");
      }, 1000);
    }, 1300);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 hover:text-amber-700 hover:border-amber-300 font-semibold text-xs tracking-wide"
        >
          ₦ Credit Wallet
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white border border-zinc-200 shadow-xl shadow-zinc-200/60 p-7 gap-0 max-w-[440px]">
        {/* Icon */}
        <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-5 font-semibold text-amber-600 text-lg">
          ₦
        </div>

        <DialogHeader className="space-y-1 mb-5">
          <DialogTitle className="text-lg font-bold tracking-tight text-zinc-900">
            Wallet Transaction
          </DialogTitle>
          <DialogDescription className="text-zinc-400 font-mono text-xs leading-relaxed">
            Manually adjust this user's wallet balance.
          </DialogDescription>
        </DialogHeader>

        <div className="h-px bg-zinc-100 mb-5" />

        <div className="space-y-4">
          {/* Toggle */}
          <div className="space-y-2">
            <Label className={fieldLabel}>Transaction Type</Label>
            <div className="flex bg-zinc-50 border border-zinc-200 rounded-lg p-1 gap-1">
              {(["credit", "debit"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "flex-1 py-2 rounded-md text-xs font-semibold tracking-wide transition-all",
                    type === t && t === "credit" && "bg-amber-50 text-amber-600 border border-amber-200 shadow-sm",
                    type === t && t === "debit"  && "bg-red-50 text-red-500 border border-red-200 shadow-sm",
                    type !== t && "text-zinc-400 hover:text-zinc-600"
                  )}
                >
                  {t === "credit" ? "+ Credit" : "− Debit"}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label className={fieldLabel}>Amount (₦)</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={cn(inputBase, "h-9")}
            />
          </div>

          {/* Preview */}
          <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Preview</span>
            <span className={cn(
              "font-mono text-xl font-semibold",
              isDebit ? "text-red-500" : "text-amber-600"
            )}>
              {isDebit ? "−" : "+"}₦{preview}
            </span>
          </div>

          {/* Reference */}
          <div className="space-y-2">
            <Label className={fieldLabel}>Reference Note</Label>
            <Input
              placeholder="e.g. Refund for Order #8821"
              className={cn(inputBase, "h-9")}
            />
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2 flex-row">
          <Button
            variant="ghost"
            className="border border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 text-xs"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className={cn(
              "flex-1 text-xs font-semibold tracking-wide transition-all",
              done
                ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                : isDebit
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            )}
            onClick={handleProcess}
            disabled={loading || done}
          >
            {done ? "✓ Done" : loading ? "Processing..." : "Process Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}