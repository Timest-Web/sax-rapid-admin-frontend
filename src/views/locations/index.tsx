/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Map, Settings2, Trash2, Globe } from "lucide-react";
import { getCountryColumns, Country, RegionState } from "./column";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
          <MetricCard
            label="Active Countries"
            value={countries.filter((c) => c.status === "active").length.toString()}
          />
          <MetricCard
            label="Total Regions Mapped"
            value={countries
              .reduce((acc, curr) => acc + curr.statesList.length, 0)
              .toString()}
          />
          <MetricCard label="Map Coverage" value="85%" />
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

  const handleSubmit = () => {
    if (!name || !code || !currency || !gateway) return;

    const newCountry: Country = {
      id: `LOC-${code.toUpperCase()}`,
      name,
      code: code.toUpperCase(),
      currency: currency.toUpperCase(),
      gateway,
      regions: 0, // Starts at 0, configured later
      status: "inactive", // Default to inactive so it doesn't go live immediately
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
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe size={18} /> Expand to New Country
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-700">Country Name <span className="text-red-500">*</span></Label>
            <Input
              placeholder="e.g. Kenya"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-700">ISO Code (2-Letter) <span className="text-red-500">*</span></Label>
              <Input
                placeholder="e.g. KE"
                maxLength={2}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-700">Currency Code <span className="text-red-500">*</span></Label>
              <Input
                placeholder="e.g. KES"
                maxLength={3}
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-700">Payment Gateway Integration <span className="text-red-500">*</span></Label>
            <Select value={gateway} onValueChange={setGateway}>
              <SelectTrigger>
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
          
          <p className="text-[10px] text-zinc-500 font-medium">
            New countries are added as <span className="font-bold">INACTIVE</span> by default. You must configure their states/regions before marking them active.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name || !code || !currency || !gateway}
            className="bg-zinc-900 text-white hover:bg-zinc-800"
          >
            Create Country
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

  const handleSubmit = () => {
    onSave({ ...country, status });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 size={18} /> Edit Config: {country.name}
          </DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-4">
          <div className="space-y-2">
            <Label>Market Status</Label>
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active (Trading Enabled)</SelectItem>
                <SelectItem value="inactive">
                  Inactive (Trading Disabled)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-zinc-500 mt-1">
              Marking as inactive hides this country from the user onboarding
              and checkout flows.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-zinc-900 text-white hover:bg-zinc-800"
          >
            Save Changes
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

  const handleSubmit = () => {
    onSave(country.id, states);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Map size={18} /> Manage Territories: {country.name}
          </DialogTitle>
          <p className="text-xs text-zinc-500">
            Total configured regions:{" "}
            <span className="font-bold">{states.length}</span>
          </p>
        </DialogHeader>

        {/* Input for new state */}
        <div className="flex items-end gap-2 mt-2">
          <div className="space-y-1.5 flex-1">
            <Label className="text-xs font-bold text-zinc-600">
              Add New Region / State
            </Label>
            <Input
              placeholder="e.g. Rivers State"
              value={newStateName}
              onChange={(e) => setNewStateName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddState()}
            />
          </div>
          <Button
            onClick={handleAddState}
            className="bg-zinc-900 text-white hover:bg-zinc-800"
          >
            Add
          </Button>
        </div>

        <div className="h-px bg-zinc-200 my-4" />

        {/* Scrollable List of States */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          {states.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-10">
              No states configured.
            </p>
          ) : (
            states.map((state) => (
              <div
                key={state.id}
                className="flex items-center justify-between p-3 border border-zinc-100 bg-zinc-50 rounded-lg group"
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
                    className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="mt-4 pt-4 border-t border-zinc-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-zinc-900 text-white hover:bg-zinc-800"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}