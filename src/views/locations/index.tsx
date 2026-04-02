/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Map, Settings2, Trash2, Globe, Globe2, Percent } from "lucide-react";
import { getCountryColumns, Country, RegionState } from "./column";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/cards/status-badge";
import { StatCard } from "@/components/cards/stat-card";

// --- DUMMY DATA WITH STATE ARRAYS ---
const INITIAL_COUNTRIES: Country[] = [
  {
    id: "LOC-NG",
    name: "Nigeria",
    code: "NG",
    currency: "NGN",
    gateway: "Paystack",
    regions: 36,
    status: "active",
    statesList: [
      { id: "1", name: "Lagos", status: "active" },
      { id: "2", name: "Abuja (FCT)", status: "active" },
      { id: "3", name: "Kano", status: "active" },
    ],
  },
  {
    id: "LOC-ZA",
    name: "South Africa",
    code: "ZA",
    currency: "ZAR",
    gateway: "PayFast",
    regions: 9,
    status: "active",
    statesList: [
      { id: "1", name: "Gauteng", status: "active" },
      { id: "2", name: "Western Cape", status: "active" },
    ],
  },
  {
    id: "LOC-GH",
    name: "Ghana",
    code: "GH",
    currency: "GHS",
    gateway: "Paystack",
    regions: 16,
    status: "inactive",
    statesList: [
      { id: "1", name: "Greater Accra", status: "active" },
      { id: "2", name: "Ashanti", status: "active" },
    ],
  },
];

export default function LocationsView() {
  const [countries, setCountries] = useState<Country[]>(INITIAL_COUNTRIES);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [managingStatesFor, setManagingStatesFor] = useState<Country | null>(
    null
  );

  // Handlers
  const handleEditConfig = (country: Country) => setEditingCountry(country);
  const handleManageStates = (country: Country) => setManagingStatesFor(country);

  // Add New Country Handler
  const handleAddCountry = (newCountry: Country) => {
    setCountries([newCountry, ...countries]);
  };

  // Save Config Handler
  const handleSaveConfig = (updatedCountry: Country) => {
    setCountries(
      countries.map((c) => (c.id === updatedCountry.id ? updatedCountry : c))
    );
    setEditingCountry(null);
  };

  // Save States Handler
  const handleSaveStates = (countryId: string, updatedStates: RegionState[]) => {
    setCountries(
      countries.map((c) =>
        c.id === countryId
          ? { ...c, statesList: updatedStates, regions: updatedStates.length }
          : c
      )
    );
  };

  const columns = useMemo(
    () =>
      getCountryColumns({
        onManageStates: handleManageStates,
        onEditConfig: handleEditConfig,
      }),
    []
  );

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
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs gap-2 rounded-md"
        >
          <Plus size={14} /> Add Country
        </Button>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-6 mt-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Active Countries"
            value={countries.filter((c) => c.status === "active").length.toString()}
            icon={Globe}
            variant="amber"
          />
          <StatCard
            label="Total Regions Mapped"
            value={countries
              .reduce((acc, curr) => acc + curr.statesList.length, 0)
              .toString()}
            icon={Map}
            variant="emerald"
          />
          <StatCard
            label="Map Coverage"
            value="85%"
            icon={Percent}
            variant="indigo"
          />
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
          <DataTable columns={columns} data={countries} />
        </div>
      </main>

      {/* MODALS */}
      <AddCountryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCountry}
      />

      {editingCountry && (
        <EditConfigModal
          country={editingCountry}
          isOpen={!!editingCountry}
          onClose={() => setEditingCountry(null)}
          onSave={handleSaveConfig}
        />
      )}

      {managingStatesFor && (
        <ManageStatesModal
          country={managingStatesFor}
          isOpen={!!managingStatesFor}
          onClose={() => setManagingStatesFor(null)}
          onSave={handleSaveStates}
        />
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5 flex items-center justify-between shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        {label}
      </p>
      <p className="text-2xl font-bold font-mono text-zinc-900">{value}</p>
    </div>
  );
}

