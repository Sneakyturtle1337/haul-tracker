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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Hash,
  MapPin,
  Route,
  Trash2,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { useDeleteTrip, useTripById } from "../hooks";
import { formatEarnings, formatMiles } from "../types";

function DetailField({
  label,
  value,
  icon,
  colSpan2 = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  colSpan2?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 p-3 bg-secondary rounded border border-border ${colSpan2 ? "col-span-2" : ""}`}
    >
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
        {icon && <span className="opacity-60">{icon}</span>}
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground break-words">
        {value}
      </span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4 pt-2">
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <Skeleton className="h-32" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    </div>
  );
}

function NotFoundState({ onBack }: { onBack: () => void }) {
  return (
    <div
      data-ocid="trip_detail.error_state"
      className="flex flex-col items-center justify-center gap-4 py-16 text-center"
    >
      <AlertCircle className="w-10 h-10 text-muted-foreground" />
      <div>
        <p className="text-base font-semibold text-foreground">
          Trip not found
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          This trip may have been deleted or doesn&apos;t exist.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onBack}
        data-ocid="trip_detail.back_button"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to History
      </Button>
    </div>
  );
}

export function TripDetailPage() {
  const { id } = useParams({ from: "/trip/$id" });
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const tripId = (() => {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  })();

  const { data: trip, isLoading } = useTripById(tripId);
  const deleteTrip = useDeleteTrip();

  const handleBack = () => navigate({ to: "/history" });

  const handleDelete = async () => {
    if (!tripId) return;
    await deleteTrip.mutateAsync(tripId);
    navigate({ to: "/history" });
  };

  if (isLoading) {
    return (
      <div
        data-ocid="trip_detail.loading_state"
        className="px-4 py-4 max-w-xl mx-auto"
      >
        <LoadingState />
      </div>
    );
  }

  if (!trip || tripId === null) {
    return (
      <div className="px-4 py-4 max-w-xl mx-auto">
        <NotFoundState onBack={handleBack} />
      </div>
    );
  }

  return (
    <div
      data-ocid="trip_detail.page"
      className="px-4 py-4 max-w-xl mx-auto space-y-5"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          data-ocid="trip_detail.back_button"
          className="text-muted-foreground hover:text-foreground -ml-2 transition-smooth"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          History
        </Button>

        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              data-ocid="trip_detail.delete_button"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-smooth"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent
            data-ocid="trip_detail.dialog"
            className="bg-card border-border"
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display text-foreground">
                Delete this trip?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This will permanently remove the trip record. This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                data-ocid="trip_detail.cancel_button"
                className="bg-secondary border-border text-foreground hover:bg-muted"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                data-ocid="trip_detail.confirm_button"
                onClick={handleDelete}
                disabled={deleteTrip.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
              >
                {deleteTrip.isPending ? "Deleting…" : "Delete Trip"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Trip title */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/15 border border-primary/30 p-2.5">
          <Truck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-foreground tracking-tight leading-tight">
            Load {trip.loadId}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">{trip.date}</p>
        </div>
      </div>

      {/* Key metrics */}
      <div data-ocid="trip_detail.section" className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 p-4 rounded border bg-primary border-primary/60 text-primary-foreground col-span-2">
          <span className="text-xs font-medium uppercase tracking-widest text-primary-foreground/70">
            Earnings
          </span>
          <span className="text-3xl font-bold tracking-tight">
            {formatEarnings(trip.earnings)}
          </span>
        </div>
        <div className="flex flex-col gap-1 p-4 rounded border bg-secondary border-border">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Miles
          </span>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {formatMiles(trip.totalMiles)}
          </span>
        </div>
        <div className="flex flex-col gap-1 p-4 rounded border bg-secondary border-border">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Rate
          </span>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            $0.775/mi
          </span>
        </div>
      </div>

      {/* Load info */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Load Details
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <DetailField
            label="Date"
            value={trip.date}
            icon={<Calendar className="w-3.5 h-3.5" />}
          />
          <DetailField
            label="Load ID"
            value={trip.loadId}
            icon={<Hash className="w-3.5 h-3.5" />}
          />
          <DetailField
            label="Pickup Number"
            value={trip.pickupNumber}
            icon={<Hash className="w-3.5 h-3.5" />}
          />
          <DetailField
            label="Pickup Trailer #"
            value={trip.pickupTrailerNumber}
            icon={<Truck className="w-3.5 h-3.5" />}
          />
        </div>
      </div>

      {/* Times */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Schedule
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <DetailField
            label="Pick Up Time"
            value={trip.pickupTime}
            icon={<Clock className="w-3.5 h-3.5" />}
          />
          <DetailField
            label="Drop Time"
            value={trip.dropTime}
            icon={<Clock className="w-3.5 h-3.5" />}
          />
        </div>
      </div>

      {/* Route info */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Route
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <DetailField
            label="Pick Up Location"
            value={trip.pickupLocation}
            icon={<MapPin className="w-3.5 h-3.5" />}
          />
          <DetailField
            label="Drop Location"
            value={trip.dropoffLocation}
            icon={<MapPin className="w-3.5 h-3.5" />}
          />
          <DetailField
            colSpan2
            label="Total Miles"
            value={formatMiles(trip.totalMiles)}
            icon={<Route className="w-3.5 h-3.5" />}
          />
        </div>
      </div>
    </div>
  );
}
