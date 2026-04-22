import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Hash, MapPin, Pencil, Plus, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { CreateTripInput, Trip, UpdateTripInput } from "../backend";
import {
  useActiveTrip,
  useCompleteTrip,
  useCreateTrip,
  useUpdateTrip,
} from "../hooks";
import {
  RATE_PER_MILE,
  calcEstimatedEarnings,
  formatEarnings,
  formatMiles,
} from "../types";

// ── helpers ────────────────────────────────────────────────────────────────

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

// ── Detail row for viewing mode ────────────────────────────────────────────

function DetailRow({
  label,
  value,
  accent = false,
}: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-0.5 rounded px-3 py-2.5 border ${accent ? "bg-primary/10 border-primary/40" : "bg-card border-border"}`}
    >
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">
        {label}
      </span>
      <span
        className={`text-sm font-semibold font-display leading-tight ${accent ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}

// ── Live Earnings Preview ──────────────────────────────────────────────────

function LiveEarningsPreview({ miles }: { miles: string }) {
  const m = Number.parseFloat(miles) || 0;
  const earnings = calcEstimatedEarnings(m);
  const ready = m > 0;

  return (
    <div
      data-ocid="new_trip.live_calc"
      className={`rounded border px-4 py-3 flex items-center justify-between transition-colors duration-200 ${ready ? "border-primary/40 bg-primary/10" : "border-border bg-card"}`}
    >
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
          Estimated Earnings
        </p>
        <p
          className={`text-3xl font-bold font-display leading-none ${ready ? "text-primary" : "text-muted-foreground"}`}
        >
          {ready ? formatEarnings(earnings) : "—"}
        </p>
      </div>
      <div className="text-right">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
          Rate
        </p>
        <p className="text-sm font-mono text-muted-foreground">
          ${RATE_PER_MILE.toFixed(3)} / mi
        </p>
      </div>
    </div>
  );
}

// ── New Trip Form ─────────────────────────────────────────────────────────

function NewTripForm() {
  const createTrip = useCreateTrip();
  const [form, setForm] = useState({
    date: "",
    loadId: "",
    pickupNumber: "",
    pickupTrailerNumber: "",
    pickupTime: "",
    pickupLocation: "",
    dropTime: "",
    dropoffLocation: "",
    totalMiles: "",
  });

  function set(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: CreateTripInput = {
      date: form.date,
      loadId: form.loadId,
      pickupNumber: form.pickupNumber,
      pickupTrailerNumber: form.pickupTrailerNumber,
      pickupTime: form.pickupTime,
      pickupLocation: form.pickupLocation,
      dropTime: form.dropTime,
      dropoffLocation: form.dropoffLocation,
      totalMiles: Number.parseFloat(form.totalMiles) || 0,
    };
    try {
      await createTrip.mutateAsync(input);
      toast.success("Trip started!");
    } catch {
      toast.error("Failed to start trip.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-ocid="new_trip.form"
      className="flex flex-col gap-4"
    >
      {/* Row 1: Date + Load ID */}
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Date">
          <Input
            data-ocid="new_trip.date_input"
            placeholder="04/21/2026"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            required
          />
        </FieldGroup>
        <FieldGroup label="Load ID">
          <Input
            data-ocid="new_trip.load_id_input"
            placeholder="LD-00123"
            value={form.loadId}
            onChange={(e) => set("loadId", e.target.value)}
            required
          />
        </FieldGroup>
      </div>

      {/* Row 2: Pickup Number + Pickup Trailer Number */}
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Pickup Number">
          <Input
            data-ocid="new_trip.pickup_number_input"
            placeholder="PU-8841"
            value={form.pickupNumber}
            onChange={(e) => set("pickupNumber", e.target.value)}
            required
          />
        </FieldGroup>
        <FieldGroup label="Pickup Trailer Number">
          <Input
            data-ocid="new_trip.pickup_trailer_number_input"
            placeholder="TR-4402"
            value={form.pickupTrailerNumber}
            onChange={(e) => set("pickupTrailerNumber", e.target.value)}
            required
          />
        </FieldGroup>
      </div>

      {/* Row 3: Pick Up Time + Drop Time */}
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Pick Up Time">
          <Input
            data-ocid="new_trip.pickup_time_input"
            placeholder="08:00 AM"
            value={form.pickupTime}
            onChange={(e) => set("pickupTime", e.target.value)}
            required
          />
        </FieldGroup>
        <FieldGroup label="Drop Time">
          <Input
            data-ocid="new_trip.drop_time_input"
            placeholder="06:00 PM"
            value={form.dropTime}
            onChange={(e) => set("dropTime", e.target.value)}
            required
          />
        </FieldGroup>
      </div>

      {/* Row 4: Pick Up Location + Drop Location */}
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Pick Up Location">
          <Input
            data-ocid="new_trip.pickup_location_input"
            placeholder="Chicago, IL"
            value={form.pickupLocation}
            onChange={(e) => set("pickupLocation", e.target.value)}
            required
          />
        </FieldGroup>
        <FieldGroup label="Drop Location">
          <Input
            data-ocid="new_trip.dropoff_location_input"
            placeholder="Dallas, TX"
            value={form.dropoffLocation}
            onChange={(e) => set("dropoffLocation", e.target.value)}
            required
          />
        </FieldGroup>
      </div>

      {/* Row 5: Miles */}
      <FieldGroup label="Miles">
        <Input
          data-ocid="new_trip.total_miles_input"
          type="number"
          placeholder="1250"
          value={form.totalMiles}
          onChange={(e) => set("totalMiles", e.target.value)}
          min={1}
          required
        />
      </FieldGroup>

      {/* Live earnings preview */}
      <LiveEarningsPreview miles={form.totalMiles} />

      <Button
        type="submit"
        data-ocid="new_trip.submit_button"
        disabled={createTrip.isPending}
        className="w-full font-display font-bold tracking-wide"
      >
        {createTrip.isPending ? "Starting…" : "Start Trip"}
      </Button>
    </form>
  );
}

// ── Edit Trip Form ─────────────────────────────────────────────────────────

function EditTripForm({
  trip,
  onCancel,
}: { trip: Trip; onCancel: () => void }) {
  const updateTrip = useUpdateTrip();
  const [form, setForm] = useState({
    date: trip.date,
    loadId: trip.loadId,
    pickupNumber: trip.pickupNumber,
    pickupTrailerNumber: trip.pickupTrailerNumber,
    pickupTime: trip.pickupTime,
    pickupLocation: trip.pickupLocation,
    dropTime: trip.dropTime,
    dropoffLocation: trip.dropoffLocation,
    totalMiles: String(trip.totalMiles),
  });

  function set(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: UpdateTripInput = {
      id: trip.id,
      date: form.date,
      loadId: form.loadId,
      pickupNumber: form.pickupNumber,
      pickupTrailerNumber: form.pickupTrailerNumber,
      pickupTime: form.pickupTime,
      pickupLocation: form.pickupLocation,
      dropTime: form.dropTime,
      dropoffLocation: form.dropoffLocation,
      totalMiles: Number.parseFloat(form.totalMiles) || 0,
    };
    try {
      await updateTrip.mutateAsync(input);
      toast.success("Trip updated.");
      onCancel();
    } catch {
      toast.error("Failed to update trip.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-ocid="edit_trip.form"
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Date">
          <Input
            data-ocid="edit_trip.date_input"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            required
          />
        </FieldGroup>
        <FieldGroup label="Load ID">
          <Input
            data-ocid="edit_trip.load_id_input"
            value={form.loadId}
            onChange={(e) => set("loadId", e.target.value)}
            required
          />
        </FieldGroup>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Pickup Number">
          <Input
            data-ocid="edit_trip.pickup_number_input"
            value={form.pickupNumber}
            onChange={(e) => set("pickupNumber", e.target.value)}
            required
          />
        </FieldGroup>
        <FieldGroup label="Pickup Trailer Number">
          <Input
            data-ocid="edit_trip.pickup_trailer_number_input"
            value={form.pickupTrailerNumber}
            onChange={(e) => set("pickupTrailerNumber", e.target.value)}
            required
          />
        </FieldGroup>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Pick Up Time">
          <Input
            data-ocid="edit_trip.pickup_time_input"
            value={form.pickupTime}
            onChange={(e) => set("pickupTime", e.target.value)}
            required
          />
        </FieldGroup>
        <FieldGroup label="Drop Time">
          <Input
            data-ocid="edit_trip.drop_time_input"
            value={form.dropTime}
            onChange={(e) => set("dropTime", e.target.value)}
            required
          />
        </FieldGroup>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Pick Up Location">
          <Input
            data-ocid="edit_trip.pickup_location_input"
            value={form.pickupLocation}
            onChange={(e) => set("pickupLocation", e.target.value)}
            required
          />
        </FieldGroup>
        <FieldGroup label="Drop Location">
          <Input
            data-ocid="edit_trip.dropoff_location_input"
            value={form.dropoffLocation}
            onChange={(e) => set("dropoffLocation", e.target.value)}
            required
          />
        </FieldGroup>
      </div>

      <FieldGroup label="Miles">
        <Input
          data-ocid="edit_trip.total_miles_input"
          type="number"
          value={form.totalMiles}
          onChange={(e) => set("totalMiles", e.target.value)}
          min={1}
          required
        />
      </FieldGroup>

      <LiveEarningsPreview miles={form.totalMiles} />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          data-ocid="edit_trip.cancel_button"
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          data-ocid="edit_trip.save_button"
          className="flex-1 font-display font-bold"
          disabled={updateTrip.isPending}
        >
          {updateTrip.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

// ── Active Trip View ───────────────────────────────────────────────────────

function ActiveTripView({ trip }: { trip: Trip }) {
  const navigate = useNavigate();
  const completeTrip = useCompleteTrip();
  const [editing, setEditing] = useState(false);

  async function handleComplete() {
    try {
      await completeTrip.mutateAsync(trip.id);
      toast.success("Trip completed!");
      navigate({ to: "/history" });
    } catch {
      toast.error("Failed to complete trip.");
    }
  }

  return (
    <div data-ocid="active_trip.view" className="flex flex-col gap-4">
      {/* Status + header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary" />
          <span className="text-sm font-display font-semibold text-foreground">
            Load {trip.loadId}
          </span>
          <Badge
            data-ocid="active_trip.status_badge"
            className="bg-primary/20 text-primary border-primary/30 text-[10px] uppercase tracking-widest px-2"
            variant="outline"
          >
            In Progress
          </Badge>
        </div>
        {!editing && (
          <Button
            variant="outline"
            size="sm"
            data-ocid="active_trip.edit_button"
            onClick={() => setEditing(true)}
            className="gap-1.5"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </div>

      {/* Earnings banner */}
      {!editing && (
        <div
          data-ocid="active_trip.earnings_banner"
          className="rounded border border-primary/40 bg-primary/10 px-4 py-3 flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
              Earnings
            </p>
            <p className="text-4xl font-bold font-display leading-none text-primary">
              {formatEarnings(trip.earnings)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
              Miles
            </p>
            <p className="text-xl font-bold font-display text-foreground">
              {formatMiles(trip.totalMiles)}
            </p>
          </div>
        </div>
      )}

      {/* Trip details or edit form */}
      {editing ? (
        <EditTripForm trip={trip} onCancel={() => setEditing(false)} />
      ) : (
        <>
          {/* Row 1: Date + Load ID */}
          <div className="grid grid-cols-2 gap-2">
            <DetailRow label="Date" value={trip.date} />
            <DetailRow label="Load ID" value={trip.loadId} />
          </div>

          {/* Row 2: Pickup Number + Trailer */}
          <div className="grid grid-cols-2 gap-2">
            <DetailRow label="Pickup Number" value={trip.pickupNumber} />
            <DetailRow
              label="Pickup Trailer #"
              value={trip.pickupTrailerNumber}
            />
          </div>

          {/* Row 3: Pickup Time + Drop Time */}
          <div className="grid grid-cols-2 gap-2">
            <DetailRow label="Pick Up Time" value={trip.pickupTime} />
            <DetailRow label="Drop Time" value={trip.dropTime} />
          </div>

          {/* Row 4: Locations */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded border border-border bg-card px-3 py-2.5 flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Pick Up Location
                </p>
                <p className="text-sm font-medium text-foreground truncate">
                  {trip.pickupLocation}
                </p>
              </div>
            </div>
            <div className="rounded border border-border bg-card px-3 py-2.5 flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Drop Location
                </p>
                <p className="text-sm font-medium text-foreground truncate">
                  {trip.dropoffLocation}
                </p>
              </div>
            </div>
          </div>

          {/* Complete trip */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                data-ocid="active_trip.complete_button"
                className="w-full font-display font-bold gap-2"
                disabled={completeTrip.isPending}
              >
                <CheckCircle2 className="h-4 w-4" />
                {completeTrip.isPending ? "Completing…" : "Complete Trip"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent data-ocid="active_trip.complete_dialog">
              <AlertDialogHeader>
                <AlertDialogTitle>Complete this trip?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark the trip as completed and move it to your
                  history. You won't be able to edit it afterward.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-ocid="active_trip.complete_cancel_button">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  data-ocid="active_trip.complete_confirm_button"
                  onClick={handleComplete}
                >
                  Complete Trip
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────

function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <div
      data-ocid="active_trip.empty_state"
      className="flex flex-col items-center justify-center gap-4 py-12 text-center"
    >
      <div className="rounded-full bg-card border border-border p-5">
        <Truck className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <p className="text-base font-display font-semibold text-foreground">
          No active trip
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Start a new trip to begin tracking your earnings.
        </p>
      </div>
      <Button
        data-ocid="active_trip.start_trip_button"
        size="lg"
        onClick={onStart}
        className="gap-2 font-display font-bold tracking-wide"
      >
        <Plus className="h-4 w-4" />
        Start New Trip
      </Button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export function ActiveTripPage() {
  const { data: activeTrip, isLoading } = useActiveTrip();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return (
      <div data-ocid="active_trip.loading_state" className="space-y-3">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (activeTrip) {
    return (
      <div data-ocid="active_trip.page">
        <ActiveTripView trip={activeTrip} />
      </div>
    );
  }

  if (showForm) {
    return (
      <div data-ocid="active_trip.page">
        <div className="flex items-center gap-3 mb-5">
          <Hash className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-display font-semibold uppercase tracking-widest text-foreground">
            New Trip
          </h2>
          <Button
            variant="ghost"
            size="sm"
            data-ocid="new_trip.back_button"
            onClick={() => setShowForm(false)}
            className="ml-auto text-muted-foreground"
          >
            ← Cancel
          </Button>
        </div>
        <NewTripForm />
      </div>
    );
  }

  return (
    <div data-ocid="active_trip.page">
      <EmptyState onStart={() => setShowForm(true)} />
    </div>
  );
}
