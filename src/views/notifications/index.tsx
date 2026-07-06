"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { Button } from "@/components/ui/button";
import { Send, BellRing, MailCheck } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";

import { notificationColumns } from "./column";
import { ComposeNotificationModal, NotificationDetailsModal } from "./actions";

import type { NotificationDto } from "@/src/features/notifications/api";
import {
  useNotifications,
  useNotificationCount,
  useDeleteNotification,
  useMarkAllNotificationsRead,
} from "@/src/features/notifications/hooks";

export default function NotificationsView() {
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [page] = useState(1);
  const pageSize = 20;

  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const [selected, setSelected] = useState<NotificationDto | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const countQ = useNotificationCount();
  const listQ = useNotifications({
    page,
    pageSize,
    unreadOnly: tab === "unread",
  });

  const delM = useDeleteNotification();
  const markAllM = useMarkAllNotificationsRead();

  const total = countQ.data?.total ?? 0;
  const unread = countQ.data?.unread ?? 0;
  const read = Math.max(0, total - unread);

  const cols = useMemo(
    () =>
      notificationColumns({
        onView: (n) => {
          setSelected(n);
          setDetailsOpen(true);
        },
        onDelete: (id) => delM.mutate(id),
      }),
    [delM],
  );

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Notifications
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-9"
            disabled={markAllM.isPending || unread === 0}
            onClick={() => markAllM.mutate()}
          >
            Mark all read
          </Button>

          <Button
            onClick={() => setIsComposeOpen(true)}
            className="bg-zinc-900 hover:bg-zinc-800 text-xs h-9"
          >
            <Send size={14} className="mr-2" /> Send Notification
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Notifications"
            value={countQ.isLoading ? "—" : String(total)}
            icon={BellRing}
            variant="default"
          />
          <StatCard
            label="Unread"
            value={countQ.isLoading ? "—" : String(unread)}
            icon={MailCheck}
            variant="amber"
          />
          <StatCard
            label="Read"
            value={countQ.isLoading ? "—" : String(read)}
            icon={MailCheck}
            variant="emerald"
          />
        </div>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as any)}
          className="w-full flex flex-col"
        >
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "all",
                  label: "All",
                  count: total,
                  variant: "default",
                },
                {
                  value: "unread",
                  label: "Unread",
                  count: unread,
                  variant: "amber",
                },
              ]}
            />
          </div>

          <TabsContent value="all">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <DataTable columns={cols} data={listQ.data?.items ?? []} />
            </div>
          </TabsContent>

          <TabsContent value="unread">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <DataTable columns={cols} data={listQ.data?.items ?? []} />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* MODALS */}
      <ComposeNotificationModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />

      <NotificationDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        notification={selected}
      />
    </div>
  );
}
