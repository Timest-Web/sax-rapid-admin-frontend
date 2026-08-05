"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppDialog } from "@/components/custom-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";
import { useStartConversation } from "@/src/features/chats/hooks";


export function StartChatButton({
  vendorId,
  orderId,
  vendorName,
}: {
  vendorId: string;
  orderId: string;
  vendorName?: string;
}) {
  const router = useRouter();
  const startM = useStartConversation();

  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-9 text-xs"
        onClick={() => setOpen(true)}
      >
        <MessageSquare className="mr-2 h-3.5 w-3.5" />
        Chat
      </Button>

      <AppDialog
        open={open}
        onOpenChange={setOpen}
        title="Start chat"
        description={`Message ${vendorName ?? "vendor"} about this order.`}
        icon={<MessageSquare size={16} />}
        footer={
          <>
            <Button
              className="h-11 px-8 bg-zinc-900 text-[#D4AF37]"
              disabled={startM.isPending || !msg.trim()}
              onClick={() => {
                startM.mutate(
                  { vendorId, orderId, initialMessage: msg.trim() },
                  {
                    onSuccess: (c) => {
                      setOpen(false);
                      setMsg("");
                      router.push(`/admin/chat/${c.id}`);
                    },
                  },
                );
              }}
            >
              {startM.isPending ? "Starting..." : "Start"}
            </Button>

            <Button variant="outline" className="h-11 px-6" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </>
        }
      >
        <Textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="min-h-28"
          placeholder="Type your message..."
        />
      </AppDialog>
    </>
  );
}