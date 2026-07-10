import type { PotentialReviewerWithMatch } from "@/lib/supabase";

const normalizeText = (value: string) => value.toLowerCase().trim();

const tokenizeText = (value: string) =>
  normalizeText(value)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const truncateValue = (value: string, maxLength: number = 48) =>
  value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;

const matchesText = (value: string, normalizedSearch: string) => {
  if (!value) {
    return false;
  }

  const normalizedValue = normalizeText(value);
  if (!normalizedValue) {
    return false;
  }

  const useTokenPrefixOnly =
    normalizedSearch.length <= 3 && !normalizedSearch.includes(" ");

  if (!useTokenPrefixOnly && normalizedValue.includes(normalizedSearch)) {
    return true;
  }

  return tokenizeText(value).some((token) => token.startsWith(normalizedSearch));
};

export const getReviewerSearchMatchReasons = (
  reviewer: PotentialReviewerWithMatch,
  searchTerm: string,
): string[] => {
  const normalizedSearch = normalizeText(searchTerm);
  if (!normalizedSearch) {
    return [];
  }

  const reasons: string[] = [];

  if (matchesText(reviewer.name, normalizedSearch)) {
    reasons.push(`name: ${reviewer.name}`);
  }

  if (matchesText(reviewer.email, normalizedSearch)) {
    reasons.push(`email: ${reviewer.email}`);
  }

  if (matchesText(reviewer.affiliation, normalizedSearch)) {
    reasons.push(`affiliation: ${truncateValue(reviewer.affiliation)}`);
  }

  const matchingExpertise = reviewer.expertise_areas.find((area) =>
    matchesText(area, normalizedSearch),
  );
  if (matchingExpertise) {
    reasons.push(`keyword: ${truncateValue(matchingExpertise)}`);
  }

  return reasons;
};
