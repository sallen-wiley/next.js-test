import { migratePaletteData } from "./paletteService";
import type { HueSet } from "../types";

const STORAGE_KEY = "paletteGenerator.localDrafts.v1";
const MAX_DRAFTS = 20;

interface LocalDraftPayload {
  drafts: LocalPaletteDraft[];
}

export interface LocalPaletteDraft {
  id: string;
  name: string;
  description?: string;
  palette_data: HueSet[];
  created_at: string;
  updated_at: string;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseDraft(input: unknown): LocalPaletteDraft | null {
  if (!isObject(input)) {
    return null;
  }

  const id = typeof input.id === "string" ? input.id : "";
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const description =
    typeof input.description === "string" ? input.description : undefined;
  const createdAt =
    typeof input.created_at === "string"
      ? input.created_at
      : new Date().toISOString();
  const updatedAt =
    typeof input.updated_at === "string" ? input.updated_at : createdAt;
  const paletteData = Array.isArray(input.palette_data)
    ? migratePaletteData(input.palette_data as HueSet[])
    : null;

  if (!id || !name || !paletteData) {
    return null;
  }

  return {
    id,
    name,
    description,
    palette_data: paletteData,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

function readPayload(): LocalDraftPayload {
  if (typeof window === "undefined") {
    return { drafts: [] };
  }

  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return { drafts: [] };
    }

    const parsed = JSON.parse(rawValue) as unknown;
    const rawDrafts =
      isObject(parsed) && Array.isArray(parsed.drafts) ? parsed.drafts : [];

    const drafts = rawDrafts
      .map(parseDraft)
      .filter((draft): draft is LocalPaletteDraft => draft !== null)
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )
      .slice(0, MAX_DRAFTS);

    if (drafts.length !== rawDrafts.length) {
      writePayload({ drafts });
    }

    return { drafts };
  } catch {
    return { drafts: [] };
  }
}

function writePayload(payload: LocalDraftPayload): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function generateDraftId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function listLocalDrafts(): LocalPaletteDraft[] {
  return readPayload().drafts;
}

export function getLocalDraftById(draftId: string): LocalPaletteDraft | null {
  const draft = readPayload().drafts.find((item) => item.id === draftId);
  return draft || null;
}

export function saveLocalDraft(input: {
  name: string;
  paletteData: HueSet[];
  description?: string;
  draftId?: string;
}): LocalPaletteDraft {
  const name = input.name.trim();
  if (!name) {
    throw new Error("Draft name is required");
  }

  if (!Array.isArray(input.paletteData) || input.paletteData.length === 0) {
    throw new Error("Palette data is required");
  }

  const payload = readPayload();
  const now = new Date().toISOString();
  const migratedPalette = migratePaletteData(input.paletteData);
  const existingIndex = input.draftId
    ? payload.drafts.findIndex((draft) => draft.id === input.draftId)
    : -1;

  if (existingIndex >= 0) {
    const existing = payload.drafts[existingIndex];
    const updatedDraft: LocalPaletteDraft = {
      ...existing,
      name,
      description: input.description?.trim() || undefined,
      palette_data: migratedPalette,
      updated_at: now,
    };

    payload.drafts[existingIndex] = updatedDraft;
    payload.drafts.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
    writePayload(payload);
    return updatedDraft;
  }

  const draft: LocalPaletteDraft = {
    id: generateDraftId(),
    name,
    description: input.description?.trim() || undefined,
    palette_data: migratedPalette,
    created_at: now,
    updated_at: now,
  };

  payload.drafts = [draft, ...payload.drafts].slice(0, MAX_DRAFTS);
  writePayload(payload);
  return draft;
}

export function renameLocalDraft(
  draftId: string,
  name: string,
): LocalPaletteDraft {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("Draft name is required");
  }

  const payload = readPayload();
  const index = payload.drafts.findIndex((draft) => draft.id === draftId);
  if (index < 0) {
    throw new Error("Draft not found");
  }

  const updated: LocalPaletteDraft = {
    ...payload.drafts[index],
    name: trimmedName,
    updated_at: new Date().toISOString(),
  };

  payload.drafts[index] = updated;
  payload.drafts.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
  writePayload(payload);

  return updated;
}

export function updateLocalDraftDescription(
  draftId: string,
  description?: string,
): LocalPaletteDraft {
  const payload = readPayload();
  const index = payload.drafts.findIndex((draft) => draft.id === draftId);
  if (index < 0) {
    throw new Error("Draft not found");
  }

  const updated: LocalPaletteDraft = {
    ...payload.drafts[index],
    description: description?.trim() || undefined,
    updated_at: new Date().toISOString(),
  };

  payload.drafts[index] = updated;
  payload.drafts.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
  writePayload(payload);

  return updated;
}

export function deleteLocalDraft(draftId: string): boolean {
  const payload = readPayload();
  const filtered = payload.drafts.filter((draft) => draft.id !== draftId);

  if (filtered.length === payload.drafts.length) {
    return false;
  }

  writePayload({ drafts: filtered });
  return true;
}

export function clearLocalDrafts(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}

export function getLocalDraftStorageKey(): string {
  return STORAGE_KEY;
}

export function getLocalDraftLimit(): number {
  return MAX_DRAFTS;
}