// ==========================================
// MODAL: Add New Country
// ==========================================
function AddCountryModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (c: Country) => void;
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [currency, setCurrency] = useState("");
  const [gateway, setGateway] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !currency || !gateway) return;

    const newCountry: Country = {
      id: `LOC-${code.toUpperCase()}`,
      name,
      code: code.toUpperCase(),
      currency: currency.toUpperCase(),
      gateway,
      regions: 0,
      status: "inactive",
      statesList: [],
    };

    onSave(newCountry);
    onClose();

    // Reset Form
    setName("");
    setCode("");
    setCurrency("");
    setGateway("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
        {/* ─── HEADER ─── */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Globe size={16} />
              </div>
              Expand to New Country
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              Set up a new geographical region, assign its currency, and configure the payment gateway.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* ─── FORM ─── */}
        <form id="addCountryForm" onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Country Name <span className="text-[#D4AF37]">*</span>
            </Label>
            <Input
              placeholder="e.g. Kenya"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-medium focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                ISO Code (2-Letter) <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                placeholder="e.g. KE"
                maxLength={2}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Currency Code <span className="text-[#D4AF37]">*</span>
              </Label>
              <Input
                placeholder="e.g. KES"
                maxLength={3}
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                required
                className="h-11 font-mono bg-zinc-50/50 border-zinc-200 text-sm focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Payment Gateway Integration <span className="text-[#D4AF37]">*</span>
            </Label>
            <Select value={gateway} onValueChange={setGateway} required>
              <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-bold focus:ring-[#D4AF37] transition-all rounded-lg">
                <SelectValue placeholder="Select Gateway Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Paystack">Paystack</SelectItem>
                <SelectItem value="Flutterwave">Flutterwave</SelectItem>
                <SelectItem value="Stripe">Stripe</SelectItem>
                <SelectItem value="PayFast">PayFast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
            <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
              New countries are added as <strong className="text-zinc-900">INACTIVE</strong> by default. 
              Configure their states/regions before marking them active.
            </p>
          </div>
        </form>

        {/* ─── FOOTER ─── */}
        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 sm:justify-between flex-row-reverse">
          <Button
            type="submit"
            form="addCountryForm"
            disabled={!name || !code || !currency || !gateway}
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            Create Country
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11 transition-all"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// MODAL: Edit Country Configuration
// ==========================================
function EditConfigModal({
  country,
  isOpen,
  onClose,
  onSave,
}: {
  country: Country;
  isOpen: boolean;
  onClose: () => void;
  onSave: (c: Country) => void;
}) {
  const [status, setStatus] = useState<"active" | "inactive">(country.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...country, status });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
        {/* ─── HEADER ─── */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Settings2 size={16} />
              </div>
              Edit Config: {country.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              Enable or disable trading operations for this specific market.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* ─── FORM ─── */}
        <form id="editConfigForm" onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Market Status <span className="text-[#D4AF37]">*</span>
            </Label>
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-bold focus:ring-[#D4AF37] transition-all rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active (Trading Enabled)</SelectItem>
                <SelectItem value="inactive">Inactive (Trading Disabled)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-zinc-500 mt-2 pl-1 leading-relaxed">
              Marking as inactive hides this country from the user onboarding
              and checkout flows entirely.
            </p>
          </div>
        </form>

        {/* ─── FOOTER ─── */}
        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 sm:justify-between flex-row-reverse">
          <Button
            type="submit"
            form="editConfigForm"
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-xl transition-all shadow-md"
          >
            Save Changes
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11 transition-all"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// MODAL: Manage Regions / States
// ==========================================
function ManageStatesModal({
  country,
  isOpen,
  onClose,
  onSave,
}: {
  country: Country;
  isOpen: boolean;
  onClose: () => void;
  onSave: (countryId: string, states: RegionState[]) => void;
}) {
  const [states, setStates] = useState<RegionState[]>(country.statesList);
  const [newStateName, setNewStateName] = useState("");

  const handleAddState = () => {
    if (!newStateName.trim()) return;
    const newState: RegionState = {
      id: Math.random().toString(36).substr(2, 9),
      name: newStateName.trim(),
      status: "active",
    };
    setStates([...states, newState]);
    setNewStateName("");
  };

  const handleRemoveState = (id: string) => {
    setStates(states.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(country.id, states);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] h-[85vh] flex flex-col bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl">
        {/* ─── HEADER ─── */}
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Map size={16} />
              </div>
              Territories: {country.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 pl-11 leading-relaxed">
              Manage configured states or regions. Total active territories: <strong className="text-zinc-900 font-bold">{states.length}</strong>.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* ─── INPUT AREA ─── */}
        <div className="p-6 pb-2 shrink-0 space-y-4">
          <div className="flex items-end gap-3">
            <div className="space-y-1.5 flex-1">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Add New Region / State
              </Label>
              <Input
                placeholder="e.g. Rivers State"
                value={newStateName}
                onChange={(e) => setNewStateName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddState()}
                className="h-11 bg-zinc-50/50 border-zinc-200 text-sm font-medium focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37] transition-all rounded-lg"
              />
            </div>
            <Button
              onClick={handleAddState}
              disabled={!newStateName.trim()}
              className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-6 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              Add
            </Button>
          </div>
          <div className="h-px w-full bg-zinc-100 mt-4" />
        </div>

        {/* ─── SCROLLABLE STATES LIST ─── */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2 custom-scrollbar">
          {states.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
              <Map size={24} className="text-zinc-300 mb-2" />
              <p className="text-sm font-medium text-zinc-500 text-center">
                No states configured yet.
              </p>
            </div>
          ) : (
            states.map((state) => (
              <div
                key={state.id}
                className="flex items-center justify-between px-4 py-3 border border-zinc-200 bg-white rounded-xl shadow-sm group hover:border-zinc-300 transition-colors"
              >
                <div>
                  <p className="text-sm font-bold text-zinc-900">
                    {state.name}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={state.status} />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveState(state.id)}
                    className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ─── FOOTER ─── */}
        <form id="saveStatesForm" onSubmit={handleSubmit} className="shrink-0">
          <DialogFooter className="p-6 pt-4 border-t border-zinc-100 sm:justify-between flex-row-reverse bg-white">
            <Button
              type="submit"
              className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-xl transition-all shadow-md"
            >
              Save Regions
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl px-6 h-11 transition-all"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}