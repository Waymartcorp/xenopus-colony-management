"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "@/lib/auth";
import { hasAcceptedCurrentLegal, ADMIN_CONTACT } from "@/lib/legal";
import { LogoFull } from "@/components/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // When true, the error is likely "no account yet" — nudge toward signup.
  const [showSignupHint, setShowSignupHint] = useState(false);

  // Surface auth-callback failures redirected here with ?error=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "auth_callback_failed") {
      setError(
        "We couldn't confirm your email link. It may have expired. Try logging in, or request a new confirmation email by signing up again."
      );
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowSignupHint(false);

    const { data, error: authError } = await signIn(email, password);

    if (authError) {
      const raw = authError.message.toLowerCase();

      if (raw.includes("email not confirmed") || raw.includes("not confirmed")) {
        setError("Check your email to confirm your account before signing in. Click the confirmation link we sent, then come back and log in.");
      } else if (raw.includes("invalid login credentials") || raw.includes("invalid")) {
        setError("We couldn't find an account with that email and password. If you haven't signed up yet, create an account. If you already have one, double-check your password.");
        setShowSignupHint(true);
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    // Route existing users who have not yet accepted the current Terms/Privacy
    // to /accept-terms before they reach the dashboard or onboarding.
    const user = data?.user;
    if (user) {
      const accepted = await hasAcceptedCurrentLegal(user.id);
      window.location.href = accepted ? "/dashboard" : "/accept-terms";
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="pattern-dots absolute inset-0" />
      <div className="relative w-full max-w-sm">
        <div className="text-center">
          <LogoFull />
          <h1 className="mt-6 text-xl font-bold tracking-tight text-gray-900">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Access your colony workspace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <p>{error}</p>
              {showSignupHint && (
                <Link
                  href="/signup"
                  className="mt-2 inline-block font-semibold text-brand-600 underline hover:text-brand-700"
                >
                  Create an account →
                </Link>
              )}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          <Link href="/forgot-password" className="text-brand-600 hover:underline">
            Forgot password?
          </Link>
        </p>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-600 hover:underline">
            Create one
          </Link>
        </p>

        <p className="mt-2 text-center text-xs text-gray-400">
          Trouble accessing your account? Contact{" "}
          <a href={`mailto:${ADMIN_CONTACT}`} className="hover:text-gray-600">
            {ADMIN_CONTACT}
          </a>
        </p>

        <div className="mt-8 flex justify-center gap-4 text-xs text-gray-400">
          <Link href="/terms" className="hover:text-gray-600">Terms</Link>
          <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
        </div>
      </div>
    </div>
  );
}
