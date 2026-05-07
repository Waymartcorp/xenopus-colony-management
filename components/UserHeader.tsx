"use client";

// TODO: Fetch actual user, org, and role from Supabase Auth + organization_memberships
// TODO: Show real last-login timestamp from auth metadata

interface UserHeaderProps {
  userName?: string;
  email?: string;
  role?: string;
  orgName?: string;
  labMode?: string;
  snapshotTime?: Date;
}

const MOCK_USER: UserHeaderProps = {
  userName: "Jane Smith",
  email: "jane.smith@lab.edu",
  role: "Technician",
  orgName: "Vanderbilt Dewar Lab",
  labMode: "Extract Lab Mode",
  snapshotTime: new Date(),
};

export default function UserHeader(props: UserHeaderProps) {
  const user = { ...MOCK_USER, ...props };

  const timestamp = user.snapshotTime
    ? user.snapshotTime.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{user.userName}</span>
          <span className="text-gray-300">·</span>
          <span>{user.role}</span>
          <span className="text-gray-300">·</span>
          <span>{user.orgName}</span>
          <span className="text-gray-300">·</span>
          <span className="text-brand-600">{user.labMode}</span>
        </div>
        <a
          href="/account"
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Account
        </a>
      </div>
      <p className="mt-0.5 text-xs text-gray-400">
        Colony snapshot: {timestamp}
      </p>
    </div>
  );
}
