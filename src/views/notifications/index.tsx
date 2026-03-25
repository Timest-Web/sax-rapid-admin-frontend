"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { Button } from "@/components/ui/button";
import { Send, BellRing, MailCheck, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { notificationColumns } from "./column";
import { ComposeNotificationModal, NotificationLog } from "./actions";

// --- DUMMY DATA ---
const INITIAL_LOGS: NotificationLog[] = [
  {
    id: "1",
    title: "Black Friday Sale Starts Now!",
    message: "Don't miss out on 50% off storewide.",
    target: "all",
    channels: ["email", "in_app"],
    status: "sent",
    sentAt: "2 hours ago",
    recipientCount: 1250,
  },
  {
    id: "2",
    title: "Important: Update your payout details",
    message: "We have updated our payment gateway.",
    target: "vendors",
    channels: ["email"],
    status: "sent",
    sentAt: "Yesterday",
    recipientCount: 450,
  },
  {
    id: "3",
    title: "Server Maintenance",
    message: "Downtime expected at 2am.",
    target: "all",
    channels: ["in_app", "sms"],
    status: "failed",
    sentAt: "Oct 20",
    recipientCount: 1250,
  },
];

export default function NotificationsView() {
  const [logs, setLogs] = useState<NotificationLog[]>(INITIAL_LOGS);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Handler to add new notification to list
  const handleSendNotification = (newLog: NotificationLog) => {
    setLogs([newLog, ...logs]);
  };

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / Notifications Center
          </h1>
        </div>
        <Button
          onClick={() => setIsComposeOpen(true)}
          className="bg-zinc-900 hover:bg-zinc-800 text-xs"
        >
          <Send size={14} className="mr-2" /> New Broadcast
        </Button>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Sent (MTD)"
            value="15,420"
            icon={BellRing}
            variant="default"
          />
          <StatCard
            label="Delivery Rate"
            value="98.2%"
            icon={MailCheck}
            variant="emerald"
          />
          <StatCard
            label="Failed Delivery"
            value="45"
            icon={AlertCircle}
            variant="rose"
          />
        </div>

        {/* INFO BANNER */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 items-start">
          <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={16} />
          <div>
            <h3 className="text-sm font-bold text-blue-900">
              SMS Gateway Balance: ₦45,000
            </h3>
            <p className="text-xs text-blue-700 mt-1">
              You have enough credits for approx. 12,000 SMS messages.{" "}
              <span className="underline cursor-pointer font-bold">
                Top up now
              </span>
              .
            </p>
          </div>
        </div>

        {/* TABS */}
        <Tabs defaultValue="history" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "history",
                  label: "Broadcast History",
                  count: logs.length,
                  variant: "amber",
                },
                {
                  value: "scheduled",
                  label: "Scheduled",
                  count: 0,
                  variant: "indigo",
                },
              ]}
            />
          </div>

          {/* TAB 1: HISTORY */}
          <TabsContent value="history">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <DataTable columns={notificationColumns} data={logs} />
            </div>
          </TabsContent>

          {/* TAB 2: SCHEDULED */}
          <TabsContent value="scheduled">
            <div className="h-40 flex items-center justify-center text-zinc-400 text-sm mt-6 bg-white border border-zinc-200 rounded-lg">
              No scheduled notifications found.
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* COMPOSE MODAL */}
      <ComposeNotificationModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSend={handleSendNotification}
      />
    </div>
  );
}
