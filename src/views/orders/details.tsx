"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, AlertTriangle } from "lucide-react";
import {
  CancelOrderModal,
  RefundModal,
  ResolveDisputeModal,
  UpdateStatusModal,
} from "./actions";
import { ORDER_ITEMS, ORDER_TIMELINE, ORDERS } from "@/src/lib/dummy_data";
import Image from "next/image";

export default function OrderDetailsView() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const order = ORDERS.find((o) => o.id === decodeURIComponent(id || ""));

  if (!order) return notFound();

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* ─── HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <div className="flex items-center gap-2 text-sm font-mono text-zinc-400">
            <Link
              href="/admin/orders"
              className="hover:text-zinc-900 transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} /> ORDERS
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-bold">{order.id}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Functional Process Refund Button */}
          <RefundModal maxAmount={order.total} />

          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-3 w-3" /> Print Invoice
          </Button>

          {/* Functional Cancel Button */}
          {order.status !== "Cancelled" && <CancelOrderModal />}
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      {/* Fixed: max-w-[1600px] instead of max-w-400 */}
      <main className="p-6 max-w-400 mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ─── LEFT: ORDER INFO (8/12) ─── */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Item List */}
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Order Items
                </h3>
                <span className="text-xs font-mono text-zinc-400">
                  {order.items} Items
                </span>
              </div>
              <div className="divide-y divide-zinc-100">
                {ORDER_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {/* Image Placeholder */}
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="object-cover rounded border border-zinc-200"
                      />

                      <div>
                        <p className="text-sm font-bold text-zinc-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-zinc-500 font-mono">
                          Qty: {item.qty}
                        </p>
                      </div>
                    </div>
                    <p className="font-mono font-bold text-zinc-900">
                      {item.price}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-zinc-500">
                  Total Amount
                </span>
                <span className="text-xl font-bold font-mono text-zinc-900">
                  {order.total}
                </span>
              </div>
            </div>

            {/* 2. Timeline */}
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Order Timeline
                </h3>
                {/* Functional Status Update */}
                <UpdateStatusModal />
              </div>

              <div className="relative pl-6 space-y-8">
                {/* Vertical line */}
                <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-zinc-200">
                  <div
                    className="bg-emerald-500 w-full transition-all duration-500"
                    style={{
                      height: `${(ORDER_TIMELINE.filter((s) => s.completed).length / ORDER_TIMELINE.length) * 100}%`,
                    }}
                  />
                </div>

                {ORDER_TIMELINE.map((step, idx) => {
                  const isCompleted = step.completed;
                  const isCurrent =
                    !step.completed &&
                    ORDER_TIMELINE.findIndex((s) => !s.completed) === idx;

                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Dot */}
                      <div className="relative z-10">
                        <div
                          className={`
              h-5 w-5 rounded-full border-2 flex items-center justify-center
              transition-all duration-300
              ${
                isCompleted
                  ? "bg-emerald-500 border-emerald-500"
                  : isCurrent
                    ? "border-emerald-500 bg-white"
                    : "border-zinc-300 bg-white"
              }
            `}
                        >
                          {isCompleted && (
                            <div className="h-2 w-2 bg-white rounded-full" />
                          )}
                        </div>

                        {/* Glow for current */}
                        {isCurrent && (
                          <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400 opacity-30" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex justify-between items-start">
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              isCompleted || isCurrent
                                ? "text-zinc-900"
                                : "text-zinc-400"
                            }`}
                          >
                            {step.status}
                          </p>

                          {isCurrent && (
                            <p className="text-xs text-emerald-500 font-medium">
                              In progress
                            </p>
                          )}
                        </div>

                        <p className="text-xs font-mono text-zinc-400">
                          {step.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: CUSTOMER & ACTIONS (4/12) ─── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Customer Card */}
            <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
                Customer
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-500 border border-zinc-200">
                  AO
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">
                    {order.customer}
                  </p>
                  <p className="text-xs text-zinc-500">amara@gmail.com</p>
                </div>
              </div>
              <div className="text-xs text-zinc-600 bg-zinc-50 p-3 rounded border border-zinc-100">
                14, Victoria Island, Lagos, Nigeria.
              </div>
            </div>

            {/* Vendor Card */}
            <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
                Sold By
              </h3>
              <p className="text-sm font-bold text-zinc-900">{order.vendor}</p>
              <p className="text-xs text-zinc-500">ID: VND-8821</p>
            </div>

            {/* Functional Dispute Alert */}
            {order.status === "Dispute" && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                <div className="flex items-center gap-2 text-rose-700 mb-2">
                  <AlertTriangle size={18} />
                  <h3 className="text-sm font-bold uppercase">
                    Dispute Raised
                  </h3>
                </div>
                <p className="text-xs text-rose-600 mb-4">
                  Customer reported: &quot;Item damaged on arrival&quot;.
                </p>

                {/* The Functional Modal Button */}
                <ResolveDisputeModal />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
