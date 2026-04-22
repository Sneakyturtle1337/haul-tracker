import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const NAV_TABS = [
  { label: "Active Trip", to: "/", exact: true, ocid: "nav.active_tab" },
  { label: "History", to: "/history", exact: false, ocid: "nav.history_tab" },
];

export function Layout({ children }: LayoutProps) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="px-4 h-12 flex items-center justify-between max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-primary"
              aria-hidden="true"
            >
              <path
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="1"
                y="14"
                width="22"
                height="8"
                rx="1"
                fill="currentColor"
                opacity="0.15"
              />
              <path
                d="M2 14h14l3-5h2l1 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-display font-bold text-base tracking-tight text-foreground">
              Haul Tracker
            </span>
          </div>

          {/* Nav tabs */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            {NAV_TABS.map((tab) => {
              const isActive = tab.exact
                ? pathname === tab.to
                : pathname.startsWith(tab.to);
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  data-ocid={tab.ocid}
                  className={[
                    "px-3 py-1.5 text-sm font-medium font-display rounded-sm transition-smooth",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  ].join(" ")}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border py-3 px-4">
        <p className="text-center text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-smooth"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
