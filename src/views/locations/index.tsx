
"use client";

import { useMemo, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Globe, Map, Percent, Settings2 } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { StatusBadge } from "@/components/cards/status-badge";

import { getLocationColumns } from "./column";

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

import type { AdminLocation } from "@/src/features/locations/api";
import {
  useAdminLocations,
  useAdminLocationStats,
  useCountries,
  useStatesByCountry,
  useCreateAdminLocation,
  useUpdateAdminLocation,
  useToggleStateStatus,
} from "@/src/features/locations/hooks";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

function parseCountryIdFromLocationId(locationId: string): number | undefined {
  // "LOC-07" -> 7
  const m = String(locationId ?? "").match(/(\d+)/);
  if (!m) return undefined;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) ? n : undefined;
}

function percentLabel(n?: number) {
  if (!Number.isFinite(n)) return "—";
  return `${Math.round(Number(n))}%`;
}

export default function LocationsView() {
  const statsQ = useAdminLocationStats();
  const locationsQ = useAdminLocations();

  const createM = useCreateAdminLocation();
  const updateM = useUpdateAdminLocation();

  const [createOpen, setCreateOpen] = useState(false);
  const [editLoc, setEditLoc] = useState<AdminLocation | null>(null);
  const [statesLoc, setStatesLoc] = useState<AdminLocation | null>(null);

  const locations = locationsQ.data ?? [];

  const columns = useMemo(
    () =>
      getLocationColumns({
        onManageStates: (loc) => setStatesLoc(loc),
        onEdit: (loc) => setEditLoc(loc),
      }),
    [],
  );

  const totalCountries = statsQ.data?.totalCountries;
  const activeMarkets = statsQ.data?.activeMarkets;

  const coverage =
    totalCountries && activeMarkets != null && totalCountries > 0
      ? (activeMarkets / totalCountries) * 100
      : undefined;

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-20">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / Geography
          </h1>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs gap-2 rounded-md"
        >
          <Plus size={14} /> Add Location
        </Button>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Total Countries"
            value={statsQ.data ? String(statsQ.data.totalCountries) : "—"}
            icon={Globe}
            variant="amber"
          />
          <StatCard
            label="Active Markets"
            value={statsQ.data ? String(statsQ.data.activeMarkets) : "—"}
            icon={Map}
            variant="emerald"
          />
          <StatCard
            label="Map Coverage"
            value={percentLabel(coverage)}
            icon={Percent}
            variant="indigo"
          />
        </div>

        <div>
          {locationsQ.isLoading ? (
            <TableSkeleton columns={columns.length} rows={5} />
          ) : locationsQ.isError ? (
            <div className="p-6 text-sm text-rose-600">Failed to load locations.</div>
          ) : (
            <DataTable columns={columns} data={locations} />
          )}
        </div>
      </main>

      {/* Create */}
      <CreateLocationModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        isSaving={createM.isPending}
        onSubmit={(payload) => {
          createM.mutate(payload, { onSuccess: () => setCreateOpen(false) });
        }}
      />

      {/* Edit */}
      {editLoc && (
        <EditLocationModal
          location={editLoc}
          open={!!editLoc}
          onOpenChange={(v) => !v && setEditLoc(null)}
          isSaving={updateM.isPending}
          onSubmit={(payload) => {
            updateM.mutate(
              { locationId: editLoc.id, payload },
              { onSuccess: () => setEditLoc(null) },
            );
          }}
        />
      )}

      {/* States */}
      {statesLoc && (
        <ManageStatesModal
          location={statesLoc}
          open={!!statesLoc}
          onOpenChange={(v) => !v && setStatesLoc(null)}
        />
      )}
    </div>
  );
}

/* =========================
 * Create Location Modal
 * POST /api/admin/locations
 * ========================= */
