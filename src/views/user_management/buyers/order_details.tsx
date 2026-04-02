"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Printer,
  Package,
  PackageSearch,
  CheckCircle2,
  Truck,
  CreditCard,
} from "lucide-react";

// ─── EXTENDED MOCK ORDER DATA ───
const MOCK_ORDER = {
  id: "1003163",
  buyerId: "BYR-001",
  status: "Processing",
  date: "March 30, 2026, 10:23 AM",
  customer: {
    name: "Abi Odubanjo",
    email: "bdm202@yahoo.com",
    phone: "+234 812 345 6789",
  },
  billing: {
    address: ["5 Carillion Close", "Lekki Phase 1", "Lagos, NG"],
    paymentMethod: "Wallet Balance",
    transactionId: "txn_89234829384",
  },
  shipping: {
    address: ["5 Carillion Close", "Lekki Phase 1", "Lagos, NG"],
    method: "Standard Shipping (₦2,500)",
    tracking: "Pending",
  },
  products: [
    {
      id: 1,
      name: "Jumbo Hard Chicken Leg/Thigh",
      options: "10kg",
      quantity: 1,
      price: "₦30,000",
      total: "₦30,000",
    },
    {
      id: 2,
      name: "Mackerel Fish (Titus)",
      options: "12.5kg",
      quantity: 1,
      price: "₦70,000",
      total: "₦70,000",
    },
    {
      id: 3,
      name: "Badia Onion Powder",
      options: "163g",
      quantity: 2,
      price: "₦2,000",
      total: "₦4,000",
    },
  ],
  totalAmount: "₦106,500", // (30k + 70k + 4k + 2.5k shipping)
};

const INITIAL_TIMELINE = [
  { status: "Order Placed", date: "March 30, 2026, 10:23 AM", completed: true },
  {
    status: "Payment Verified (Wallet)",
    date: "March 30, 2026, 10:23 AM",
    completed: true,
  },
  { status: "Processing", date: "March 30, 2026, 11:00 AM", completed: false },
  { status: "Shipped", date: "Pending", completed: false },
  { status: "Delivered", date: "Pending", completed: false },
];

