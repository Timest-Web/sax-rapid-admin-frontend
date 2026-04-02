/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
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
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Mail, MessageSquare, Send } from "lucide-react";

// --- TYPES ---
export type NotificationLog = {
  id: string;
  title: string;
  message: string;
  target: "all" | "vendors" | "buyers" | "admins";
  channels: ("email" | "sms" | "in_app")[];
  status: "sent" | "scheduled" | "failed";
  sentAt: string;
  recipientCount: number;
};

// --- COMPOSE MODAL ---
interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: NotificationLog) => void;
}

export function ComposeNotificationModal({ isOpen, onClose, onSend }: ComposeModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<string>("all");
  
  // Channel States
  const [useEmail, setUseEmail] = useState(true);
  const [useSms, setUseSms] = useState(false);
  const [usePush, setUsePush] = useState(true);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    const selectedChannels: ("email" | "sms" | "in_app")[] = [];
    if (useEmail) selectedChannels.push("email");
    if (useSms) selectedChannels.push("sms");
    if (usePush) selectedChannels.push("in_app");

    if (selectedChannels.length === 0) {
      alert("Please select at least one channel.");
      return;
    }

    const newLog: NotificationLog = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      target: target as any,
      channels: selectedChannels,
      status: "sent",
      sentAt: "Just now",
      recipientCount: target === "all" ? 1250 : target === "vendors" ? 450 : 800,
    };

    onSend(newLog);
    
    // Reset & Close
    setTitle("");
    setMessage("");
    setTarget("all");
    setUseEmail(true);
    setUseSms(false);
    setUsePush(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col">
        
        {/* ─── MODAL HEADER ─── */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Send size={16} />
              </div>
              New Broadcast
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              Send announcements, alerts, and promotional messages directly to your user base.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        {/* ─── FORM BODY ─── */}
        <form id="broadcastForm" onSubmit={handleSend} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Target Audience */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Target Audience <span className="text-[#D4AF37]">*</span>
            </Label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-bold focus:ring-[#D4AF37] transition-all rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users (Buyers & Vendors)</SelectItem>
                <SelectItem value="vendors">Vendors Only</SelectItem>
                <SelectItem value="buyers">Buyers Only</SelectItem>
                <SelectItem value="admins">System Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Channels Selection */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Delivery Channels <span className="text-[#D4AF37]">*</span>
            </Label>
            <div className="flex flex-wrap gap-4 p-4 bg-zinc-50/50 rounded-xl border border-zinc-200">
              <div className="flex items-center space-x-2.5">
                <Checkbox 
                  id="email" 
                  checked={useEmail} 
                  onCheckedChange={(c) => setUseEmail(!!c)} 
                  className="data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900 text-[#D4AF37]"
                />
                <Label htmlFor="email" className="flex items-center gap-1.5 cursor-pointer text-sm font-bold text-zinc-700 hover:text-zinc-900 transition-colors">
                  <Mail size={16} className="text-zinc-400" /> Email
                </Label>
              </div>
              <div className="flex items-center space-x-2.5">
                <Checkbox 
                  id="sms" 
                  checked={useSms} 
                  onCheckedChange={(c) => setUseSms(!!c)} 
                  className="data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900 text-[#D4AF37]"
                />
                <Label htmlFor="sms" className="flex items-center gap-1.5 cursor-pointer text-sm font-bold text-zinc-700 hover:text-zinc-900 transition-colors">
                  <MessageSquare size={16} className="text-zinc-400" /> SMS
                </Label>
              </div>
              <div className="flex items-center space-x-2.5">
                <Checkbox 
                  id="push" 
                  checked={usePush} 
                  onCheckedChange={(c) => setUsePush(!!c)} 
                  className="data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900 text-[#D4AF37]"
                />
                <Label htmlFor="push" className="flex items-center gap-1.5 cursor-pointer text-sm font-bold text-zinc-700 hover:text-zinc-900 transition-colors">
                  <Bell size={16} className="text-zinc-400" /> In-App Push
                </Label>
              </div>
            </div>
          </div>

          {/* Subject / Title */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Subject / Title <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input 
              placeholder="e.g. System Maintenance Alert" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
              className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-medium focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
            />
          </div>

          {/* Message Body */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-end">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Message Body <span className="text-[#D4AF37]">*</span>
              </Label>
              {useSms && (
                <span className={`text-[10px] uppercase tracking-widest font-bold ${message.length > 160 ? "text-red-500" : "text-zinc-400"}`}>
                  SMS Limit: {message.length}/160
                </span>
              )}
            </div>
            <Textarea 
              placeholder="Type your message here..." 
              className="min-h-[140px] resize-none bg-zinc-50/50 border-zinc-200 text-sm p-4 focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg custom-scrollbar"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
        </form>

        {/* ─── MODAL FOOTER ─── */}
        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 sm:justify-between flex-row-reverse bg-white shrink-0">
          <Button 
            type="submit" 
            form="broadcastForm"
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-xl transition-all shadow-md flex items-center gap-2"
          >
             <Send size={14} /> Send Broadcast
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11 transition-all"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}