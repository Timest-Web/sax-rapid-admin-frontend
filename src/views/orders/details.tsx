/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Printer,
  AlertTriangle,
  Package,
  PackageSearch,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

// Import your modals
import {
  CancelOrderModal,
  RefundModal,
  ResolveDisputeModal,
  UpdateStatusModal,
} from "./actions"; 

// ─── 1. EXTENDED MOCK DATABASE ───
// Storing monetary values as pure numbers (Base = NGN) for accurate currency conversion
const DETAILED_ORDERS = [
  {
    id: "1003163",
    status: "Processing",
    date: "Mar 30, 2026, 10:23 AM",
    customer: {
      name: "Abi Odubanjo",
      email: "bdm202@yahoo.com",
      phone: "+234 812 345 6789",
      type: "New",
    },
    location: "Lagos, NG",
    billing: {
      address: ["5 Carillion Close", "Lekki Phase 1", "Lagos, NG"],
      paymentMethod: "Paystack",
      transactionId: "py_3TGlzcPhRiDr3Zk71vWWCT9L",
    },
    shipping: {
      address: ["5 Carillion Close", "Lekki Phase 1", "Lagos, NG"],
      method: "Standard Shipping (₦2,500)",
    },
    meta: {
      attribution: "Referral: L.instagram.com",
      invoiceNumber: "634",
      vendor: "TechHub",
    },
    products: [
      { id: 1, name: "Badia Onion Powder - 163g", options: null, quantity: 1, price: 15000, total: 15000 },
      { id: 2, name: "Garlic", options: "1kg", quantity: 2, price: 25000, total: 50000 },
      { id: 3, name: "Salt", options: "Premium", quantity: 1, price: 72980, total: 72980 },
    ],
    baseTotalAmount: 137980,
  },
  {
    id: "1003162",
    status: "Shipped",
    date: "Mar 30, 2026, 11:45 AM",
    customer: {
      name: "Ebere Nwozor",
      email: "ebere.n@gmail.com",
      phone: "+234 703 445 9912",
      type: "Returning",
    },
    location: "Abuja, NG",
    billing: {
      address: ["14 Aso Drive", "Asokoro", "Abuja, NG"],
      paymentMethod: "Flutterwave",
      transactionId: "flw_88291038475",
    },
    shipping: {
      address: ["14 Aso Drive", "Asokoro", "Abuja, NG"],
      method: "Express Delivery (₦5,000)",
    },
    meta: {
      attribution: "Direct",
      invoiceNumber: "633",
      vendor: "Fresh Foods",
    },
    products: [
      { id: 1, name: "Turkey Midwing - 10 KG", options: "10 KG Box", quantity: 1, price: 71000, total: 71000 },
    ],
    baseTotalAmount: 71000,
  },
];

const INITIAL_TIMELINE = [
  { status: "Order Placed", date: "March 30, 2026, 10:23 AM", completed: true },
  { status: "Payment Verified", date: "March 30, 2026, 10:25 AM", completed: true },
  { status: "Processing", date: "March 30, 2026, 11:00 AM", completed: false },
  { status: "Shipped", date: "Pending", completed: false },
  { status: "Delivered", date: "Pending", completed: false },
];

