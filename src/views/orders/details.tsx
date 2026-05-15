/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, AlertTriangle, Package, PackageSearch } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  CancelOrderModal,
  RefundModal,
  ResolveDisputeModal,
  UpdateStatusModal,
} from "./actions";

import { useOrder } from "@/src/features/orders/hooks";
import { useCancelOrder, useUpdateOrderStatus } from "@/src/features/orders/hooks";

function StatusBadge({ status }: { status: string }) {
  const getColors = () => {
    switch (status) {
      case "Processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Failed":
      case "Cancelled":
      case "Refunded":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "On-Hold":
        return "bg-zinc-200 text-zinc-800 border-zinc-300";
      case "Dispute":
        return "bg-red-100 text-red-800 border-red-300 font-bold";
      default:
        return "bg-zinc-100 text-zinc-800 border-zinc-200";
    }
  };

  return (
    <span className={`ml-3 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border ${getColors()}`}>
      {status}
    </span>
  );
}

export default function OrderDetailsView() {
  // Hooks must always run, same order
  const params = useParams();
  const routeId = Array.isArray((params as any)?.id) ? (params as any)?.id[0] : (params as any)?.id;

  const { data: order, isLoading, isError } = useOrder(routeId);
  const cancel = useCancelOrder();
  const updateStatus = useUpdateOrderStatus();

  const [currency, setCurrency] = useState<"NGN" | "ZAR">("NGN");

  if (isLoading) {
    return <div className="min-h-screen bg-zinc-50 p-10 text-sm text-zinc-500">Loading order…</div>;
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center text-center p-6">
        <PackageSearch className="h-16 w-16 text-zinc-300 mb-4" />
        <h1 className="text-xl font-bold text-zinc-900 font-display uppercase tracking-widest mb-2">
          Order Not Found
        </h1>
        <p className="text-sm text-zinc-500 mb-6">
          The order "{String(routeId)}" does not exist or you don’t have access.
        </p>
        <Button asChild className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest h-11 px-8 rounded-xl transition-all">
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Link>
        </Button>
      </div>
    );
  }

  // ---- from here order is defined ----

  // Currency formatting (same mock conversion)
  const symbol = currency === "NGN" ? "₦" : "R";
  const rate = currency === "NGN" ? 1 : 0.0117;
  const formatMoney = (val: number) =>
    `${symbol}${(val * rate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const customerName =
    `${order.user?.firstName ?? ""} ${order.user?.lastName ?? ""}`.trim() || "—";

  const shippingLines = [
    order.shippingAddress,
    [order.shippingCity, order.shippingState].filter(Boolean).join(", "),
    order.shippingCountry,
  ].filter(Boolean);

  const totalItems = (order.items ?? []).reduce((acc, curr) => acc + (curr.quantity ?? 0), 0);

  // ✅ NO HOOK HERE: compute normally
  const paidDone = !!order.paidAt || String(order.paymentStatus).toLowerCase() === "paid";
  const shippedDone = ["shipped", "delivered", "completed"].some((s) =>
    String(order.status).toLowerCase().includes(s)
  );
  const deliveredDone =
    !!order.deliveredAt ||
    ["delivered", "completed"].some((s) => String(order.status).toLowerCase().includes(s));

  const timeline = [
    {
      status: "Order Placed",
      date: order.createdAt ? new Date(order.createdAt).toLocaleString() : "—",
      completed: true,
    },
    {
      status: "Payment Verified",
      date: order.paidAt ? new Date(order.paidAt).toLocaleString() : "Pending",
      completed: paidDone,
    },
    {
      status: "Processing",
      date: String(order.status).toLowerCase().includes("processing")
        ? new Date().toLocaleString()
        : "Pending",
      completed: String(order.status).toLowerCase().includes("processing") || shippedDone || deliveredDone,
    },
    {
      status: "Shipped",
      date: order.trackingNumber ? `Tracking: ${order.trackingNumber}` : "Pending",
      completed: shippedDone,
    },
    {
      status: "Delivered",
      date: order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : "Pending",
      completed: deliveredDone,
    },
  ];

  const handleStatusUpdate = (newStatus: string) => {
    updateStatus.mutate({ orderId: order.id, status: newStatus });
  };

  const handleCancel = (_reason: string) => {
    cancel.mutate(order.id);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-16">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Link href="/admin/orders" className="hover:text-zinc-900 transition-colors flex items-center gap-1">
              <ArrowLeft size={14} /> ORDERS
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-mono">#{order.orderNumber}</span>
            <StatusBadge status={order.status} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={currency} onValueChange={(v) => setCurrency(v as any)}>
            <SelectTrigger className="h-9 w-28 bg-zinc-50 border-zinc-200 text-xs font-bold text-zinc-700 shadow-sm focus:ring-[#D4AF37] rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">NGN (₦)</SelectItem>
              <SelectItem value="ZAR">ZAR (R)</SelectItem>
            </SelectContent>
          </Select>

          <RefundModal maxAmount={formatMoney(order.totalAmount)} onRefund={() => {}} />

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg border-zinc-200 hover:bg-zinc-50"
          >
            <Printer className="mr-2 h-3.5 w-3.5" /> Print
          </Button>

          {order.status !== "Cancelled" && <CancelOrderModal onCancel={handleCancel} />}
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-8">
            {/* Items */}
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
                {(order.items ?? []).map((item) => (
                  <div key={item.id} className="p-5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-400 shrink-0">
                        <Package size={20} />
                      </div>

                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-zinc-900 leading-tight">{item.productName}</p>
                        <div className="flex items-center gap-2">
                          {item.productSKU ? (
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md border border-zinc-200">
                              {item.productSKU}
                            </span>
                          ) : null}
                          <span className="text-xs text-zinc-500 font-mono">
                            Qty: {item.quantity} × {formatMoney(item.unitPrice)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="font-mono font-bold text-zinc-900 text-base">{formatMoney(item.totalPrice)}</p>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-zinc-50/80 border-t border-zinc-200 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Total Amount</span>
                <span className="text-2xl font-bold font-mono text-zinc-900">{formatMoney(order.totalAmount)}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="relative p-5 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
                  Order Timeline
                </h3>

                <UpdateStatusModal currentStatus={order.status} onUpdate={(s: string) => handleStatusUpdate(s)} />
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
                    const isCurrent = !step.completed && timeline.findIndex((s) => !s.completed) === idx;

                    return (
                      <div key={idx} className="relative flex items-start gap-5">
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
                            {isCurrent && (
                              <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold mt-1">
                                In progress
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

          {/* RIGHT */}
          <div className="lg:col-span-4 space-y-6">
            {/* Customer */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Customer Details</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                  Customer
                </span>
              </div>

              <div className="flex items-center gap-3 mb-5 border-b border-zinc-100 pb-5">
                <div className="h-12 w-12 rounded-xl bg-zinc-900 flex items-center justify-center font-bold text-[#D4AF37] text-lg shadow-sm">
                  {(customerName?.[0] ?? "C").toUpperCase()}
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-bold text-zinc-900">{customerName}</p>
                  <p className="text-xs text-zinc-500 font-mono">{order.user.email}</p>
                  <p className="text-xs text-zinc-500 font-mono">{order.user.phoneNumber}</p>
                </div>
              </div>

              <div className="space-y-5 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">
                    Payment
                  </span>
                  <p className="text-zinc-900 font-bold bg-zinc-50 p-3 rounded-lg border border-zinc-100 flex items-center justify-between">
                    {order.paymentMethod}
                    <span className="font-mono text-[10px] text-zinc-400 font-normal">{order.paymentStatus}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-5">Shipping Details</h3>

              <div className="space-y-5 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">
                    Shipping Address
                  </span>
                  <div className="text-zinc-900 leading-relaxed font-medium bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    {shippingLines.map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">
                    Shipping Fee
                  </span>
                  <p className="text-zinc-900 font-bold bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    {formatMoney(order.shippingFee)}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">
                    Tracking
                  </span>
                  <p className="text-zinc-900 font-bold bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    {order.trackingNumber ?? "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
              <div className="flex justify-between border-b border-zinc-800 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Order Number</span>
                <span className="font-bold text-[#D4AF37] font-mono">{order.orderNumber}</span>
              </div>

              <div className="flex justify-between border-b border-zinc-800 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Created</span>
                <span className="font-medium text-zinc-300 text-right">{new Date(order.createdAt).toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total</span>
                <span className="font-bold text-white">{formatMoney(order.totalAmount)}</span>
              </div>
            </div>

            {/* Dispute */}
            {String(order.status).toLowerCase().includes("dispute") && (
              <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6 animate-in fade-in duration-300 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-700" />
                <div className="flex items-center gap-2 text-rose-700 mb-3 mt-1">
                  <AlertTriangle size={18} />
                  <h3 className="text-sm font-bold uppercase tracking-widest">Dispute Raised</h3>
                </div>
                <p className="text-xs text-rose-600 mb-5 font-medium leading-relaxed">
                  Dispute handling endpoints are not provided in your API docs yet.
                </p>
                <ResolveDisputeModal onResolve={() => {}} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}