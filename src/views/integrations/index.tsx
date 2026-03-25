"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { Button } from "@/components/ui/button";
import { CreditCard, Truck, Map, Mail, Settings, AlertCircle, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { IntegrationApp, IntegrationConfigModal } from "./actions";

// --- DUMMY DATA ---
const INITIAL_APPS: IntegrationApp[] = [
  // Payments
  { id: "1", name: "Paystack Payments", provider: "Paystack", category: "payment", description: "Accept payments via Card, Bank Transfer, and USSD in Nigeria.", status: "connected", isLiveMode: true, apiKey: "pk_live_xxxx", secretKey: "sk_live_xxxx" },
  { id: "2", name: "Stripe", provider: "Stripe", category: "payment", description: "International payments for USD/GBP/EUR transactions.", status: "disconnected", isLiveMode: false },
  
  // Logistics
  { id: "3", name: "GIG Logistics", provider: "GIGL", category: "delivery", description: "Automated waybill generation and pickup requests.", status: "connected", isLiveMode: true, apiKey: "gig_test_xxx" },
  { id: "4", name: "DHL Express", provider: "DHL", category: "delivery", description: "International shipping and tracking integration.", status: "disconnected", isLiveMode: false },
  
  // Maps
  { id: "5", name: "Google Maps Platform", provider: "Google", category: "map", description: "Address autocomplete, geocoding, and distance matrix.", status: "error", isLiveMode: true, apiKey: "AIzaSyD..." },
  
  // Email
  { id: "6", name: "SendGrid Email", provider: "SendGrid", category: "email", description: "Transactional email delivery for order receipts.", status: "connected", isLiveMode: true },
];

export default function IntegrationsView() {
  const [apps, setApps] = useState<IntegrationApp[]>(INITIAL_APPS);
  const [selectedApp, setSelectedApp] = useState<IntegrationApp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stats calculation
  const connectedCount = apps.filter(a => a.status === "connected").length;
  const errorCount = apps.filter(a => a.status === "error").length;

  // Handlers
  const handleConfigure = (app: IntegrationApp) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleSaveIntegration = (updatedApp: IntegrationApp) => {
    // If keys are present, assume connected
    const status = (updatedApp.apiKey && updatedApp.apiKey.length > 5) ? "connected" : "disconnected";
    
    setApps(apps.map(a => a.id === updatedApp.id ? { ...updatedApp, status } : a));
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
        <Button variant="outline" size="sm" className="gap-2 text-xs">
           <Settings size={14} /> Developer Docs
        </Button>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-8">
        
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Active Integrations" value={connectedCount.toString()} icon={CheckCircle2} variant="default" />
          <StatCard label="Total Available" value={apps.length.toString()} icon={Settings} variant="indigo" />
          <StatCard label="System Errors" value={errorCount.toString()} icon={AlertCircle} variant="rose" />
        </div>

        {/* TABS */}
        <Tabs defaultValue="all" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                { value: "all", label: "All Apps", count: apps.length, variant: "default" },
                { value: "payment", label: "Payments", count: apps.filter(a => a.category === "payment").length, variant: "emerald" },
                { value: "delivery", label: "Logistics", count: apps.filter(a => a.category === "delivery").length, variant: "amber" },
              ]}
            />
          </div>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.map((app) => (
                    <IntegrationCard key={app.id} app={app} onConfigure={() => handleConfigure(app)} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="payment" className="mt-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.filter(a => a.category === "payment").map((app) => (
                    <IntegrationCard key={app.id} app={app} onConfigure={() => handleConfigure(app)} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="delivery" className="mt-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.filter(a => a.category === "delivery").map((app) => (
                    <IntegrationCard key={app.id} app={app} onConfigure={() => handleConfigure(app)} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* CONFIGURATION MODAL */}
      <IntegrationConfigModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedApp}
        onSave={handleSaveIntegration}
      />

    </div>
  );
}

// --- SUB-COMPONENT: INTEGRATION CARD ---
function IntegrationCard({ app, onConfigure }: { app: IntegrationApp, onConfigure: () => void }) {
    
    // Icon Helper
    const getIcon = () => {
        switch(app.category) {
            case "payment": return <CreditCard size={20} />;
            case "delivery": return <Truck size={20} />;
            case "map": return <Map size={20} />;
            case "email": return <Mail size={20} />;
            default: return <Settings size={20} />;
        }
    }

    return (
        <div className={`
            bg-white border rounded-xl p-5 shadow-sm transition-all relative flex flex-col justify-between h-56
            ${app.status === "connected" ? "border-zinc-200" : "border-zinc-200 opacity-80 hover:opacity-100"}
        `}>
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-white shadow-sm ${
                        app.category === "payment" ? "bg-emerald-600" : 
                        app.category === "delivery" ? "bg-amber-500" : 
                        "bg-zinc-900"
                    }`}>
                        {getIcon()}
                    </div>
                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                         app.status === "connected" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                         app.status === "error" ? "bg-red-50 text-red-600 border border-red-100" : 
                         "bg-zinc-100 text-zinc-500"
                    }`}>
                        {app.status === "error" ? "Auth Error" : app.status}
                    </div>
                </div>

                <h3 className="font-bold text-zinc-900 text-lg">{app.name}</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{app.description}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                    <div className={`w-2 h-2 rounded-full ${app.isLiveMode ? "bg-blue-500" : "bg-zinc-300"}`} />
                    {app.isLiveMode ? "LIVE" : "TEST"}
                </div>
                <Button variant="outline" size="sm" onClick={onConfigure} className="h-8 text-xs bg-zinc-50 hover:bg-white hover:text-indigo-600">
                    Configure
                </Button>
            </div>
        </div>
    )
}