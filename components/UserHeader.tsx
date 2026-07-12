"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

const TERMS_VERSION = "xenotrack-terms-v1-early-access";
const PRIVACY_VERSION = "xenotrack-privacy-v1-early-access";

export default function UserHeader() {
  const [userName, setUserName] = useState<string>("—");
  const [orgName, setOrgName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [labMode, setLabMode] = useState<string>("");

  useEffect(() => {
    async function load() {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check legal acceptance — redirect if missing (skip on accept-terms page itself)
      if (!window.location.pathname.startsWith("/accept-terms")) {
        const { data: acceptance } = await supabase
          .from("user_legal_acceptances")
          .select("id")
          .eq("user_id", user.id)
          .eq("terms_version", TERMS_VERSION)
          .eq("privacy_version", PRIVACY_VERSION)
          .limit(1)
          .maybeSingle();

        if (!acceptance) {
          window.location.href = "/accept-terms";
          return;
        }
      }

      setUserName(user.user_metadata?.full_name ?? user.email ?? "—");

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
          setLabMode(org.primary_lab_mode ?? "");
        }
      }
    }
    load();
  }, []);

  return (
    <div className="border-b border-gray-100 bg-white px-6 py-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-medium text-gray-900">{userName}</span>
          {orgName && (
            <>
              <span className="text-gray-300">·</span>
              <span>{orgName}</span>
            </>
          )}
          {role && (
            <>
              <span className="text-gray-300">·</span>
              <span className="capitalize">{role}</span>
            </>
          )}
          {labMode && (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-brand-600 capitalize">{labMode}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <a href="/account" className="text-xs font-medium text-gray-400 transition-colors hover:text-gray-700">
            Account
          </a>
          <button
            onClick={async () => {
              const supabase = createBrowserSupabaseClient();
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            className="text-xs font-medium text-red-400 transition-colors hover:text-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
