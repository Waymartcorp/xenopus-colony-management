import type { Metadata } from "next";
import "./globals.css";
import UserHeader from "@/components/UserHeader";

export const metadata: Metadata = {
  title: "XenoTrack Colony Register",
  description:
    "Private, time-aware Xenopus colony management for labs and institutions",
};

// TODO: Fetch enabled_modules from organization settings / module_trials
// TODO: Hide optional nav sections when modules are not enabled
// For now, show base nav always and optional modules with "(opt-in)" marker

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
              <a href="/dashboard" className="text-lg font-bold text-brand-700">
                XenoTrack
              </a>
            </div>
            <div className="flex flex-col gap-5 overflow-y-auto px-3 py-4">
              {/* === BASE PRODUCT (always visible) === */}
              <NavSection title="Colony">
                <NavItem href="/dashboard" label="Today's Actions" />
                <NavItem href="/bins" label="Bins & Rotation" />
                <NavItem href="/colony" label="Whole Colony" />
                <NavItem href="/frogs" label="Individual Frogs" />
                <NavItem href="/repopulation" label="Repopulation" />
                <NavItem href="/locations" label="Rooms & Racks" />
              </NavSection>
              <NavSection title="Forecast">
                <NavItem href="/forecast" label="Forecast" />
                <NavItem href="/capacity" label="Capacity / Run-Out" />
                <NavItem href="/bottlenecks" label="Bottlenecks" />
              </NavSection>
              <NavSection title="Records">
                <NavItem href="/events" label="Events" />
                <NavItem href="/performance" label="Performance" />
                <NavItem href="/photos" label="Photos" />
                <NavItem href="/past" label="History" />
              </NavSection>
              <NavSection title="System">
                <NavItem href="/notifications" label="Notices" />
                <NavItem href="/shipments" label="Shipments" />
                <NavItem href="/workspace-profile" label="Workspace" />
              </NavSection>

              {/* Future add-ons — hidden until enabled by admin */}
              {/* TODO: Conditionally render Husbandry/Sentinel, Analytics, etc. when module is active */}
              <div className="border-t border-gray-200 pt-4">
                <NavSection title="">
                  <NavItem href="/modules" label="Add-ons & Coming Soon" />
                </NavSection>
              </div>
            </div>
          </nav>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <UserHeader />
            <main className="flex-1">{children}</main>
          </div>
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
