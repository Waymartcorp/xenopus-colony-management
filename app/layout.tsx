import type { Metadata } from "next";
import "./globals.css";
import UserHeader from "@/components/UserHeader";

export const metadata: Metadata = {
  title: "XenoTrack Colony Register",
  description:
    "Private Xenopus colony management — track bins, frogs, use/rest cycles, and performance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <nav className="hidden w-60 flex-shrink-0 border-r border-gray-200/80 bg-white lg:flex lg:flex-col">
            <div className="flex h-14 items-center border-b border-gray-100 px-5">
              <a href="/dashboard" className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-xs font-bold text-white">X</span>
                <span className="text-sm font-bold tracking-tight text-gray-900">XenoTrack</span>
              </a>
            </div>
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
              <NavSection title="Workflow">
                <NavItem href="/dashboard" label="Dashboard" icon="◉" />
                <NavItem href="/bins" label="Bins" icon="◫" />
                <NavItem href="/use" label="Log Use & Rest" icon="↻" accent />
                <NavItem href="/colony" label="Whole Colony" icon="⬡" />
              </NavSection>
              <NavSection title="Records">
                <NavItem href="/frogs" label="Frogs" icon="●" />
                <NavItem href="/events" label="Events" icon="◆" />
                <NavItem href="/performance" label="Performance" icon="◈" />
                <NavItem href="/photos" label="Photos" icon="◲" />
              </NavSection>
              <NavSection title="Planning">
                <NavItem href="/planner" label="Cycle Planner" icon="⊞" />
                <NavItem href="/forecast" label="Forecast" icon="▷" />
                <NavItem href="/capacity" label="Capacity" icon="▥" />
                <NavItem href="/repopulation" label="Repopulation" icon="⊕" />
                <NavItem href="/notifications" label="Notifications" icon="◎" />
              </NavSection>
              <div className="mt-auto border-t border-gray-100 pt-4">
                <NavItem href="/settings" label="Settings" icon="⚙" />
                <NavItem href="/account" label="Account" icon="○" />
              </div>
            </div>
          </nav>

          {/* Main */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            <UserHeader />
            <main className="flex-1 animate-fade-in">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

function NavSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="section-title mb-2 px-3">{title}</p>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function NavItem({ href, label, icon, accent }: { href: string; label: string; icon?: string; accent?: boolean }) {
  return (
    <li>
      <a
        href={href}
        className={`nav-item ${accent ? "text-brand-700 font-semibold" : ""}`}
      >
        {icon && <span className="w-4 text-center text-xs opacity-60">{icon}</span>}
        {label}
      </a>
    </li>
  );
}
