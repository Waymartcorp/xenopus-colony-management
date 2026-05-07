"use client";

import { useState } from "react";

// TODO: Fetch user's organizations from Supabase
// TODO: Persist selection in cookie/session for SSR
// TODO: Redirect to dashboard on switch
// TODO: Show current org name prominently

interface Organization {
  id: string;
  name: string;
  organizationType: string;
  role: string;
}

interface InstitutionSwitcherProps {
  organizations: Organization[];
  currentOrgId: string;
  onSwitch: (orgId: string) => void;
}

export default function InstitutionSwitcher({
  organizations,
  currentOrgId,
  onSwitch,
}: InstitutionSwitcherProps) {
  const [open, setOpen] = useState(false);
  const current = organizations.find((o) => o.id === currentOrgId);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50"
      >
        <span className="truncate">{current?.name ?? "Select institution"}</span>
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-1 w-64 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => {
                onSwitch(org.id);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                org.id === currentOrgId ? "bg-brand-50 text-brand-700" : "text-gray-700"
              }`}
            >
              <span>{org.name}</span>
              <span className="text-xs text-gray-400">{org.role}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
