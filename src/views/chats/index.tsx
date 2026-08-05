/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MessageSquare, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useConversations, useUnreadCount } from "@/src/features/chats/hooks";

function dateLabel(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

export default function ChatInboxView() {
  const unreadQ = useUnreadCount();
  const convQ = useConversations();
  const [q, setQ] = useState("");

  const conversations = convQ.data ?? [];

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return conversations;
    return conversations.filter((c) =>
      [c.vendorName, c.buyerName, c.lastMessage?.content ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(s),
    );
  }, [conversations, q]);

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Support / Chat
          </h1>
        </div>

        <div className="text-xs font-mono text-zinc-600 flex items-center gap-2">
          <span>Unread:</span>
          <span className="px-2 py-1 rounded-md bg-zinc-100 border border-zinc-200 font-bold">
            {unreadQ.isLoading ? "—" : (unreadQ.data?.unreadCount ?? 0)}
          </span>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search conversations..."
              className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-zinc-200 bg-white outline-none focus:ring-2 focus:ring-sax-gold/20"
            />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
            <div className="font-bold text-sm text-zinc-800">Conversations</div>
            <div className="text-xs text-zinc-500">{filtered.length}</div>
          </div>

          {convQ.isLoading ? (
            <div className="p-6 text-sm text-zinc-500">
              Loading conversations...
            </div>
          ) : convQ.isError ? (
            <div className="p-6 text-sm text-rose-600">
              Failed to load conversations.
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="mx-auto h-7 w-7 text-zinc-300" />
              <div className="mt-2 text-sm font-bold text-zinc-900">
                No conversations
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                Start a chat from an order (Message Vendor).
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {filtered.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/admin/chats/${c.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50 transition-colors"
                  >
                    <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                      {c.vendorImageUrl ? (
                        <Image
                          src={c.vendorImageUrl}
                          alt={c.vendorName}
                          fill
                          className="object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-bold text-sm text-zinc-900 truncate">
                          {c.vendorName}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500">
                          {dateLabel(c.lastMessageAt)}
                        </div>
                      </div>

                      <div className="text-xs text-zinc-600 truncate">
                        {c.lastMessage?.content ?? "—"}
                      </div>

                      <div className="text-[10px] font-mono text-zinc-400 truncate">
                        Order: {c.orderId}
                      </div>
                    </div>

                    {c.unreadCount > 0 && (
                      <div className="px-2 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                        {c.unreadCount}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