export default function BuyerOrderDetailsView() {
  const params = useParams();
  const rawBuyerId = params?.buyerId;
  const rawOrderId = params?.orderId;

  const buyerId = Array.isArray(rawBuyerId) ? rawBuyerId[0] : rawBuyerId;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

  // Fetch logic would go here. Using mock for now.
  const order = MOCK_ORDER;
  const timeline = INITIAL_TIMELINE;

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center text-center p-6">
        <PackageSearch className="h-16 w-16 text-zinc-300 mb-4" />
        <h1 className="text-xl font-bold text-zinc-900 font-display uppercase tracking-widest mb-2">
          Order Not Found
        </h1>
        <Button
          asChild
          className="mt-4 bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest h-11 px-8 rounded-xl transition-all"
        >
          <Link href={`/admin/buyers/${buyerId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Buyer Profile
          </Link>
        </Button>
      </div>
    );
  }

  const totalItems = order.products.reduce(
    (acc, curr) => acc + curr.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-16">
      {/* ─── HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Link
              href={`/admin/buyers/${buyerId}`}
              className="hover:text-zinc-900 transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} /> BACK TO PROFILE
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-mono">ORDER #{order.id}</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg border-zinc-200 hover:bg-zinc-50"
        >
          <Printer className="mr-2 h-3.5 w-3.5" /> Print Receipt
        </Button>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="p-6 max-w-6xl mx-auto space-y-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ─── LEFT: ORDER ITEMS & TIMELINE (8/12) ─── */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Item List */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="relative p-5 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                  Purchased Items
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-200 text-zinc-600 px-2 py-1 rounded">
                  {totalItems} Items Total
                </span>
              </div>
              <div className="divide-y divide-zinc-100">
                {order.products.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
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
                            Qty: {item.quantity} × {item.price}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="font-mono font-bold text-zinc-900 text-base">
                      {item.total}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-5 bg-zinc-50/80 border-t border-zinc-200 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Order Total (Inc. Shipping)
                </span>
                <span className="text-2xl font-bold font-mono text-emerald-600">
                  {order.totalAmount}
                </span>
              </div>
            </div>

            {/* 2. Timeline */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="relative p-5 border-b border-zinc-100 bg-zinc-50/50">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                  Order Tracking Timeline
                </h3>
              </div>
              <div className="p-8">
                <div className="relative pl-6 space-y-10">
                  <div className="absolute left-2.5 top-2 bottom-2 w-[2px] bg-zinc-100">
                    <div
                      className="bg-emerald-500 w-full transition-all duration-500"
                      style={{
                        height: `${(timeline.filter((s) => s.completed).length / timeline.length) * 100}%`,
                      }}
                    />
                  </div>

                  {timeline.map((step, idx) => {
                    const isCompleted = step.completed;
                    const isCurrent =
                      !step.completed &&
                      timeline.findIndex((s) => !s.completed) === idx;

                    return (
                      <div
                        key={idx}
                        className="relative flex items-start gap-5"
                      >
                        <div className="relative z-10 -ml-[5px]">
                          <div
                            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              isCompleted
                                ? "bg-emerald-500 border-emerald-500"
                                : isCurrent
                                  ? "border-[#D4AF37] bg-white"
                                  : "border-zinc-300 bg-white"
                            }`}
                          >
                            {isCompleted && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                            )}
                            {isCurrent && (
                              <div className="h-2 w-2 bg-[#D4AF37] rounded-full" />
                            )}
                          </div>
                          {isCurrent && (
                            <span className="absolute inset-0 rounded-full animate-ping bg-[#D4AF37] opacity-40" />
                          )}
                        </div>

                        <div className="flex-1 flex justify-between items-start">
                          <div>
                            <p
                              className={`text-sm font-bold uppercase tracking-wide ${isCompleted || isCurrent ? "text-zinc-900" : "text-zinc-400"}`}
                            >
                              {step.status}
                            </p>
                            {isCurrent && (
                              <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold mt-1">
                                Currently Here
                              </p>
                            )}
                          </div>
                          <p className="text-xs font-mono text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                            {step.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: SHIPPING & BILLING (4/12) ─── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Current Status
              </span>
              <span className="px-3 py-1 bg-amber-500/20 text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg text-xs font-bold uppercase tracking-widest">
                {order.status}
              </span>
            </div>

            {/* Logistics Card */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6 text-xs">
              <div className="flex items-center gap-2 text-zinc-900 font-bold uppercase tracking-widest border-b border-zinc-100 pb-3">
                <Truck size={16} className="text-[#D4AF37]" /> Logistics Info
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">
                  Delivery Address
                </span>
                <div className="text-zinc-900 leading-relaxed font-medium bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                  {order.shipping.address.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                    Method
                  </span>
                  <p className="text-zinc-900 font-bold">
                    {order.shipping.method}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                    Tracking Number
                  </span>
                  <p className="text-blue-600 font-mono font-bold hover:underline cursor-pointer">
                    {order.shipping.tracking}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6 text-xs">
              <div className="flex items-center gap-2 text-zinc-900 font-bold uppercase tracking-widest border-b border-zinc-100 pb-3">
                <CreditCard size={16} className="text-[#D4AF37]" /> Payment
                Details
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">
                  Billing Address
                </span>
                <div className="text-zinc-900 leading-relaxed font-medium bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                  {order.billing.address.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">
                  Payment Method
                </span>
                <p className="text-zinc-900 font-bold bg-zinc-50 p-3 rounded-lg border border-zinc-100 flex items-center justify-between">
                  {order.billing.paymentMethod}
                  <span className="font-mono text-[10px] text-zinc-400 font-normal">
                    {order.billing.transactionId}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
