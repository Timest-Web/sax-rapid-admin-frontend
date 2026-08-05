"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { useConversation, useMessages, useMarkRead, useSendMessage } from "@/src/features/chats/hooks";


function dateLabel(iso?: string | null) {
  if (!iso) return "";
  try { return new Date(iso).toLocaleString(); } catch { return String(iso); }
}

function getCurrentUserId(session: any): string | undefined {
  return (
    session?.user?.id ??
    session?.id ??
    session?.userId ??
    session?.sub ??
    session?.profile?.sub
  );
}

export default function ChatConversationView() {
  const params = useParams();
  const raw = (params as any)?.conversationId;
  const conversationId = Array.isArray(raw) ? raw[0] : raw;

  const { data: session } = useSession();
  const myUserId = getCurrentUserId(session);

  const convQ = useConversation(conversationId);
  const msgsQ = useMessages(conversationId, 1, 50);

  const markReadM = useMarkRead();
  const sendM = useSendMessage();

  const [text, setText] = useState("");

  const conversation = convQ.data;
  const messages = msgsQ.data ?? [];

  // mark as read on open
  useEffect(() => {
    if (conversationId) markReadM.mutate(conversationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // scroll to bottom on updates
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const headerTitle = conversation?.vendorName ?? "Conversation";

  const ordered = useMemo(() => {
    // your API returns already in order; this is just a safe sort
    return [...messages].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  }, [messages]);

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans flex flex-col">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4 min-w-0">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />

          <Link
            href="/admin/chat"
            className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Inbox
          </Link>

          <div className="h-6 w-px bg-zinc-200" />

          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
              {conversation?.vendorImageUrl ? (
                <Image src={conversation.vendorImageUrl} alt={headerTitle} fill className="object-cover" />
              ) : null}
            </div>

            <div className="min-w-0">
              <div className="font-bold text-sm text-zinc-900 truncate">
                {headerTitle}
              </div>
              <div className="text-[10px] font-mono text-zinc-500 truncate">
                Order: {conversation?.orderId ?? "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-zinc-500">
          {conversation?.lastMessageAt ? `Last: ${dateLabel(conversation.lastMessageAt)}` : ""}
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-6 flex flex-col gap-4">
        <div className="flex-1 bg-white border border-zinc-200 rounded-2xl p-4 overflow-y-auto">
          {msgsQ.isLoading ? (
            <div className="text-sm text-zinc-500 p-4">Loading messages…</div>
          ) : msgsQ.isError ? (
            <div className="text-sm text-rose-600 p-4">Failed to load messages.</div>
          ) : ordered.length === 0 ? (
            <div className="text-sm text-zinc-500 p-4">No messages yet.</div>
          ) : (
            <div className="space-y-3">
              {ordered.map((m) => {
                const mine = myUserId ? m.senderId === myUserId : false;

                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={[
                        "max-w-[70%] rounded-2xl px-4 py-3 border text-sm",
                        mine
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-zinc-50 text-zinc-900 border-zinc-200",
                      ].join(" ")}
                    >
                      <div className="text-[10px] font-mono opacity-70 mb-1">
                        {m.senderName} • {dateLabel(m.createdAt)}
                      </div>
                      <div className="whitespace-pre-wrap">{m.content ?? "—"}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Composer */}
        <form
          className="bg-white border border-zinc-200 rounded-2xl p-3 flex items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!conversationId) return;
            const content = text.trim();
            if (!content) return;

            sendM.mutate(
              { conversationId, content, imageUrl: null },
              { onSuccess: () => setText("") },
            );
          }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 min-h-[44px] max-h-[140px] resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sax-gold/20"
          />

          <Button
            type="submit"
            className="h-11 px-5 bg-zinc-900 text-[#D4AF37]"
            disabled={sendM.isPending || !text.trim()}
          >
            <Send className="mr-2 h-4 w-4" />
            {sendM.isPending ? "Sending..." : "Send"}
          </Button>
        </form>
      </main>
    </div>
  );
}