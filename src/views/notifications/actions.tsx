/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Send, RefreshCw, Eye, CheckCircle2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { NotificationDto } from "@/src/features/notifications/api";
import { useAdminSendNotification, useMarkNotificationRead } from "@/src/features/notifications/hooks";

function dateLabel(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

/** ---------- Details Modal ---------- */
export function NotificationDetailsModal({
  open,
  onOpenChange,
  notification,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  notification: NotificationDto | null;
}) {
  const markRead = useMarkNotificationRead();

  if (!notification) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] w-[calc(100vw-2rem)] max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col">
        {/* header */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Eye size={16} />
              </div>
              Notification Details
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              {notification.type} • {dateLabel(notification.createdAt)}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Title</p>
            <p className="font-bold text-zinc-900">{notification.title}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Message</p>
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm text-zinc-700 whitespace-pre-wrap">
              {notification.body}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-white border border-zinc-200 rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Read</p>
              <p className="font-mono text-zinc-700">
                {notification.isRead ? `Yes (${dateLabel(notification.readAt)})` : "No"}
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Reference</p>
              <p className="font-mono text-zinc-700 break-all">
                {notification.referenceId ?? "—"}
              </p>
            </div>
          </div>
        </div>

        {/* footer */}
        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 sm:justify-between flex-row-reverse bg-white shrink-0">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-xl transition-all shadow-md"
          >
            Close
          </Button>

          <Button
            variant="outline"
            className="h-11 rounded-xl text-xs font-bold uppercase tracking-widest"
            disabled={notification.isRead || markRead.isPending}
            onClick={() => markRead.mutate(notification.id)}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {notification.isRead ? "Already Read" : "Mark as Read"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** ---------- Compose (Admin Send) ---------- */
export function ComposeNotificationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const sendM = useAdminSendNotification();

  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("AdminManual");
  const [referenceId, setReferenceId] = useState("");
  const [referenceType, setReferenceType] = useState("");

  const canSend = useMemo(() => {
    return userId.trim().length > 10 && title.trim().length > 0 && body.trim().length > 0 && type.trim().length > 0;
  }, [userId, title, body, type]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;

    await sendM.mutateAsync({
      userId: userId.trim(),
      title: title.trim(),
      body: body.trim(),
      type: type.trim(),
      referenceId: referenceId.trim() || undefined,
      referenceType: referenceType.trim() || undefined,
    });

    // reset + close
    setUserId("");
    setTitle("");
    setBody("");
    setType("AdminManual");
    setReferenceId("");
    setReferenceType("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] w-[calc(100vw-2rem)] max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col">
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Send size={16} />
              </div>
              Send Notification
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              Admin-only: sends a notification to a specific userId.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Target User ID <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
              placeholder="UUID of user"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Type <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
              placeholder="e.g. AdminVendorSuspended"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Title <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 bg-zinc-50/50 border-zinc-200 rounded-lg"
              placeholder="e.g. Account Action Required"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Body <span className="text-[#D4AF37]">*</span>
            </Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[140px] resize-none bg-zinc-50/50 border-zinc-200 rounded-lg"
              placeholder="Message..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Reference ID (optional)
              </Label>
              <Input
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Reference Type (optional)
              </Label>
              <Input
                value={referenceType}
                onChange={(e) => setReferenceType(e.target.value)}
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 rounded-lg"
              />
            </div>
          </div>
        </form>

        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 sm:justify-between flex-row-reverse bg-white shrink-0">
          <Button
            type="submit"
            disabled={!canSend || sendM.isPending}
            onClick={() => {}}
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            form="broadcastForm"
          >
            {sendM.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send size={14} />}
            {sendM.isPending ? "Sending..." : "Send"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}