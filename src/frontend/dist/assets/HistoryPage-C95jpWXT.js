import { u as useNavigate, a as useSearch, r as reactExports, j as jsxRuntimeExports, S as Skeleton } from "./index-qM1U5xgo.js";
import { B as Badge } from "./badge-B7Sm8wJt.js";
import { a as createLucideIcon, i as useCompletedTrips, d as formatMiles, f as formatEarnings, T as Truck } from "./types-C-Oyse92.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m7 15 5 5 5-5", key: "1hf1tw" }],
  ["path", { d: "m7 9 5-5 5 5", key: "sgt6xg" }]
];
const ChevronsUpDown = createLucideIcon("chevrons-up-down", __iconNode);
function SortHeader({
  label,
  sortKey,
  currentSort,
  currentDir,
  onClick,
  align = "left"
}) {
  const isActive = currentSort === sortKey;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      className: `px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap ${align === "right" ? "text-right" : "text-left"}`,
      scope: "col",
      "aria-sort": isActive ? currentDir === "asc" ? "ascending" : "descending" : "none",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: `inline-flex items-center gap-1 cursor-pointer select-none hover:text-foreground transition-colors duration-150 bg-transparent border-0 p-0 font-semibold uppercase tracking-wider text-xs ${align === "right" ? "flex-row-reverse w-full justify-start" : ""}`,
          onClick: () => onClick(sortKey),
          "data-ocid": `history.sort_${sortKey}`,
          children: [
            label,
            isActive ? currentDir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3.5 h-3.5 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "w-3.5 h-3.5 opacity-30" })
          ]
        }
      )
    }
  );
}
function EarningsCell({ earnings }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `font-mono font-semibold tabular-nums ${earnings > 0 ? "text-primary" : "text-muted-foreground"}`,
      children: formatEarnings(earnings)
    }
  );
}
function HistoryPage() {
  const navigate = useNavigate();
  const rawSearch = useSearch({ strict: false });
  const sortKey = rawSearch.sort ?? "date";
  const sortDir = rawSearch.dir ?? "desc";
  const { data: trips, isLoading } = useCompletedTrips();
  const handleSort = (key) => {
    const newDir = key === sortKey ? sortDir === "asc" ? "desc" : "asc" : "desc";
    navigate({ to: "/history", search: { sort: key, dir: newDir } });
  };
  const sortedTrips = reactExports.useMemo(() => {
    if (!trips) return [];
    return [...trips].sort((a, b) => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-full", "data-ocid": "history.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "border-b border-border bg-card px-6 py-4",
        "data-ocid": "history.summary_panel",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-0.5", children: "Total Trips" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-2xl font-bold font-display text-foreground tabular-nums",
                "data-ocid": "history.total_count",
                children: isLoading ? "—" : totalCount
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-10 bg-border hidden sm:block" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-0.5", children: "Total Miles" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-2xl font-bold font-display text-foreground tabular-nums",
                "data-ocid": "history.total_miles",
                children: isLoading ? "—" : formatMiles(totalMiles)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-10 bg-border hidden sm:block" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-0.5", children: "Total Earnings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-2xl font-bold font-display tabular-nums ${totalEarnings > 0 ? "text-primary" : "text-muted-foreground"}`,
                "data-ocid": "history.total_earnings",
                children: isLoading ? "—" : formatEarnings(totalEarnings)
              }
            )
          ] }),
          !isLoading && totalCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-10 bg-border hidden sm:block" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "text-xs border-primary/30 text-primary bg-primary/10",
                "data-ocid": "history.completed_badge",
                children: [
                  totalCount,
                  " completed"
                ]
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", "data-ocid": "history.table_section", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "history.loading_state", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-sm" }, i)) }) : totalCount === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "history.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "w-8 h-8 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold font-display text-foreground mb-1", children: "No completed trips yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Complete a trip to see your earnings history here." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "overflow-x-auto rounded-sm border border-border",
        "data-ocid": "history.table",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[600px] text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/60 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SortHeader,
              {
                label: "Date",
                sortKey: "date",
                currentSort: sortKey,
                currentDir: sortDir,
                onClick: handleSort
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap", children: "Load ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap", children: "Pick Up → Drop" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SortHeader,
              {
                label: "Miles",
                sortKey: "miles",
                currentSort: sortKey,
                currentDir: sortDir,
                onClick: handleSort
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SortHeader,
              {
                label: "Earnings",
                sortKey: "earnings",
                currentSort: sortKey,
                currentDir: sortDir,
                onClick: handleSort,
                align: "right"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: sortedTrips.map((trip, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "bg-card hover:bg-secondary/50 cursor-pointer transition-colors duration-150 group",
              onClick: () => navigate({
                to: "/trip/$id",
                params: { id: trip.id.toString() }
              }),
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ")
                  navigate({
                    to: "/trip/$id",
                    params: { id: trip.id.toString() }
                  });
              },
              tabIndex: 0,
              "data-ocid": `history.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground font-mono text-xs whitespace-nowrap", children: trip.date || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground whitespace-nowrap", children: trip.loadId }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground max-w-[220px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate block", children: [
                  trip.pickupLocation,
                  " → ",
                  trip.dropoffLocation
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono tabular-nums text-foreground whitespace-nowrap", children: formatMiles(trip.totalMiles) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right whitespace-nowrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(EarningsCell, { earnings: trip.earnings }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 opacity-0 group-hover:opacity-60 transition-opacity duration-150 text-muted-foreground", children: "→" })
                ] })
              ]
            },
            trip.id.toString()
          )) })
        ] })
      }
    ) })
  ] });
}
export {
  HistoryPage
};
