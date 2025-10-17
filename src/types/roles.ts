export type UserRole =
  | "admin"
  | "editor"
  | "designer"
  | "product_manager"
  | "reviewer"
  | "guest";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  department?: string;
  permissions: string[];
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface RolePermissions {
  canViewAdmin: boolean;
  canManageUsers: boolean;
  canEditManuscripts: boolean;
  canViewAllManuscripts: boolean;
  canAssignReviewers: boolean;
  canViewReviewerData: boolean;
  canExportData: boolean;
  canViewDesignSystem: boolean;
  canEditSettings: boolean;
}

export const ROLE_DEFINITIONS: Record<
  UserRole,
  {
    name: string;
    description: string;
    permissions: RolePermissions;
    color: "error" | "warning" | "info" | "success" | "primary" | "secondary";
  }
> = {
  admin: {
    name: "Administrator",
    description: "Full system access and user management",
    color: "error",
    permissions: {
      canViewAdmin: true,
      canManageUsers: true,
      canEditManuscripts: true,
      canViewAllManuscripts: true,
      canAssignReviewers: true,
      canViewReviewerData: true,
      canExportData: true,
      canViewDesignSystem: true,
      canEditSettings: true,
    },
  },
  editor: {
    name: "Editor",
    description: "Manages manuscripts and reviewer assignments",
    color: "primary",
    permissions: {
      canViewAdmin: false,
      canManageUsers: false,
      canEditManuscripts: true,
      canViewAllManuscripts: true,
      canAssignReviewers: true,
      canViewReviewerData: true,
      canExportData: true,
      canViewDesignSystem: false,
      canEditSettings: false,
    },
  },
  designer: {
    name: "Designer",
    description: "UI/UX design and design system access",
    color: "secondary",
    permissions: {
      canViewAdmin: false,
      canManageUsers: false,
      canEditManuscripts: false,
      canViewAllManuscripts: true,
      canAssignReviewers: false,
      canViewReviewerData: false,
      canExportData: false,
      canViewDesignSystem: true,
      canEditSettings: false,
    },
  },
  product_manager: {
    name: "Product Manager",
    description: "Product oversight and analytics access",
    color: "info",
    permissions: {
      canViewAdmin: false,
      canManageUsers: false,
      canEditManuscripts: false,
      canViewAllManuscripts: true,
      canAssignReviewers: false,
      canViewReviewerData: true,
      canExportData: true,
      canViewDesignSystem: true,
      canEditSettings: false,
    },
  },
  reviewer: {
    name: "Reviewer",
    description: "External reviewer with limited access",
    color: "success",
    permissions: {
      canViewAdmin: false,
      canManageUsers: false,
      canEditManuscripts: false,
      canViewAllManuscripts: false,
      canAssignReviewers: false,
      canViewReviewerData: false,
      canExportData: false,
      canViewDesignSystem: false,
      canEditSettings: false,
    },
  },
  guest: {
    name: "Guest",
    description: "Limited read-only access",
    color: "warning",
    permissions: {
      canViewAdmin: false,
      canManageUsers: false,
      canEditManuscripts: false,
      canViewAllManuscripts: false,
      canAssignReviewers: false,
      canViewReviewerData: false,
      canExportData: false,
      canViewDesignSystem: false,
      canEditSettings: false,
    },
  },
};

export function getRolePermissions(role: UserRole): RolePermissions {
  return ROLE_DEFINITIONS[role].permissions;
}

export function hasPermission(
  role: UserRole,
  permission: keyof RolePermissions
): boolean {
  return getRolePermissions(role)[permission];
}
