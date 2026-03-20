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
import { RefreshCw, ShieldBan, Wallet } from "lucide-react";

// ─── 1. SUSPEND USER MODAL ───
export function SuspendUserModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSuspend = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      alert("User has been suspended.");
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <ShieldBan className="mr-2 h-3 w-3" /> Suspend User
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Suspend Account</DialogTitle>
          <DialogDescription>
            Are you sure? This will block the user from accessing the platform.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Reason for Suspension</Label>
            <Select>
              <SelectTrigger className="font-mono text-xs">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fraud">Fraudulent Activity</SelectItem>
                <SelectItem value="abuse">Abusive Behavior</SelectItem>
                <SelectItem value="payment">Payment Issues</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea placeholder="Enter details..." className="resize-none font-mono text-xs" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleSuspend} disabled={loading}>
            {loading ? "Suspending..." : "Confirm Suspension"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 2. RESET PASSWORD MODAL ───
export function ResetPasswordModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-3 w-3" /> Reset Password
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            This will send a password reset link to the user&apos;s email address.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <p className="text-sm text-zinc-600 bg-zinc-50 p-4 rounded border border-zinc-100">
                A link will be sent to <span className="font-bold text-zinc-900">user@email.com</span>. 
                They will have 24 hours to create a new password.
            </p>
        </div>
        <DialogFooter>
          <Button variant="default">Send Reset Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── 3. CREDIT WALLET MODAL ───
export function CreditWalletModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="gold" className="w-full text-[10px] h-8">Credit Wallet</Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200">
        <DialogHeader>
          <DialogTitle>Fund Wallet</DialogTitle>
          <DialogDescription>
            Manually add or deduct funds from this user's wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Action Type</Label>
                <Select defaultValue="credit">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="credit">Credit (Add)</SelectItem>
                        <SelectItem value="debit">Debit (Remove)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Amount (₦)</Label>
                <Input placeholder="0.00" className="font-mono" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reference Note</Label>
            <Input placeholder="e.g. Refund for Order #8821" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="default" className="w-full">Process Transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}