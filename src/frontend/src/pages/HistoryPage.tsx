import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, ChevronsUpDown, Truck } from "lucide-react";
import { useMemo } from "react";
import type { Trip } from "../backend";
import { useCompletedTrips } from "../hooks";
import { formatEarnings, formatMiles } from "../types";

type SortKey = "date" | "miles" | "earnings";
type SortDir = "asc" | "desc";

interface SortHeaderProps {
  label: string;
  sortKey: SortKey;
  currentSort: SortKey;
  currentDir: SortDir;
  onClick: (key: SortKey) => void;
  align?: "left" | "right";
}

function SortHeader({
  label,
  sortKey,
  currentSort,
  currentDir,
  onClick,
  align = "left",
}: SortHeaderProps) {
  const isActive = currentSort === sortKey;
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap ${align === "right" ? "text-right" : "text-left"}`}
      scope="col"
      aria-sort={
        isActive ? (currentDir === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <button
        type="button"
        className={`inline-flex items-center gap-1 cursor-pointer select-none hover:text-foreground transition-colors duration-150 bg-transparent border-0 p-0 font-semibold uppercase tracking-wider text-xs ${align === "right" ? "flex-row-reverse w-full justify-start" : ""}`}
        onClick={() => onClick(sortKey)}
        data-ocid={`history.sort_${sortKey}`}
      >
        {label}
        {isActive ? (
          currentDir === "asc" ? (
            <ChevronUp className="w-3.5 h-3.5 text-primary" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-primary" />
          )
        ) : (
          <ChevronsUpDown className="w-3.5 h-3.5 opacity-30" />
        )}
      </button>
    </th>
  );
}

function EarningsCell({ earnings }: { earnings: number }) {
  return (
    <span
      className={`font-mono font-semibold tabular-nums ${earnings > 0 ? "text-primary" : "text-muted-foreground"}`}
    >
      {formatEarnings(earnings)}
    </span>
  );
}

export function HistoryPage() {
  const navigate = useNavigate();

  const rawSearch = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;
  const sortKey: SortKey = (rawSearch.sort as SortKey) ?? "date";
  const sortDir: SortDir = (rawSearch.dir as SortDir) ?? "desc";

  const { data: trips, isLoading } = useCompletedTrips();

  const handleSort = (key: SortKey) => {
    const newDir: SortDir =
      key === sortKey ? (sortDir === "asc" ? "desc" : "asc") : "desc";
    navigate({ to: "/history", search: { sort: key, dir: newDir } });
  };

  const sortedTrips = useMemo(() => {
    if (!trips) return [];
    return [...trips].sort((a: Trip, b: Trip) => {
      let diff = 0;
      if (sortKey === "date") {
        const aDate = a.dateCompleted ?? BigInt(0);
        const bDate = b.dateCompleted ?? BigInt(0);
        diff = aDate < bDate ? -1 : aDate > bDate ? 1 : 0;
      } else if (sortKey === "miles") {
        diff = a.totalMiles - b.totalMiles;
      } else if (sortKey === "earnings") {
        diff = a.earnings - b.earnings;
      }
      return sortDir === "asc" ? diff : -diff;
    });
  }, [trips, sortKey, sortDir]);

  const totalCount = sortedTrips.length;
  const totalMiles = sortedTrips.reduce((sum, t) => sum + t.totalMiles, 0);
  const totalEarnings = sortedTrips.reduce((sum, t) => sum + t.earnings, 0);

  return (
    <div className="min-h-full" data-ocid="history.page">
      {/* Summary bar */}
      <div
        className="border-b border-border bg-card px-6 py-4"
        data-ocid="history.summary_panel"
      >
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
              Total Trips
            </p>
            <p
              className="text-2xl font-bold font-display text-foreground tabular-nums"
              data-ocid="history.total_count"
            >
              {isLoading ? "—" : totalCount}
            </p>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
              Total Miles
            </p>
            <p
              className="text-2xl font-bold font-display text-foreground tabular-nums"
              data-ocid="history.total_miles"
            >
              {isLoading ? "—" : formatMiles(totalMiles)}
            </p>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
              Total Earnings
            </p>
            <p
              className={`text-2xl font-bold font-display tabular-nums ${totalEarnings > 0 ? "text-primary" : "text-muted-foreground"}`}
              data-ocid="history.total_earnings"
            >
              {isLoading ? "—" : formatEarnings(totalEarnings)}
            </p>
          </div>
          {!isLoading && totalCount > 0 && (
            <>
              <div className="w-px h-10 bg-border hidden sm:block" />
              <Badge
                variant="outline"
                className="text-xs border-primary/30 text-primary bg-primary/10"
                data-ocid="history.completed_badge"
              >
                {totalCount} completed
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Table area */}
      <div className="p-6" data-ocid="history.table_section">
        {isLoading ? (
          <div className="space-y-2" data-ocid="history.loading_state">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-sm" />
            ))}
          </div>
        ) : totalCount === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="history.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Truck className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold font-display text-foreground mb-1">
              No completed trips yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Complete a trip to see your earnings history here.
            </p>
          </div>
        ) : (
          <div
            className="overflow-x-auto rounded-sm border border-border"
            data-ocid="history.table"
          >
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-muted/60 border-b border-border">
                <tr>
                  <SortHeader
                    label="Date"
                    sortKey="date"
                    currentSort={sortKey}
                    currentDir={sortDir}
                    onClick={handleSort}
                  />
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    Load ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    Pick Up → Drop
                  </th>
                  <SortHeader
                    label="Miles"
                    sortKey="miles"
                    currentSort={sortKey}
                    currentDir={sortDir}
                    onClick={handleSort}
                  />
                  <SortHeader
                    label="Earnings"
                    sortKey="earnings"
                    currentSort={sortKey}
                    currentDir={sortDir}
                    onClick={handleSort}
                    align="right"
                  />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedTrips.map((trip, idx) => (
                  <tr
                    key={trip.id.toString()}
                    className="bg-card hover:bg-secondary/50 cursor-pointer transition-colors duration-150 group"
                    onClick={() =>
                      navigate({
                        to: "/trip/$id",
                        params: { id: trip.id.toString() },
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        navigate({
                          to: "/trip/$id",
                          params: { id: trip.id.toString() },
                        });
                    }}
                    tabIndex={0}
                    data-ocid={`history.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs whitespace-nowrap">
                      {trip.date || "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                      {trip.loadId}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground max-w-[220px]">
                      <span className="truncate block">
                        {trip.pickupLocation} → {trip.dropoffLocation}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-foreground whitespace-nowrap">
                      {formatMiles(trip.totalMiles)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <EarningsCell earnings={trip.earnings} />
                      <span className="ml-2 opacity-0 group-hover:opacity-60 transition-opacity duration-150 text-muted-foreground">
                        →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
