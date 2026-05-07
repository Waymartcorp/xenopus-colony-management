"use client";

import { useEffect, useState } from "react";
import { getUser, signOut } from "@/lib/auth";

export default function AccountPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { user } = await getUser();
      if (user) {
        setEmail(user.email ?? null);
        setName(user.user_metadata?.full_name ?? null);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold text-gray-900">Account</h1>

      <div className="mt-6 max-w-md space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Name</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{name ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Email</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{email ?? "—"}</p>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <a
          href="/reset-password"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Change Password
        </a>
        <button
          onClick={handleSignOut}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
