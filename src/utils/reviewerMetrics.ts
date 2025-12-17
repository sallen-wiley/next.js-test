/**
 * Utility functions for calculating reviewer metrics
 */

// Public email domains to check against
const PUBLIC_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "mail.com",
  "protonmail.com",
  "zoho.com",
  "yandex.com",
  "gmx.com",
];

/**
 * Check if email is from an institutional domain (not a public provider)
 * @param email - Email address to check
 * @returns true if institutional, false if public domain
 */
export function isInstitutionalEmail(email: string): boolean {
  if (!email) return false;

  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;

  return !PUBLIC_EMAIL_DOMAINS.includes(domain);
}

/**
 * Calculate acceptance rate as a percentage
 * @param totalAcceptances - Number of invitations accepted
 * @param totalInvitations - Total number of invitations sent
 * @returns Percentage (0-100), or 0 if no invitations
 */
export function calculateAcceptanceRate(
  totalAcceptances: number,
  totalInvitations: number
): number {
  if (totalInvitations === 0) return 0;
  return Math.round((totalAcceptances / totalInvitations) * 100);
}

/**
 * Calculate days since a date
 * @param dateString - ISO date string
 * @returns Number of days since date, or null if no date
 */
export function daysSince(
  dateString: string | null | undefined
): number | null {
  if (!dateString) return null;

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Count solo-authored publications
 * @param publications - Array of publications with authors field
 * @returns Count of publications with exactly one author
 */
export function countSoloAuthored(
  publications: Array<{ authors: string[] | null }>
): number {
  return publications.filter((pub) => pub.authors && pub.authors.length === 1)
    .length;
}

/**
 * Count publications from last N years
 * @param publications - Array of publications with publication_date field
 * @param years - Number of years to look back (default 5)
 * @returns Count of publications within the time range
 */
export function countRecentPublications(
  publications: Array<{ publication_date: string | null }>,
  years: number = 5
): number {
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - years);

  return publications.filter((pub) => {
    if (!pub.publication_date) return false;
    const pubDate = new Date(pub.publication_date);
    return pubDate >= cutoffDate;
  }).length;
}

/**
 * Count related publications
 * @param publications - Array of publications with is_related field
 * @returns Count of publications marked as related
 */
export function countRelatedPublications(
  publications: Array<{ is_related: boolean }>
): number {
  return publications.filter((pub) => pub.is_related).length;
}
