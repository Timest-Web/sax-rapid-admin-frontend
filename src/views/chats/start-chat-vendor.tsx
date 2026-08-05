"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { AppDialog } from "@/components/custom-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getErrorMessage } from "@/src/lib/get-error";
import type { VendorOrderListItem } from "@/src/features/vendors/api";
import { useStartConversation } from "@/src/features/chats/hooks";

type Props = {
  vendorProfileId: string;   // ✅ vendor.id
  vendorName: string;
  orders: VendorOrderListItem[];

  /**
   * If provided, order picker is hidden and this is used directly.
   * Great for "Chat" button inside each order row.
   */
  defaultOrderRef?: string; // orderNumber (ORD-...) or orderId
};

export function StartChatFromVendorDetails({
  vendorProfileId,
  vendorName,
  orders,
  defaultOrderRef,
}: Props) {
  const router = useRouter();
  const startM = useStartConversation();

  const [open, setOpen] = useState(false);
  const [orderRef, setOrderRef] = useState(defaultOrderRef ?? "");
  const [message, setMessage] = useState("");

  const orderOptions = useMemo(() => {
    return (orders ?? [])
      .map((o) => {
        // ✅ use the same logic you already display in your table
        const ref = String(o.orderNumber ?? o.orderId ?? "");
        const meta = [o.customerName, o.productName].filter(Boolean).join(" • ");
        return { value: ref, label: ref, meta: meta || "—" };
      })
      .filter((x) => !!x.value);
  }, [orders]);

  const canStart = !!orderRef.trim() && !!message.trim() && !startM.isPending;

  return (
    <>
      <Button
        size="sm"
        variant={defaultOrderRef ? "outline" : "default"}
        className={
          defaultOrderRef
            ? "h-9 text-xs rounded-lg"
            : "h-9 text-xs font-bold uppercase tracking-wider bg-zinc-900 text-[#D4AF37] hover:bg-zinc-800"
        }
        onClick={() => setOpen(true)}
        disabled={!vendorProfileId}
      >
        <MessageSquare className="mr-2 h-3.5 w-3.5" />
        {defaultOrderRef ? "Chat" : "Chat Vendor"}
      </Button>

      <AppDialog
        open={open}
        onOpenChange={setOpen}
        title="Start chat"
        description={`Message ${vendorName} about an order.`}
        icon={<MessageSquare size={16} />}
        size="custom"
        maxWidthClassName="sm:max-w-[620px]"
        footer={
          <>
            <Button
              className="h-11 px-8 bg-zinc-900 text-[#D4AF37]"
              disabled={!canStart}
              onClick={() => {
                startM.mutate(
                  {
                    vendorId: vendorProfileId,       // ✅ vendor profile id
                    orderId: orderRef.trim(),        // ✅ orderNumber or orderId
                    initialMessage: message.trim(),
                  },
                  {
                    onSuccess: (conv) => {
                      setOpen(false);
                      setMessage("");
                      if (!defaultOrderRef) setOrderRef("");
                      router.push(`/admin/chat/${conv.id}`);
                    },
                    onError: (err) => toast.error(getErrorMessage(err)),
                  },
                );
              }}
            >
              {startM.isPending ? "Starting..." : "Start Chat"}
            </Button>

            <Button
              variant="outline"
              className="h-11 px-6"
              onClick={() => setOpen(false)}
              disabled={startM.isPending}
            >
              Cancel
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Order picker hidden if defaultOrderRef is provided */}
          {!defaultOrderRef && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Select Order</Label>

              <Select value={orderRef} onValueChange={setOrderRef}>
                <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 rounded-lg">
                  <SelectValue
                    placeholder={orderOptions.length ? "Choose an order..." : "No orders found"}
                  />
                </SelectTrigger>

                <SelectContent>
                  {orderOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-bold">{o.label}</span>
                        <span className="text-[10px] text-zinc-500">{o.meta}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {orderOptions.length === 0 && (
                <p className="text-xs text-amber-700">
                  Chat requires an order. This vendor has no orders yet.
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Initial message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-28 bg-zinc-50/50 border-zinc-200"
              placeholder="Type your message..."
            />
            <p className="text-[11px] text-zinc-500">
              This will create the conversation (or return an existing one) and send the first message.
            </p>
          </div>
        </div>
      </AppDialog>
    </>
  );
}