"use client";

import { useMemo, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Truck,
  Map,
  Mail,
  Settings,
  AlertCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";

import { IntegrationConfigModal } from "./actions";
import { mapIntegrationDtoToApp, type IntegrationApp } from "./mapper";
import { useIntegrations } from "@/src/features/integrations/hooks";

export default function IntegrationsView() {
  const integrationsQ = useIntegrations();

  const apps = useMemo<IntegrationApp[]>(() => {
    return (integrationsQ.data ?? []).map(mapIntegrationDtoToApp);
  }, [integrationsQ.data]);

  const [selectedApp, setSelectedApp] = useState<IntegrationApp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const connectedCount = apps.filter((a) => a.status === "connected").length;
  const errorCount = apps.filter((a) => a.status === "error").length;

  const openCreate = () => {
    setSelectedApp(null);
    setIsModalOpen(true);
  };

  const openConfigure = (app: IntegrationApp) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / API Integrations
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={openCreate}>
            <Plus size={14} /> Add Integration
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <Settings size={14} /> Developer Docs
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Active Integrations"
            value={integrationsQ.isLoading ? "—" : connectedCount.toString()}
            icon={CheckCircle2}
            variant="default"
          />
          <StatCard
            label="Total Available"
            value={integrationsQ.isLoading ? "—" : apps.length.toString()}
            icon={Settings}
            variant="indigo"
          />
          <StatCard
            label="System Errors"
            value={integrationsQ.isLoading ? "—" : errorCount.toString()}
            icon={AlertCircle}
            variant="rose"
          />
        </div>

        {/* TABS */}
        <Tabs defaultValue="all" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                { value: "all", label: "All Apps", count: apps.length, variant: "default" },
                {
                  value: "payment",
                  label: "Payments",
                  count: apps.filter((a) => a.category === "payment").length,
                  variant: "emerald",
                },
                {
                  value: "delivery",
                  label: "Logistics",
                  count: apps.filter((a) => a.category === "delivery").length,
                  variant: "amber",
                },
              ]}
            />
          </div>

          {integrationsQ.isError && (
            <div className="mt-6 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl p-4">
              Failed to load integrations.
            </div>
          )}

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app) => (
                <IntegrationCard key={app.id} app={app} onConfigure={() => openConfigure(app)} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payment" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps
                .filter((a) => a.category === "payment")
                .map((app) => (
                  <IntegrationCard key={app.id} app={app} onConfigure={() => openConfigure(app)} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="delivery" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps
                .filter((a) => a.category === "delivery")
                .map((app) => (
                  <IntegrationCard key={app.id} app={app} onConfigure={() => openConfigure(app)} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* MODAL */}
      <IntegrationConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedApp}
      />
    </div>
  );
}

function IntegrationCard({
  app,
  onConfigure,
}: {
  app: IntegrationApp;
  onConfigure: () => void;
}) {
  const getIcon = () => {
    switch (app.category) {
      case "payment":
        return <CreditCard size={20} />;
      case "delivery":
        return <Truck size={20} />;
      case "map":
        return <Map size={20} />;
      case "email":
        return <Mail size={20} />;
      default:
        return <Settings size={20} />;
    }
  };

  const badge =
    app.status === "connected"
      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
      : app.status === "error"
        ? "bg-red-50 text-red-600 border border-red-100"
        : "bg-zinc-100 text-zinc-500 border border-zinc-200";

  return (
    <div
      className={[
        "bg-white border rounded-xl p-5 shadow-sm transition-all relative flex flex-col justify-between h-56",
        app.status === "connected"
          ? "border-zinc-200"
          : "border-zinc-200 opacity-90 hover:opacity-100",
      ].join(" ")}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div
            className={[
              "h-12 w-12 rounded-lg flex items-center justify-center text-white shadow-sm",
              app.category === "payment"
                ? "bg-emerald-600"
                : app.category === "delivery"
                  ? "bg-amber-500"
                  : "bg-zinc-900",
            ].join(" ")}
          >
            {getIcon()}
          </div>

          <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${badge}`}>
            {app.status === "error" ? "Auth Error" : app.status}
          </div>
        </div>

        <h3 className="font-bold text-zinc-900 text-lg">{app.name}</h3>
        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
          {app.description}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
          <div className={`w-2 h-2 rounded-full ${app.isLiveMode ? "bg-blue-500" : "bg-zinc-300"}`} />
          {app.isLiveMode ? "LIVE" : "TEST"}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onConfigure}
          className="h-8 text-xs bg-zinc-50 hover:bg-white hover:text-indigo-600"
        >
          Configure
        </Button>
      </div>
    </div>
  );
}