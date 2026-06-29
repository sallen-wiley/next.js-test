import type { TenantType } from "./types";

export const availableTenants: TenantType[] = [
  "wiley",
  "wiley2025",
  "sage",
  "emerald",
  "ieee",
  "re-light-stacked",
  "re-bold-stacked",
  "re-light-allcaps",
  "re-bold-allcaps",
  "re-bold",
  "default",
];

const tenantSet = new Set<string>(availableTenants);

export const isTenantType = (value: string): value is TenantType =>
  tenantSet.has(value);

export const legacyTenantAliases: Record<string, TenantType> = {
  researchexchange: "re-light-stacked",
};