export default function OrderDetailsView() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  // Find exact order
  const fetchedOrder = DETAILED_ORDERS.find(o => o.id === id);

  // Local States
  const [order, setOrder] = useState(fetchedOrder);
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);
  const [currency, setCurrency] = useState("NGN");

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center text-center p-6">
        <PackageSearch className="h-16 w-16 text-zinc-300 mb-4" />
        <h1 className="text-xl font-bold text-zinc-900 font-display uppercase tracking-widest mb-2">Order Not Found</h1>
        <p className="text-sm text-zinc-500 mb-6">The order with ID "{id}" does not exist in our records.</p>
        <Button asChild className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest h-11 px-8 rounded-xl transition-all">
          <Link href="/admin/orders"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders</Link>
        </Button>
      </div>
    );
  }

  // Currency Formatting Logic
  const symbol = currency === "NGN" ? "₦" : "R";
  const rate = currency === "NGN" ? 1 : 0.0117; // Mock rate 1 NGN = ~0.0117 ZAR

  const formatMoney = (val: number) => {
    return `${symbol}${(val * rate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Functional Handlers
  const handleStatusUpdate = (newStatus: string, note?: string) => {
    setOrder((prev) => prev ? ({ ...prev, status: newStatus }) : undefined);
    
    const now = format(new Date(), "MMM dd, yyyy, h:mm a");
    setTimeline((prev) => {
      const updated = prev.map((step) => {
        if (!step.completed && step.status === "Processing") return { ...step, completed: true, date: now };
        if (step.status === newStatus) return { ...step, completed: true, date: now };
        return step;
      });

      if (!updated.find((s) => s.status === newStatus)) {
        updated.push({ status: `${newStatus} ${note ? `- ${note}` : ""}`, date: now, completed: true });
      }
      return updated;
    });
  };

  const totalItems = order.products.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-16">
      {/* ─── HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Link href="/admin/orders" className="hover:text-zinc-900 transition-colors flex items-center gap-1">
              <ArrowLeft size={14} /> ORDERS
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-mono">#{order.id}</span>
            <StatusBadge status={order.status} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Currency Switcher */}
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="h-9 w-28 bg-zinc-50 border-zinc-200 text-xs font-bold text-zinc-700 shadow-sm focus:ring-[#D4AF37] rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">NGN (₦)</SelectItem>
              <SelectItem value="ZAR">ZAR (R)</SelectItem>
            </SelectContent>
          </Select>

          <RefundModal maxAmount={formatMoney(order.baseTotalAmount)} onRefund={(amt: any) => handleStatusUpdate("Refunded", `Amount: ${amt}`)} />
          <Button variant="outline" size="sm" onClick={() => window.print()} className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg border-zinc-200 hover:bg-zinc-50">
            <Printer className="mr-2 h-3.5 w-3.5" /> Print
          </Button>
            {order.status !== "Cancelled" && order.status !== "Refunded" && (
            <CancelOrderModal onCancel={(reason: string) => handleStatusUpdate("Cancelled", reason)} />
            )}
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="p-6 max-w-7xl mx-auto space-y-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ─── LEFT: ORDER ITEMS & TIMELINE (8/12) ─── */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Item List */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="relative p-5 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                  Order Items
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-200 text-zinc-600 px-2 py-1 rounded">
                  {totalItems} Items Total
                </span>
              </div>
              <div className="divide-y divide-zinc-100">
                {order.products.map((item) => (
                  <div key={item.id} className="p-5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Image Placeholder */}
                      <div className="h-14 w-14 bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-400 shrink-0">
                        <Package size={20} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-zinc-900 leading-tight">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2">
                          {item.options && (
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md border border-zinc-200">
                              {item.options}
                            </span>
                          )}
                          <span className="text-xs text-zinc-500 font-mono">
                            Qty: {item.quantity} × {formatMoney(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="font-mono font-bold text-zinc-900 text-base">
                      {formatMoney(item.total)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-5 bg-zinc-50/80 border-t border-zinc-200 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Net Sales Total</span>
                <span className="text-2xl font-bold font-mono text-zinc-900">{formatMoney(order.baseTotalAmount)}</span>
              </div>
            </div>

            {/* 2. Timeline */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="relative p-5 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                  Order Timeline
                </h3>
                <UpdateStatusModal currentStatus={order.status} onUpdate={handleStatusUpdate} />
              </div>

              <div className="p-8">
                <div className="relative pl-6 space-y-10">
                  {/* Dynamic Vertical line */}
                  <div className="absolute left-2.5 top-2 bottom-2 w-[2px] bg-zinc-100">
                    <div
                      className="bg-emerald-500 w-full transition-all duration-500"
                      style={{ height: `${(timeline.filter((s) => s.completed).length / timeline.length) * 100}%` }}
                    />
                  </div>

                  {timeline.map((step, idx) => {
                    const isCompleted = step.completed;
                    const isCurrent = !step.completed && timeline.findIndex((s) => !s.completed) === idx;

                    return (
                      <div key={idx} className="relative flex items-start gap-5">
                        {/* Dynamic Dot */}
                        <div className="relative z-10 -ml-[5px]">
                          <div
                            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              isCompleted ? "bg-emerald-500 border-emerald-500" : isCurrent ? "border-[#D4AF37] bg-white" : "border-zinc-300 bg-white"
                            }`}
                          >
                            {isCompleted && <div className="h-2 w-2 bg-white rounded-full" />}
                            {isCurrent && <div className="h-2 w-2 bg-[#D4AF37] rounded-full" />}
                          </div>
                          {isCurrent && <span className="absolute inset-0 rounded-full animate-ping bg-[#D4AF37] opacity-40" />}
                        </div>

                        <div className="flex-1 flex justify-between items-start">
                          <div>
                            <p className={`text-sm font-bold uppercase tracking-wide ${isCompleted || isCurrent ? "text-zinc-900" : "text-zinc-400"}`}>
                              {step.status}
                            </p>
                            {isCurrent && <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold mt-1">In progress</p>}
                          </div>
                          <p className="text-xs font-mono text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">{step.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: DETAILS & ACTIONS (4/12) ─── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Customer Summary Card */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Customer Details</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                  {order.customer.type}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-5 border-b border-zinc-100 pb-5">
                <div className="h-12 w-12 rounded-xl bg-zinc-900 flex items-center justify-center font-bold text-[#D4AF37] text-lg shadow-sm">
                  {order.customer.name.charAt(0)}
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-bold text-zinc-900">{order.customer.name}</p>
                  <p className="text-xs text-zinc-500 font-mono">{order.customer.email}</p>
                  <p className="text-xs text-zinc-500 font-mono">{order.customer.phone}</p>
                </div>
              </div>

              {/* Billing Data */}
              <div className="space-y-5 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Billing Address</span>
                  <div className="text-zinc-900 leading-relaxed font-medium bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    {order.billing.address.map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Payment Method</span>
                  <p className="text-zinc-900 font-bold bg-zinc-50 p-3 rounded-lg border border-zinc-100 flex items-center justify-between">
                    {order.billing.paymentMethod}
                    <span className="font-mono text-[10px] text-zinc-400 font-normal">{order.billing.transactionId}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Details Card */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-5">Shipping Details</h3>
              <div className="space-y-5 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Shipping Address</span>
                  <div className="text-zinc-900 leading-relaxed font-medium bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    {order.shipping.address.map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Shipping Method</span>
                  <p className="text-zinc-900 font-bold bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    {order.shipping.method}
                  </p>
                </div>
              </div>
            </div>

            {/* Meta & Vendor Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
              <div className="flex justify-between border-b border-zinc-800 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Invoice Number</span>
                <span className="font-bold text-[#D4AF37] font-mono">{order.meta.invoiceNumber}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Attribution</span>
                <span className="font-medium text-zinc-300 max-w-[140px] text-right truncate" title={order.meta.attribution}>
                  {order.meta.attribution}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Vendor</span>
                <span className="font-bold text-white hover:text-[#D4AF37] transition-colors cursor-pointer">{order.meta.vendor}</span>
              </div>
            </div>

            {/* Dispute Banner */}
            {order.status === "Dispute" && (
              <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6 animate-in fade-in duration-300 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-700" />
                <div className="flex items-center gap-2 text-rose-700 mb-3 mt-1">
                  <AlertTriangle size={18} />
                  <h3 className="text-sm font-bold uppercase tracking-widest">Dispute Raised</h3>
                </div>
                <p className="text-xs text-rose-600 mb-5 font-medium leading-relaxed">
                  Customer reported: <span className="font-bold italic">"Items damaged on arrival"</span>.
                </p>
                <ResolveDisputeModal onResolve={(verdict: any) => handleStatusUpdate("Resolved", `Verdict: ${verdict}`)} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── STATUS BADGE COMPONENT ───
function StatusBadge({ status }: { status: string }) {
  const getColors = () => {
    switch (status) {
      case "Processing": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Shipped": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Delivered": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Failed": case "Cancelled": case "Refunded": return "bg-rose-100 text-rose-800 border-rose-200";
      case "On-Hold": return "bg-zinc-200 text-zinc-800 border-zinc-300";
      case "Dispute": return "bg-red-100 text-red-800 border-red-300 font-bold";
      default: return "bg-zinc-100 text-zinc-800 border-zinc-200";
    }
  };
  return (
    <span className={`ml-3 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border ${getColors()}`}>
      {status}
    </span>
  );
}