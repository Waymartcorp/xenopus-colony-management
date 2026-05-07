"use client";

// TODO: Fetch current user from Supabase Auth
// TODO: Show user profile, email, name, phone
// TODO: Allow updating name, phone, notification preferences
// TODO: Show organization memberships
// TODO: Sign-out button
// TODO: Show legal acceptance status

export default function AccountPage() {
  async function handleSignOut() {
    // TODO: Call Supabase auth.signOut()
    window.location.href = "/login";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Account</h1>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
          {/* TODO: Display user data */}
          <div className="mt-4 space-y-3">
            <Field label="Name" value="—" />
            <Field label="Email" value="—" />
            <Field label="Phone" value="—" />
            <Field label="Organization" value="—" />
            <Field label="Role" value="—" />
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-800">Legal</h2>
          <p className="mt-2 text-sm text-gray-600">
            Terms of Service and Privacy Policy acceptance status.
          </p>
          {/* TODO: Show accepted versions and dates */}
          <p className="mt-3 text-xs text-gray-400">
            Accepted: Terms v1.0, Privacy v1.0
          </p>
        </section>

        <button
          onClick={handleSignOut}
          className="w-full rounded-lg border border-red-300 bg-white px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
