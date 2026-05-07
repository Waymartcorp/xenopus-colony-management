export default function InstitutionsPage() {
  // TODO: Fetch current user's organizations from Supabase
  // TODO: Show organization settings, team members, roles
  // TODO: Allow creating a new institution workspace
  // TODO: InstitutionSwitcher for users in multiple orgs
  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold text-gray-900">Institution</h1>
      <p className="mt-2 text-gray-600">
        Manage your lab workspace, team members, and roles.
      </p>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Workspace Details
        </h2>
        {/* TODO: Display org name, type, creation date */}
        <p className="mt-4 text-sm text-gray-500">
          No institution loaded. Sign in to view your workspace.
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-800">Team Members</h2>
        {/* TODO: List members with roles (owner, admin, manager, tech, viewer) */}
        <p className="mt-4 text-sm text-gray-500">
          Team members will appear here.
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-800">Invite</h2>
        {/* TODO: Invite form with role selection */}
        <p className="mt-4 text-sm text-gray-500">
          Invite new team members by email.
        </p>
      </section>
    </div>
  );
}
