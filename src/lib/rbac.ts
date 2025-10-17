// Role-based access control configuration
export interface UserRole {
  name: string;
  permissions: Permission[];
  description: string;
}

export interface Permission {
  resource: string;
  actions: string[];
}

// Define available roles
export const ROLES: Record<string, UserRole> = {
  editor: {
    name: "Editor",
    description: "Can manage manuscripts and review invitations",
    permissions: [
      {
        resource: "manuscripts",
        actions: ["read", "create", "update", "delete"],
      },
      { resource: "reviewers", actions: ["read", "create", "update"] },
      {
        resource: "invitations",
        actions: ["read", "create", "update", "delete"],
      },
      { resource: "dashboard", actions: ["read"] },
    ],
  },
  reviewer: {
    name: "Reviewer",
    description: "Can view assigned manuscripts and respond to invitations",
    permissions: [
      { resource: "manuscripts", actions: ["read"] },
      { resource: "invitations", actions: ["read", "update"] }, // Can accept/decline
      { resource: "reviews", actions: ["read", "create", "update"] },
    ],
  },
  admin: {
    name: "Administrator",
    description: "Full system access",
    permissions: [
      { resource: "*", actions: ["*"] }, // Full access
    ],
  },
  guest: {
    name: "Guest",
    description: "Read-only access to public data",
    permissions: [
      { resource: "manuscripts", actions: ["read"] },
      { resource: "dashboard", actions: ["read"] },
    ],
  },
};

// Permission checking utilities
export function hasPermission(
  userRole: string,
  resource: string,
  action: string
): boolean {
  const role = ROLES[userRole];
  if (!role) return false;

  // Check for admin wildcard permission
  const adminPerm = role.permissions.find(
    (p) => p.resource === "*" && p.actions.includes("*")
  );
  if (adminPerm) return true;

  // Check specific resource permission
  const permission = role.permissions.find((p) => p.resource === resource);
  if (!permission) return false;

  return (
    permission.actions.includes(action) || permission.actions.includes("*")
  );
}

export function canAccessPage(userRole: string, page: string): boolean {
  switch (page) {
    case "/reviewer-dashboard":
      return hasPermission(userRole, "dashboard", "read");
    case "/write-demo":
      return hasPermission(userRole, "manuscripts", "create");
    case "/data-demo":
      return hasPermission(userRole, "manuscripts", "read");
    default:
      return true; // Public pages
  }
}

// Demo users for testing
export const DEMO_USERS = [
  {
    email: "editor@example.com",
    password: "editor123",
    role: "editor",
    name: "Dr. Jane Editor",
  },
  {
    email: "reviewer@example.com",
    password: "reviewer123",
    role: "reviewer",
    name: "Prof. John Reviewer",
  },
  {
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    name: "System Administrator",
  },
  {
    email: "guest@example.com",
    password: "guest123",
    role: "guest",
    name: "Guest User",
  },
];
