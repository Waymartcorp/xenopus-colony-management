"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export default function UserHeader() {
  const [userName, setUserName] = useState<string>("—");
  const [email, setEmail] = useState<string>("");
  const [orgName, setOrgName] = useState<string>("—");
  const [role, setRole] = useState<string>("—");
  const [labMode, setLabMode] = useState<string>("—");

  useEffect(() => {
    async function load() {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserName(user.user_metadata?.full_name ?? user.email ?? "—");
      setEmail(user.email ?? "");

      // Fetch org membership
      const { data: membership } = await supabase
        .from("organization_memberships")
        .select("role, organization_id")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (membership) {
        setRole(membership.role);

        const { data: org } = await supabase
          .from("organizations")
          .select("name, primary_lab_mode")
          .eq("id", membership.organization_id)
          .single();

        if (org) {
          setOrgName(org.name);
          setLabMode(org.primary_lab_mode ?? "—");
        }
      }
    }
    load();
  }, []);

  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{userName}</span>
          {email && (
            <>
              <span className="text-gray-300">·</span>
              <span>{role}</span>
              <span className="text-gray-300">·</span>
              <span>{orgName}</span>
              <span className="text-gray-300">·</span>
              <span className="text-brand-600">{labMode}</span>
            </>
          )}
        </div>
        <a href="/account" className="text-xs text-gray-400 hover:text-gray-600">
          Account
        </a>
      </div>
      <p className="mt-0.5 text-xs text-gray-400">
        Colony snapshot: {timestamp}
      </p>
    </div>
  );
}