function CreateLocationModal(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isSaving?: boolean;
  onSubmit: (payload: {
    name: string;
    code: string;
    currency: string;
    marketStatus: string;
  }) => void;
}) {
  const { open, onOpenChange, isSaving, onSubmit } = props;

  // optional: show supported countries list
  const countriesQ = useCountries(false, open);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [currency, setCurrency] = useState("");
  const [marketStatus, setMarketStatus] = useState("Inactive");

  const canSubmit =
    !!name.trim() && !!code.trim() && !!currency.trim() && !!marketStatus;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130 max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col">
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              Create Location
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto min-h-0">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Supported countries (optional helper)
            </Label>
            <Select
              value={name}
              onValueChange={(v) => setName(v)}
              disabled={isSaving}
            >
              <SelectTrigger className="h-11 bg-zinc-50 border-zinc-200 rounded-lg">
                <SelectValue placeholder={countriesQ.isLoading ? "Loading..." : "Select"} />
              </SelectTrigger>
              <SelectContent>
                {(countriesQ.data ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Country Name *
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
              className="h-11 bg-zinc-50 border-zinc-200 rounded-lg"
              placeholder="Nigeria"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Code (ISO) *
              </Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                disabled={isSaving}
                className="h-11 bg-zinc-50 border-zinc-200 rounded-lg font-mono"
                placeholder="NG"
                maxLength={5}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Currency *
              </Label>
              <Input
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                disabled={isSaving}
                className="h-11 bg-zinc-50 border-zinc-200 rounded-lg font-mono"
                placeholder="NGN"
                maxLength={6}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Market Status *
            </Label>
            <Select
              value={marketStatus}
              onValueChange={setMarketStatus}
              disabled={isSaving}
            >
              <SelectTrigger className="h-11 bg-zinc-50 border-zinc-200 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 sm:justify-between flex-row-reverse shrink-0">
          <Button
            disabled={!canSubmit || isSaving}
            onClick={() =>
              onSubmit({
                name: name.trim(),
                code: code.trim(),
                currency: currency.trim(),
                marketStatus,
              })
            }
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs font-bold uppercase tracking-widest rounded-xl px-8 h-11"
          >
            {isSaving ? "Creating..." : "Create"}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* =========================
 * Edit Location Modal
 * PATCH /api/admin/locations/{locationId}
 * ========================= */
function EditLocationModal(props: {
  location: AdminLocation;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isSaving?: boolean;
  onSubmit: (payload: { name?: string; currency?: string; marketStatus?: string }) => void;
}) {
  const { location, open, onOpenChange, isSaving, onSubmit } = props;

  const [countryName, setCountryName] = useState(location.countryName ?? "");
  const [currency, setCurrency] = useState(location.currency ?? "");
  const [marketStatus, setMarketStatus] = useState(location.marketStatus ?? "Inactive");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130 max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col">
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              <Settings2 size={16} /> Edit Location
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2 leading-relaxed">
              <div className="mt-2">
                Current status: <StatusBadge status={location.marketStatus} />
              </div>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto min-h-0">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Country Name
            </Label>
            <Input
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              disabled={isSaving}
              className="h-11 bg-zinc-50 border-zinc-200 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Currency
            </Label>
            <Input
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              disabled={isSaving}
              className="h-11 bg-zinc-50 border-zinc-200 rounded-lg font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Market Status
            </Label>
            <Select value={marketStatus} onValueChange={setMarketStatus} disabled={isSaving}>
              <SelectTrigger className="h-11 bg-zinc-50 border-zinc-200 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 sm:justify-between flex-row-reverse shrink-0">
          <Button
            onClick={() =>
              onSubmit({
                name: countryName.trim() ? countryName.trim() : undefined,
                currency: currency.trim() ? currency.trim() : undefined,
                marketStatus,
              })
            }
            disabled={isSaving}
            className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs font-bold uppercase tracking-widest rounded-xl px-8 h-11"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* =========================
 * Manage States Modal
 * GET /api/Location/countries/{countryId}/states
 * PATCH /api/admin/locations/states/{id}/toggle
 * ========================= */
function ManageStatesModal(props: {
  location: AdminLocation;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { location, open, onOpenChange } = props;

  // countryId is derived from admin response id e.g. "LOC-07" -> 7
  const countryId = parseCountryIdFromLocationId(location.id);

  const statesQ = useStatesByCountry(countryId, open && !!countryId);
  const toggleM = useToggleStateStatus();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-175 max-h-[90vh] bg-white border-zinc-200 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col">
        <div className="relative p-6 pb-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 uppercase tracking-widest font-display">
              States: {location.countryName}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 overflow-y-auto min-h-0 space-y-3">
          {!countryId ? (
            <div className="text-sm text-rose-600">
              Could not derive countryId from location.id: <span className="font-mono">{location.id}</span>
            </div>
          ) : statesQ.isLoading ? (
            <div className="text-sm text-zinc-500">Loading states…</div>
          ) : statesQ.isError ? (
            <div className="text-sm text-rose-600">Failed to load states.</div>
          ) : (statesQ.data ?? []).length === 0 ? (
            <div className="text-sm text-zinc-500">No states returned.</div>
          ) : (
            (statesQ.data ?? []).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between px-4 py-3 border border-zinc-200 rounded-xl bg-white"
              >
                <div>
                  <div className="font-bold text-zinc-900">{s.name}</div>
                  
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={s.isActive ? "Active" : "Inactive"} />
                  <Button
                    variant="outline"
                    className="h-9 text-xs"
                    disabled={toggleM.isPending}
                    onClick={() => toggleM.mutate({ stateId: s.id, countryId })}
                  >
                    Toggle
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="p-6 pt-4 border-t border-zinc-100 sm:justify-between flex-row-reverse shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}