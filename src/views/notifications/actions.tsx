/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const handleSend = () => {
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
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125 bg-white text-zinc-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send size={18} /> New Broadcast
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          
          {/* Target Audience */}
          <div className="space-y-2">
            <Label>Target Audience</Label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger>
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
          <div className="space-y-2">
            <Label>Delivery Channels</Label>
            <div className="flex gap-4 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
              <div className="flex items-center space-x-2">
                <Checkbox id="email" checked={useEmail} onCheckedChange={(c) => setUseEmail(!!c)} />
                <Label htmlFor="email" className="flex items-center gap-1 cursor-pointer"><Mail size={14}/> Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sms" checked={useSms} onCheckedChange={(c) => setUseSms(!!c)} />
                <Label htmlFor="sms" className="flex items-center gap-1 cursor-pointer"><MessageSquare size={14}/> SMS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="push" checked={usePush} onCheckedChange={(c) => setUsePush(!!c)} />
                <Label htmlFor="push" className="flex items-center gap-1 cursor-pointer"><Bell size={14}/> In-App</Label>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Subject / Title</Label>
            <Input 
              placeholder="e.g. System Maintenance Alert" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Message Body</Label>
              {useSms && (
                <span className={`text-[10px] ${message.length > 160 ? "text-red-500 font-bold" : "text-zinc-400"}`}>
                  SMS Limit: {message.length}/160
                </span>
              )}
            </div>
            <Textarea 
              placeholder="Type your message here..." 
              className="min-h-[100px] resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSend} className="bg-zinc-900 hover:bg-zinc-800">
             <Send className="mr-2 h-4 w-4" /> Send Broadcast
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}