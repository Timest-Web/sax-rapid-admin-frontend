/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Send,
  Paperclip,
  AlertTriangle,
  User,
  Store,
  Calendar,
  CreditCard,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- MOCK DATA FOR THIS SPECIFIC CASE ---
const INITIAL_CASE_DATA = {
  id: "DSP-2024-001",
  orderId: "ORD-9921",
  amount: "₦450,000",
  date: "Oct 25, 2023",
  type: "Fraud Alert",
  status: "open", // open, resolved_refund, resolved_vendor
  buyer: {
    name: "Michael Scott",
    email: "michael@dunder.com",
    history: "12 Orders (0 Disputes)",
  },
  vendor: {
    name: "Tech Haven",
    email: "sales@techhaven.ng",
    history: "450 Orders (2 Disputes)",
  },
  product: {
    name: "MacBook Pro M2 14-inch",
    image: "/api/placeholder/100/100", // Replace with real image
  },
};

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: "buyer",
    name: "Michael Scott",
    text: "I received a box filled with stones instead of the MacBook I ordered! I have attached photos of the package upon opening.",
    time: "10:30 AM",
    attachments: ["photo_of_stones.jpg"],
  },
  {
    id: 2,
    sender: "vendor",
    name: "Tech Haven",
    text: "This is impossible. We have CCTV footage of the item being packed and handed to the logistics partner. The weight on the waybill matches a laptop, not stones.",
    time: "11:15 AM",
    attachments: ["cctv_footage.mp4", "waybill_receipt.pdf"],
  },
  {
    id: 3,
    sender: "admin",
    name: "System",
    text: "Dispute opened. Funds have been frozen in escrow pending investigation.",
    time: "10:29 AM",
    isSystem: true,
  },
];

