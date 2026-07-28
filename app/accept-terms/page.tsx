"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { LogoFull } from "@/components/Logo";
import { TERMS_VERSION, PRIVACY_VERSION } from "@/lib/legal";

export default function AcceptTermsPage() {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: existing } = await supabase
        .from("user_legal_acceptances")
        .select("id")
        .eq("user_id", user.id)
        .eq("terms_version", TERMS_VERSION)
        .eq("privacy_version", PRIVACY_VERSION)
        .limit(1)
        .maybeSingle();

      if (existing) {
        window.location.href = "/dashboard";
        return;
      }

      setChecking(false);
    }
    check();
  }, []);

  async function handleAccept() {
    if (!accepted) {
      setError("You must review and agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { error: insertErr } = await supabase.from("user_legal_acceptances").insert({
      user_id: user.id,
      terms_version: TERMS_VERSION,
      privacy_version: PRIVACY_VERSION,
      user_agent: navigator.userAgent,
    });

    if (insertErr) {
      setError(`Failed to record acceptance: ${insertErr.message}`);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Checking...</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="pattern-dots absolute inset-0" />
      <div className="relative w-full max-w-md">
        <div className="text-center">
          <LogoFull />
          <h1 className="mt-6 text-xl font-bold tracking-tight text-gray-900">
            Terms of Service &amp; Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Please review and accept the XenoTrack Terms of Service and Privacy Policy to continue.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-700">
            Before continuing, please read our Terms and Privacy Policy:
          </p>

          <div className="mt-4 space-y-2">
            <Link
              href="/terms"
              target="_blank"
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 hover:border-brand-200"
            >
              <span>Read Terms of Service</span>
              <span className="text-xs text-gray-400">↗</span>
            </Link>
            <Link
              href="/privacy"
              target="_blank"
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 hover:border-brand-200"
            >
              <span>Read Privacy Policy</span>
              <span className="text-xs text-gray-400">↗</span>
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Version: {TERMS_VERSION}
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <label className="mt-5 flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">
              I have read and agree to the XenoTrack{" "}
              <Link href="/terms" className="text-brand-600 hover:underline" target="_blank">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-brand-600 hover:underline" target="_blank">
                Privacy Policy
              </Link>
            </span>
          </label>

          <button
            onClick={handleAccept}
            disabled={loading}
            className="btn-primary mt-4 w-full py-3 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Accept & Continue"}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Contact: <a href="mailto:rob@xenopus1.com" className="hover:text-gray-600">rob@xenopus1.com</a>
        </p>
      </div>
    </div>
  );
}
