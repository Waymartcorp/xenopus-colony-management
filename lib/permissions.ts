/**
 * Role-based permission system for XenoTrack.
 *
 * Role hierarchy: owner > admin > manager > tech > viewer
 * Each higher role includes all permissions of lower roles.
 *
 * See docs/PRIVACY_AND_PERMISSIONS.md.
 */

export type Role = "owner" | "admin" | "manager" | "tech" | "viewer";

const ROLE_LEVELS: Record<Role, number> = {
  viewer: 0,
  tech: 1,
  manager: 2,
  admin: 3,
  owner: 4,
};

export type Permission =
  | "view_frogs"
  | "create_frogs"
  | "edit_frogs"
  | "delete_frogs"
  | "log_events"
  | "bulk_log_events"
  | "manage_locations"
  | "manage_team"
  | "manage_notifications"
  | "manage_shipments"
  | "claim_shipments"
  | "upload_photos"
  | "view_reports"
  | "export_data"
  | "manage_org_settings"
  | "manage_lab_mode"
  | "manage_rotation_settings"
  | "manage_protocols"
  | "log_environment"
  | "view_analytics"
  | "manage_recommendations"
  | "view_performance"
  | "manage_workspace_profile";

const PERMISSION_MIN_ROLE: Record<Permission, Role> = {
  view_frogs: "viewer",
  create_frogs: "tech",
  edit_frogs: "tech",
  delete_frogs: "admin",
  log_events: "tech",
  bulk_log_events: "tech",
  manage_locations: "manager",
  manage_team: "admin",
  manage_notifications: "manager",
  manage_shipments: "manager",
  claim_shipments: "admin",
  upload_photos: "tech",
  view_reports: "manager",
  export_data: "manager",
  manage_org_settings: "owner",
  manage_lab_mode: "admin",
  manage_rotation_settings: "admin",
  manage_protocols: "manager",
  log_environment: "tech",
  view_analytics: "viewer",
  manage_recommendations: "manager",
  view_performance: "viewer",
  manage_workspace_profile: "admin",
};

export function hasPermission(userRole: Role, permission: Permission): boolean {
  const requiredLevel = ROLE_LEVELS[PERMISSION_MIN_ROLE[permission]];
  const userLevel = ROLE_LEVELS[userRole];
  return userLevel >= requiredLevel;
}

export function hasRole(userRole: Role, minimumRole: Role): boolean {
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[minimumRole];
}

export function getAllPermissions(userRole: Role): Permission[] {
  return (Object.entries(PERMISSION_MIN_ROLE) as [Permission, Role][])
    .filter(([, minRole]) => ROLE_LEVELS[userRole] >= ROLE_LEVELS[minRole])
    .map(([permission]) => permission);
}

// TODO: Integrate with Supabase RLS policies
// TODO: Add server-side permission check middleware
// TODO: Add UI helper to conditionally render based on permissions
// TODO: Add module-level permission checks (if module is disabled, no access)