export default function DisputeDetailsView() {
  const [caseStatus, setCaseStatus] = useState<
    "open" | "resolved_refund" | "resolved_vendor"
  >("open");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState("");

  // FUNCTION: Add a new message (Admin reply)
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const msg = {
      id: messages.length + 1,
      sender: "admin",
      name: "Admin Support",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSystem: false,
    };

    setMessages([...messages, msg]);
    setNewMessage("");
  };

  // FUNCTION: Resolve Case
  const resolveCase = (decision: "refund" | "vendor") => {
    const actionText =
      decision === "refund"
        ? "Refund approved for Buyer. ₦450,000 returned to wallet."
        : "Funds released to Vendor. Claim denied.";

    const resolutionMsg = {
      id: messages.length + 1,
      sender: "admin",
      name: "System Resolution",
      text: `CASE CLOSED: ${actionText}`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSystem: true,
    };

    setMessages([...messages, resolutionMsg]);
    setCaseStatus(
      decision === "refund" ? "resolved_refund" : "resolved_vendor",
    );
  };

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/disputes"
            className="text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="h-6 w-px bg-zinc-200" />
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display flex items-center gap-2">
              Case #{INITIAL_CASE_DATA.id}
              {caseStatus === "open" && (
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">
                  OPEN
                </span>
              )}
              {caseStatus === "resolved_refund" && (
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
                  REFUNDED
                </span>
              )}
              {caseStatus === "resolved_vendor" && (
                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold">
                  RELEASED
                </span>
              )}
            </h1>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: CHAT & EVIDENCE (2/3 Width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* EVIDENCE SECTION */}
          <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
              <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                <FileText size={16} /> Evidence Locker
              </h3>
            </div>
            <div className="p-4">
              <Tabs defaultValue="buyer" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-zinc-100">
                  <TabsTrigger
                    value="buyer"
                    className="data-[state=active]:bg-white data-[state=active]:text-red-600"
                  >
                    Buyer's Proof
                  </TabsTrigger>
                  <TabsTrigger
                    value="vendor"
                    className="data-[state=active]:bg-white data-[state=active]:text-indigo-600"
                  >
                    Vendor's Rebuttal
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="buyer" className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-900">
                    <p className="font-bold mb-2">
                      Claim: Item Not Received (Empty Box)
                    </p>
                    <div className="flex gap-2 mt-3">
                      <div className="h-20 w-20 bg-zinc-300 rounded-md flex items-center justify-center text-xs text-zinc-500">
                        Img 1
                      </div>
                      <div className="h-20 w-20 bg-zinc-300 rounded-md flex items-center justify-center text-xs text-zinc-500">
                        Img 2
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="vendor" className="space-y-4">
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-900">
                    <p className="font-bold mb-2">
                      Defense: Valid Waybill & CCTV
                    </p>
                    <div className="flex gap-2 mt-3">
                      <div className="h-20 w-20 bg-zinc-300 rounded-md flex items-center justify-center text-xs text-zinc-500">
                        Video.mp4
                      </div>
                      <div className="h-20 w-20 bg-zinc-300 rounded-md flex items-center justify-center text-xs text-zinc-500">
                        Doc.pdf
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* CHAT / TIMELINE SECTION */}
          <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col h-[600px]">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
              <h3 className="font-bold text-sm text-zinc-900">
                Dispute Timeline
              </h3>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-zinc-50/30">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col",
                    msg.isSystem
                      ? "items-center"
                      : msg.sender === "admin"
                        ? "items-end"
                        : "items-start",
                  )}
                >
                  {/* System Message */}
                  {msg.isSystem && (
                    <div className="bg-zinc-100 text-zinc-500 text-[10px] uppercase tracking-wide font-bold px-3 py-1 rounded-full mb-2">
                      {msg.text}
                    </div>
                  )}

                  {/* User/Admin Message */}
                  {!msg.isSystem && (
                    <div
                      className={cn(
                        "max-w-[80%]",
                        msg.sender === "admin"
                          ? "items-end flex flex-col"
                          : "items-start flex flex-col",
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-zinc-700">
                          {msg.name}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {msg.time}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "p-3 rounded-xl text-sm shadow-sm",
                          msg.sender === "admin"
                            ? "bg-zinc-900 text-white rounded-tr-none"
                            : msg.sender === "buyer"
                              ? "bg-white border border-zinc-200 text-zinc-700 rounded-tl-none"
                              : "bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-tl-none",
                        )}
                      >
                        {msg.text}
                      </div>

                      {/* Attachments in chat */}
                      {msg.attachments && (
                        <div className="flex gap-2 mt-2">
                          {msg.attachments.map((att, i) => (
                            <div
                              key={i}
                              className="text-[10px] bg-zinc-200 px-2 py-1 rounded flex items-center gap-1"
                            >
                              <Paperclip size={10} /> {att}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Area (Disable if closed) */}
            {caseStatus === "open" ? (
              <div className="p-4 border-t border-zinc-200 bg-white rounded-b-xl flex gap-3">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type an internal note or reply to parties..."
                  className="min-h-[50px] resize-none bg-zinc-50 border-zinc-200 focus:ring-zinc-900"
                />
                <Button
                  onClick={handleSendMessage}
                  className="h-auto bg-zinc-900 hover:bg-zinc-800"
                >
                  <Send size={16} />
                </Button>
              </div>
            ) : (
              <div className="p-4 border-t border-zinc-200 bg-zinc-50 text-center text-xs text-zinc-500 italic">
                This case is closed. No further messages can be sent.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY & ACTIONS (1/3 Width) */}
        <div className="space-y-6">
          {/* ACTION CARD */}
          <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider">
              Resolution Console
            </h3>

            {caseStatus === "open" ? (
              <>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800 flex gap-2">
                  <AlertTriangle size={16} className="shrink-0" />
                  Funds (₦450,000) are currently held in escrow.
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  <Button
                    onClick={() => resolveCase("refund")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white justify-start"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Refund Buyer
                  </Button>
                  <Button
                    onClick={() => resolveCase("vendor")}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white justify-start"
                  >
                    <Store className="mr-2 h-4 w-4" /> Release to Vendor
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 justify-start"
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Close (No Action)
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-4 bg-zinc-100 rounded text-center">
                <CheckCircle2
                  size={32}
                  className="mx-auto mb-2 text-zinc-400"
                />
                <p className="text-sm font-bold text-zinc-600">
                  Resolution Complete
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Action taken by Admin on {new Date().toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* ORDER DETAILS */}
          <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
              <h3 className="font-bold text-sm text-zinc-900">
                Transaction Details
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                <span className="text-xs text-zinc-500">Amount</span>
                <span className="font-bold font-mono text-zinc-900">
                  {INITIAL_CASE_DATA.amount}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                <span className="text-xs text-zinc-500">Order ID</span>
                <Link
                  href="#"
                  className="font-mono text-xs text-indigo-600 underline"
                >
                  {INITIAL_CASE_DATA.orderId}
                </Link>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500">Payment Method</span>
                <span className="flex items-center gap-1 text-xs text-zinc-700">
                  <CreditCard size={12} /> Card
                </span>
              </div>
            </div>
          </div>

          {/* INVOLVED PARTIES */}
          <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
              <h3 className="font-bold text-sm text-zinc-900">
                Parties Involved
              </h3>
            </div>
            <div className="p-4 space-y-6">
              {/* Buyer */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                  <User size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">Buyer</p>
                  <p className="text-sm text-zinc-700">
                    {INITIAL_CASE_DATA.buyer.name}
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    {INITIAL_CASE_DATA.buyer.history}
                  </p>
                </div>
              </div>

              {/* Vendor */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <Store size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-600">Vendor</p>
                  <p className="text-sm text-zinc-700">
                    {INITIAL_CASE_DATA.vendor.name}
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    {INITIAL_CASE_DATA.vendor.history}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
