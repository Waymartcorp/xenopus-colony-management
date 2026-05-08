"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export default function SettingsPage() {
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetInput, setResetInput] = useState("");
  const [confirmStep, setConfirmStep] = useState<"input" | "final">("input");
  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  async function handleReset() {
    setResetting(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: mem } = await supabase
        .from("organization_memberships")
        .select("organization_id, role")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (!mem || mem.role !== "owner") {
        alert("Only workspace owners can reset the colony.");
        setResetting(false);
        return;
      }

      const orgId = mem.organization_id;

      // TODO: Production-safe backup/export before reset
      // TODO: Archive instead of hard delete for audit trail
      // TODO: Add reset event to audit log

      // Soft reset: delete child records then clear setup state
      // Order matters for foreign key constraints
      await supabase.from("bin_transfer_events").delete().eq("organization_id", orgId);
      await supabase.from("destination_bin_assignments").delete().eq("organization_id", orgId);
      await supabase.from("bin_cycle_status").delete().eq("organization_id", orgId);
      await supabase.from("frog_events").delete().eq("organization_id", orgId);
      await supabase.from("frogs").delete().eq("organization_id", orgId);
      await supabase.from("notification_rules").delete().eq("organization_id", orgId);
      await supabase.from("rotation_settings").delete().eq("organization_id", orgId);
      await supabase.from("locations").delete().eq("organization_id", orgId);

      setResetDone(true);
    } catch (err) {
      console.error("[settings] Reset error:", err);
      alert("Reset encountered an error. Check console for details.");
    }
    setResetting(false);
  }

  if (resetDone) {
    return (
      <div className="p-6 lg:p-10">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">Colony Reset Complete</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your bins, frogs, and cycling data have been cleared. You can now set up a fresh colony.
          </p>
          <a href="/onboarding" className="btn-primary mt-6 inline-block">Start New Setup</a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <h1 className="page-header">Settings</h1>
      <p className="page-subtitle">Workspace configuration and administration.</p>

      <div className="mt-8 max-w-2xl space-y-6">
        {/* Workspace profile link */}
        <a href="/workspace-profile" className="card-flat block px-6 py-5 transition-all hover:shadow-card-hover hover:border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Lab Mode &amp; Rotation Settings</p>
              <p className="mt-1 text-xs text-gray-500">Configure rest periods, reuse windows, and lab mode.</p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </a>

        {/* Planner link */}
        <a href="/planner" className="card-flat block px-6 py-5 transition-all hover:shadow-card-hover hover:border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Use Cycle Planner</p>
              <p className="mt-1 text-xs text-gray-500">Calculate how many bins to keep open based on your use rate.</p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </a>

        {/* Export link */}
        <a href="/reports" className="card-flat block px-6 py-5 transition-all hover:shadow-card-hover hover:border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Export Colony Data (CSV)</p>
              <p className="mt-1 text-xs text-gray-500">Download colony records for backup, analysis, or reporting.</p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </a>

        {/* Account link */}
        <a href="/account" className="card-flat block px-6 py-5 transition-all hover:shadow-card-hover hover:border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Account &amp; Password</p>
              <p className="mt-1 text-xs text-gray-500">Manage your email, password, and sign-out.</p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </a>

        {/* Danger zone */}
        <div className="mt-12 rounded-xl border border-red-200 bg-red-50/30 p-6">
          <h2 className="text-sm font-semibold text-red-700">Danger Zone</h2>
          <p className="mt-2 text-xs text-gray-600">
            These actions are destructive and intended for testing or reconfiguration.
          </p>
          <button
            onClick={() => setShowResetModal(true)}
            className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Reset Colony Setup
          </button>
        </div>
      </div>

      {/* Reset modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            {confirmStep === "input" ? (
              <>
                <h2 className="text-lg font-bold text-gray-900">Reset Colony Setup</h2>
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  This will remove your current bins, frog records, cycling data, and related setup records for this workspace.
                  This cannot be undone unless backups exist.
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Type <span className="font-mono font-bold text-red-600">RESET</span> to continue
                  </label>
                  <input
                    type="text"
                    value={resetInput}
                    onChange={(e) => setResetInput(e.target.value)}
                    placeholder="RESET"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono"
                  />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => { setShowResetModal(false); setResetInput(""); setConfirmStep("input"); }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setConfirmStep("final")}
                    disabled={resetInput !== "RESET"}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    Continue
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-red-700">Final Confirmation</h2>
                <p className="mt-3 text-sm text-gray-700">
                  Are you absolutely sure? All bins, frogs, transfer records, and rotation data for this workspace will be permanently removed.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => { setShowResetModal(false); setResetInput(""); setConfirmStep("input"); }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={resetting}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {resetting ? "Resetting..." : "Yes, Reset Everything"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
