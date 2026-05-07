import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XenoTrack Colony Register",
  description:
    "Private, time-aware Xenopus colony management for labs and institutions",
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
          <nav className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white lg:block">
            <div className="flex h-16 items-center border-b border-gray-200 px-6">
              <span className="text-lg font-bold text-brand-700">
                XenoTrack
              </span>
            </div>
            <div className="flex flex-col gap-6 overflow-y-auto px-3 py-4">
              <NavSection title="Colony">
                <NavItem href="/dashboard" label="Dashboard" />
                <NavItem href="/frogs" label="Frogs" />
                <NavItem href="/locations" label="Bins / Locations" />
              </NavSection>
              <NavSection title="Rotation">
                <NavItem href="/rotation" label="Rotation" />
                <NavItem href="/repopulation" label="Repopulation" />
                <NavItem href="/forecast" label="Future View" />
                <NavItem href="/past" label="Past View" />
              </NavSection>
              <NavSection title="Data">
                <NavItem href="/events" label="Events" />
                <NavItem href="/performance" label="Performance" />
                <NavItem href="/environment" label="Environment" />
                <NavItem href="/photos" label="Photos" />
              </NavSection>
              <NavSection title="Analytics">
                <NavItem href="/analytics" label="Analytics" />
                <NavItem href="/seasonality" label="Seasonality" />
                <NavItem href="/reports" label="Reports" />
              </NavSection>
              <NavSection title="System">
                <NavItem href="/notifications" label="Notifications" />
                <NavItem href="/shipments" label="Shipments" />
                <NavItem href="/workspace-profile" label="Workspace Profile" />
                <NavItem href="/institutions" label="Institution" />
              </NavSection>
            </div>
          </nav>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}

function NavSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </p>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a
        href={href}
        className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700"
      >
        {label}
      </a>
    </li>
  );
}
