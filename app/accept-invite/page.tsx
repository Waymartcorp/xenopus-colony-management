// TODO: Read invite token from URL search params
// TODO: Validate invite token against invitations table
// TODO: Show organization name and role being offered
// TODO: If user is logged in, accept invite and add membership
// TODO: If user is not logged in, redirect to signup with invite context

export default function AcceptInvitePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-900">Accept Invitation</h1>
        <p className="mt-4 text-gray-600">
          You&apos;ve been invited to join a lab workspace on XenoTrack.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          {/* TODO: Show invite details (org name, role, inviter) */}
          <p className="text-sm text-gray-500">
            Loading invitation details...
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <button className="w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            Accept &amp; Join
          </button>
          <p className="text-xs text-gray-400">
            You&apos;ll need to sign in or create an account to join.
          </p>
        </div>
      </div>
    </div>
  );
}
