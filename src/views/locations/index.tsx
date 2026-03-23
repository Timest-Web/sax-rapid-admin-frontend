"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Globe, Navigation } from "lucide-react";
import { countryColumns } from "./column";
import { COUNTRIES, GEO_RULES } from "@/src/lib/dummy_data";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function LocationsView() {
  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-20">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / Geography
          </h1>
        </div>
        <Button variant="default" size="sm">
          <Plus className="mr-2 h-3 w-3" /> Add Country
        </Button>
      </header>

      <main className="p-6 max-w-400 mx-auto space-y-6">
        <Tabs defaultValue="territories" className="w-full flex flex-col">
          <TabsList className="bg-transparent p-0 h-12 justify-start w-full border-b border-zinc-200 mb-6">
            <TabsTrigger
              value="territories"
              className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 data-[state=active]:border-sax-gold data-[state=active]:text-zinc-900 data-[state=active]:bg-transparent"
            >
              Territories
            </TabsTrigger>
            <TabsTrigger
              value="logic"
              className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 data-[state=active]:border-sax-gold data-[state=active]:text-zinc-900 data-[state=active]:bg-transparent"
            >
              Discovery Logic (Geo-AI)
            </TabsTrigger>
          </TabsList>

          {/* ─── TAB 1: COUNTRIES CRUD ─── */}
          <TabsContent value="territories">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Summary Cards */}
              <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard label="Active Countries" value="4" />
                <MetricCard label="Total Currencies" value="5" />
                <MetricCard label="Map Coverage" value="85%" />
              </div>

              {/* Table */}
              <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                <DataTable columns={countryColumns} data={COUNTRIES} />
              </div>
            </div>
          </TabsContent>

          {/* ─── TAB 2: GEO-LOGIC (MODULE 5) ─── */}
          <TabsContent value="logic">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Configuration Panel */}
              <div className="lg:col-span-4 space-y-6">
                {/* 1. Radius Settings */}
                <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-sax-gold">
                    <Navigation size={16} />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900">
                      Search Radius
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="text-xs">
                          Primary Radius (Local)
                        </Label>
                        <span className="font-mono text-xs font-bold">
                          50 KM
                        </span>
                      </div>
                      <Slider
                        defaultValue={[50]}
                        max={100}
                        step={1}
                        className="w-full 
                        **:[[role=slider]]:h-4
                        **:[[role=slider]]:w-4
                      **:[[role=slider]]:bg-black
                        **:[[role=slider]]:border-2
                      **:[[role=slider]]:border-white
                        **:[[role=slider]]:shadow-md
                        **:[[role=slider]]:transition
                        **:[[role=slider]]:hover:scale-110
                        [&_.relative]:h-1.5
                      [&_.relative]:bg-zinc-200
                      [&_[data-orientation=horizontal]>span:first-child]:bg-black"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="text-xs">Extended Search</Label>
                        <span className="font-mono text-xs font-bold">
                          500 KM
                        </span>
                      </div>
                      <Slider
                        defaultValue={[75]}
                        max={100}
                        step={1}
                        className="w-full 
                        **:[[role=slider]]:h-4
                        **:[[role=slider]]:w-4
                      **:[[role=slider]]:bg-black
                        **:[[role=slider]]:border-2
                      **:[[role=slider]]:border-white
                        **:[[role=slider]]:shadow-md
                        **:[[role=slider]]:transition
                        **:[[role=slider]]:hover:scale-110
                        [&_.relative]:h-1.5
                      [&_.relative]:bg-zinc-200
                      [&_[data-orientation=horizontal]>span:first-child]:bg-black"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Switches */}
                <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold">
                      Cross-Border Display
                    </Label>
                    <Switch />
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    If enabled, buyers can see products from neighboring
                    countries if no local stock is found.
                  </p>

                  <div className="h-px bg-zinc-100 my-2" />

                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold">
                      Auto-Currency Convert
                    </Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              {/* Algorithm Priority Visualizer */}
              <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-sax-gold" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900">
                      Ranking Algorithm
                    </h3>
                  </div>
                  <Button variant="outline" size="sm">
                    Simulate Search
                  </Button>
                </div>

                {/* Visual Rules List */}
                <div className="space-y-3">
                  {GEO_RULES.map((rule, index) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-6 w-6 rounded-full bg-zinc-200 flex items-center justify-center font-mono text-xs font-bold text-zinc-500">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900">
                            {rule.rule}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                            {rule.priority} Priority
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                        {rule.impact}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Fake Map Visualization */}
                <div className="mt-6 h-64 bg-zinc-900 rounded-lg relative overflow-hidden flex items-center justify-center border border-zinc-800">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "radial-gradient(#444 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                  <div className="text-center z-10">
                    <Globe className="w-12 h-12 text-sax-gold mx-auto mb-2 opacity-50" />
                    <p className="text-zinc-500 font-mono text-xs">
                      [ GOOGLE_MAPS_API_INTEGRATION ]
                    </p>
                    <p className="text-zinc-600 text-[10px] mt-1">
                      Visualizing vendor clusters...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        {label}
      </p>
      <p className="text-xl font-bold font-mono text-zinc-900">{value}</p>
    </div>
  );
}
