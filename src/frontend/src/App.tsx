import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";

import { Skeleton } from "@/components/ui/skeleton";
// Lazy page imports
import { Suspense, lazy } from "react";

const ActiveTripPage = lazy(() =>
  import("./pages/ActiveTripPage").then((m) => ({ default: m.ActiveTripPage })),
);
const HistoryPage = lazy(() =>
  import("./pages/HistoryPage").then((m) => ({ default: m.HistoryPage })),
);
const TripDetailPage = lazy(() =>
  import("./pages/TripDetailPage").then((m) => ({ default: m.TripDetailPage })),
);

function PageLoader() {
  return (
    <div className="space-y-3 pt-4">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <ActiveTripPage />,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: () => <HistoryPage />,
});

const tripDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trip/$id",
  component: () => <TripDetailPage />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  historyRoute,
  tripDetailRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
