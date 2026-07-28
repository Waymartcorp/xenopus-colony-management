"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/auth";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { LogoFull } from "@/components/Logo";
import {
  TERMS_VERSION,
  PRIVACY_VERSION,
  ADMIN_CONTACT,
  NOT_ELIGIBLE_MESSAGE,
  isAllowedEmail,
} from "@/lib/legal";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isAllowedEmail(email)) {
      setError(NOT_ELIGIBLE_MESSAGE);
      return;
    }

    if (!acceptedTerms) {
      setError("You must review and agree to the Terms of Service and Privacy Policy to create an account.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error: authError } = await signUp(email, password, { full_name: name });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data?.user) {
      try {
        const supabase = createBrowserSupabaseClient();
        await supabase.from("user_legal_acceptances").insert({
          user_id: data.user.id,
          terms_version: TERMS_VERSION,
          privacy_version: PRIVACY_VERSION,
          user_agent: navigator.userAgent,
        });
      } catch {
        // Non-fatal — will be caught by /accept-terms on next login if table doesn't exist yet
      }
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
          <p className="mt-3 text-sm text-gray-600">
            We sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account, then log in to set up your colony workspace.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="pattern-dots absolute inset-0" />
      <div className="relative w-full max-w-sm">
        <div className="text-center">
          <LogoFull />
          <h1 className="mt-6 text-xl font-bold tracking-tight text-gray-900">
            Create your XenoTrack account
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Set up your lab workspace · Track bins, frogs, use/rest cycles, and colony records
          </p>
        </div>

        {/* Early-access eligibility notice */}
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
          <p className="font-semibold">
            XenoTrack early access is currently limited to university-affiliated users.
          </p>
          <p className="mt-1">
            Please sign up with a <strong>.edu</strong> email address. If your institution does not
            use .edu or you need access as an approved collaborator, contact the administrator at{" "}
            <a href={`mailto:${ADMIN_CONTACT}`} className="font-medium underline hover:text-amber-950">
              {ADMIN_CONTACT}
            </a>
            .
          </p>
        </div>

        {/* Hosted model explanation */}
        <div className="mt-4 rounded-lg border border-brand-100 bg-brand-50/50 p-3 text-xs leading-relaxed text-gray-600">
          <p>
            XenoTrack is a hosted colony recordkeeping system. Your lab workspace is private to your account and authorized team members. Colony records are stored securely in the XenoTrack database and can be exported as CSV files at any time.
          </p>
          <p className="mt-2 text-gray-500">
            You remain responsible for maintaining any official institutional records required by your lab, veterinarian, IACUC, or institution.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-xs text-gray-400">(university .edu required for early access)</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="you@university.edu"
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
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Re-enter your password"
            />
          </div>

          {/* Terms visibility note */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-700">
              Please review the Terms of Service and Privacy Policy before creating an account.
            </p>
            <div className="mt-2 flex gap-3 text-xs">
              <Link href="/terms" target="_blank" className="text-brand-600 hover:underline">
                Read Terms of Service →
              </Link>
              <Link href="/privacy" target="_blank" className="text-brand-600 hover:underline">
                Read Privacy Policy →
              </Link>
            </div>
            <label className="mt-3 flex items-start gap-2">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300"
              />
              <span className="text-xs text-gray-700">
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          Lab/workspace setup happens after you confirm your email.
        </p>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-600 hover:underline">
            Log in
          </Link>
        </p>

        <div className="mt-8 flex justify-center gap-4 text-xs text-gray-400">
          <Link href="/terms" className="hover:text-gray-600">Terms</Link>
          <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
        </div>
      </div>
    </div>
  );
}
