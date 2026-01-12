/**
 * Palette Service
 *
 * Service layer for CRUD operations on user color palettes.
 * Handles database interactions with Supabase for the HSV Palette Generator.
 */

import { supabase } from "@/lib/supabase";
import type { UserPalette, PaletteData } from "@/lib/supabase";

// ============================================================================
// ERROR TYPES
// ============================================================================

export class PaletteServiceError extends Error {
  constructor(message: string, public code?: string, public details?: unknown) {
    super(message);
    this.name = "PaletteServiceError";
  }
}

// ============================================================================
// MIGRATION & FORMAT UTILITIES
// ============================================================================

/**
 * Migrate old palette format to current format
 * Handles palettes that may have been saved with older data structures
 */
export function migratePaletteData(data: PaletteData): PaletteData {
  return data.map((hue) => {
    // If already has shadeConfig, no migration needed
    if (hue.shadeConfig) {
      return hue;
    }

    // Migrate from old format (shades with .value) to new format (shadeConfig)
    const shadeConfig = hue.shades.map((shade, index) => ({
      id: String(index + 1),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      label: String((shade as any).value || (index + 1) * 100),
    }));

    return {
      ...hue,
      shadeConfig,
      shades: hue.shades.map((shade, index) => ({
        ...shade,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label: String((shade as any).value || (index + 1) * 100),
      })),
    };
  });
}

/**
 * Generate MUI theme export format from palette data
 * Converts HueSet[] to MUI palette structure: { palette: { blue: { 50: '#...', 100: '#...' } } }
 */
export function generateMuiThemeExport(data: PaletteData): {
  palette: Record<string, Record<string, string>>;
} {
  const palette: Record<string, Record<string, string>> = {};

  data.forEach((hue) => {
    const colorSet: Record<string, string> = {};
    hue.shades.forEach((shade) => {
      colorSet[shade.label] = shade.color;
    });
    palette[hue.muiName || hue.name] = colorSet;
  });

  return { palette };
}

/**
 * Generate complete export JSON (matches page.tsx exportPalette format)
 * Includes version, timestamp, colorSpace, muiTheme, and fullData
 */
export function generateFullExport(
  data: PaletteData,
  metadata?: {
    version?: string;
    name?: string;
    description?: string;
  }
): {
  version: string;
  generatedAt: string;
  colorSpace: "hsv";
  name?: string;
  description?: string;
  muiTheme: { palette: Record<string, Record<string, string>> };
  fullData: PaletteData;
} {
  return {
    version: metadata?.version || "1.0",
    generatedAt: new Date().toISOString(),
    colorSpace: "hsv",
    ...(metadata?.name && { name: metadata.name }),
    ...(metadata?.description && { description: metadata.description }),
    muiTheme: generateMuiThemeExport(data),
    fullData: data,
  };
}

// ============================================================================
// PALETTE CRUD OPERATIONS
// ============================================================================

/**
 * Save a new palette or update an existing one
 * @param userId - User ID from auth.users
 * @param name - Display name for the palette
 * @param paletteData - Complete HueSet[] array from palette generator
 * @param options - Additional options (description, isPublic, paletteId for updates)
 * @returns Created/updated palette record
 */
export async function savePalette(
  userId: string,
  name: string,
  paletteData: PaletteData,
  options: {
    description?: string;
    isPublic?: boolean;
    paletteId?: string; // If provided, updates existing palette
  } = {}
): Promise<UserPalette> {
  const { description, isPublic = false, paletteId } = options;

  try {
    // UPDATE existing palette
    if (paletteId) {
      const { data, error } = await supabase
        .from("user_palettes")
        .update({
          name,
          description,
          palette_data: paletteData,
          is_public: isPublic,
          updated_at: new Date().toISOString(),
        })
        .eq("id", paletteId)
        .eq("user_id", userId) // Ensure user owns this palette
        .select()
        .single();

      if (error) {
        throw new PaletteServiceError(
          `Failed to update palette: ${error.message}`,
          error.code,
          error.details
        );
      }

      if (!data) {
        throw new PaletteServiceError(
          "Palette not found or you don't have permission to update it",
          "NOT_FOUND"
        );
      }

      return data as UserPalette;
    }

    // CREATE new palette
    const { data, error } = await supabase
      .from("user_palettes")
      .insert({
        user_id: userId,
        name,
        description,
        palette_data: paletteData,
        is_public: isPublic,
        is_preset: false, // Users cannot create presets
      })
      .select()
      .single();

    if (error) {
      throw new PaletteServiceError(
        `Failed to create palette: ${error.message}`,
        error.code,
        error.details
      );
    }

    return data as UserPalette;
  } catch (error) {
    if (error instanceof PaletteServiceError) {
      throw error;
    }
    throw new PaletteServiceError(
      `Unexpected error saving palette: ${error}`,
      "UNKNOWN_ERROR",
      error
    );
  }
}

/**
 * Load a specific palette by ID
 * Automatically migrates old palette formats to current structure
 * @param paletteId - Palette UUID
 * @returns Palette record or null if not found/no access
 */
export async function loadPalette(
  paletteId: string
): Promise<UserPalette | null> {
  try {
    const { data, error } = await supabase
      .from("user_palettes")
      .select("*")
      .eq("id", paletteId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found or no access (RLS policy blocked)
        return null;
      }
      throw new PaletteServiceError(
        `Failed to load palette: ${error.message}`,
        error.code,
        error.details
      );
    }

    // Migrate palette data to ensure compatibility
    const palette = data as UserPalette;
    palette.palette_data = migratePaletteData(palette.palette_data);

    return palette;
  } catch (error) {
    if (error instanceof PaletteServiceError) {
      throw error;
    }
    throw new PaletteServiceError(
      `Unexpected error loading palette: ${error}`,
      "UNKNOWN_ERROR",
      error
    );
  }
}

/**
 * List all palettes for a specific user
 * @param userId - User ID from auth.users
 * @param options - Filtering options
 * @returns Array of user's palettes
 */
export async function listUserPalettes(
  userId: string,
  options: {
    includePublic?: boolean; // Include public palettes from other users
    limit?: number;
    offset?: number;
  } = {}
): Promise<UserPalette[]> {
  const { includePublic = false, limit = 50, offset = 0 } = options;

  try {
    let query = supabase
      .from("user_palettes")
      .select("*")
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (includePublic) {
      // Get user's palettes OR public palettes (but not presets)
      query = query.or(
        `user_id.eq.${userId},and(is_public.eq.true,is_preset.eq.false)`
      );
    } else {
      // Only user's own palettes
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      throw new PaletteServiceError(
        `Failed to list palettes: ${error.message}`,
        error.code,
        error.details
      );
    }

    // Ensure palette_data is properly typed and validated
    const palettes = (data || []).map((palette) => ({
      ...palette,
      palette_data: Array.isArray(palette.palette_data)
        ? palette.palette_data
        : [],
    })) as UserPalette[];

    return palettes;
  } catch (error) {
    if (error instanceof PaletteServiceError) {
      throw error;
    }
    throw new PaletteServiceError(
      `Unexpected error listing palettes: ${error}`,
      "UNKNOWN_ERROR",
      error
    );
  }
}

/**
 * List all public palettes (community shared)
 * @param options - Filtering options
 * @returns Array of public palettes with author information
 */
export async function listPublicPalettes(
  options: {
    excludePresets?: boolean; // Exclude system presets
    limit?: number;
    offset?: number;
  } = {}
): Promise<UserPalette[]> {
  const { excludePresets = true, limit = 50, offset = 0 } = options;

  try {
    // First get the palettes
    let query = supabase
      .from("user_palettes")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (excludePresets) {
      query = query.eq("is_preset", false);
    }

    const { data: palettes, error: palettesError } = await query;

    if (palettesError) {
      throw new PaletteServiceError(
        `Failed to list public palettes: ${palettesError.message}`,
        palettesError.code,
        palettesError.details
      );
    }

    if (!palettes || palettes.length === 0) {
      return [];
    }

    // Get unique user IDs
    const userIds = [...new Set(palettes.map((p) => p.user_id))];

    // Fetch user profiles separately
    const { data: profiles, error: profilesError } = await supabase
      .from("user_profiles")
      .select("id, full_name")
      .in("id", userIds);

    if (profilesError) {
      console.error("Failed to fetch user profiles:", profilesError);
      // Continue without author names rather than failing completely
    }

    // Create a map of user_id to full_name
    const profileMap = new Map(
      (profiles || []).map((p) => [p.id, p.full_name])
    );

    // Ensure palette_data is properly typed and add author_name
    const palettesWithAuthors = palettes.map((palette) => ({
      ...palette,
      palette_data: Array.isArray(palette.palette_data)
        ? palette.palette_data
        : [],
      author_name: profileMap.get(palette.user_id),
    })) as UserPalette[];

    return palettesWithAuthors;
  } catch (error) {
    if (error instanceof PaletteServiceError) {
      throw error;
    }
    throw new PaletteServiceError(
      `Unexpected error listing public palettes: ${error}`,
      "UNKNOWN_ERROR",
      error
    );
  }
}

/**
 * List all preset palettes (system-managed)
 * @returns Array of preset palettes
 */
export async function listPresetPalettes(): Promise<UserPalette[]> {
  try {
    const { data, error } = await supabase
      .from("user_palettes")
      .select("*")
      .eq("is_preset", true)
      .eq("is_public", true)
      .order("name", { ascending: true });

    if (error) {
      throw new PaletteServiceError(
        `Failed to list preset palettes: ${error.message}`,
        error.code,
        error.details
      );
    }

    // Ensure palette_data is properly typed and validated
    const palettes = (data || []).map((palette) => ({
      ...palette,
      palette_data: Array.isArray(palette.palette_data)
        ? palette.palette_data
        : [],
    })) as UserPalette[];

    return palettes;
  } catch (error) {
    if (error instanceof PaletteServiceError) {
      throw error;
    }
    throw new PaletteServiceError(
      `Unexpected error listing preset palettes: ${error}`,
      "UNKNOWN_ERROR",
      error
    );
  }
}

/**
 * Delete a palette
 * @param paletteId - Palette UUID
 * @param userId - User ID (for authorization check)
 * @returns True if deleted successfully
 */
export async function deletePalette(
  paletteId: string,
  userId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("user_palettes")
      .delete()
      .eq("id", paletteId)
      .eq("user_id", userId); // RLS will also enforce this

    if (error) {
      throw new PaletteServiceError(
        `Failed to delete palette: ${error.message}`,
        error.code,
        error.details
      );
    }

    return true;
  } catch (error) {
    if (error instanceof PaletteServiceError) {
      throw error;
    }
    throw new PaletteServiceError(
      `Unexpected error deleting palette: ${error}`,
      "UNKNOWN_ERROR",
      error
    );
  }
}

/**
 * Duplicate an existing palette (fork)
 * @param paletteId - Source palette UUID
 * @param userId - User ID for the new palette
 * @param newName - Name for the duplicated palette
 * @returns New palette record
 */
export async function duplicatePalette(
  paletteId: string,
  userId: string,
  newName: string
): Promise<UserPalette> {
  try {
    // Load source palette
    const sourcePalette = await loadPalette(paletteId);
    if (!sourcePalette) {
      throw new PaletteServiceError(
        "Source palette not found or you don't have access",
        "NOT_FOUND"
      );
    }

    // Create new palette with copied data
    return await savePalette(userId, newName, sourcePalette.palette_data, {
      description: sourcePalette.description
        ? `Copy of ${sourcePalette.name}: ${sourcePalette.description}`
        : `Copy of ${sourcePalette.name}`,
      isPublic: false, // Duplicates are private by default
    });
  } catch (error) {
    if (error instanceof PaletteServiceError) {
      throw error;
    }
    throw new PaletteServiceError(
      `Unexpected error duplicating palette: ${error}`,
      "UNKNOWN_ERROR",
      error
    );
  }
}

/**
 * Search palettes by name (for current user and public palettes)
 * @param searchTerm - Search term for palette name
 * @param userId - Optional user ID to include user's private palettes
 * @returns Array of matching palettes
 */
export async function searchPalettes(
  searchTerm: string,
  userId?: string
): Promise<UserPalette[]> {
  try {
    let query = supabase
      .from("user_palettes")
      .select("*")
      .ilike("name", `%${searchTerm}%`)
      .order("updated_at", { ascending: false })
      .limit(20);

    if (userId) {
      // Include user's own palettes + public palettes
      query = query.or(`user_id.eq.${userId},is_public.eq.true`);
    } else {
      // Only public palettes
      query = query.eq("is_public", true);
    }

    const { data, error } = await query;

    if (error) {
      throw new PaletteServiceError(
        `Failed to search palettes: ${error.message}`,
        error.code,
        error.details
      );
    }

    return (data || []) as UserPalette[];
  } catch (error) {
    if (error instanceof PaletteServiceError) {
      throw error;
    }
    throw new PaletteServiceError(
      `Unexpected error searching palettes: ${error}`,
      "UNKNOWN_ERROR",
      error
    );
  }
}

/**
 * Export palette as downloadable JSON file
 * Generates complete export format matching page.tsx exportPalette()
 * @param palette - UserPalette record to export
 * @returns Blob for download
 */
export function exportPaletteAsJson(palette: UserPalette): Blob {
  const exportData = generateFullExport(palette.palette_data, {
    name: palette.name,
    description: palette.description,
  });

  return new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });
}

/**
 * Download palette as JSON file
 * @param palette - UserPalette record to download
 * @param filename - Optional filename (defaults to palette name)
 */
export function downloadPalette(palette: UserPalette, filename?: string): void {
  const blob = exportPaletteAsJson(palette);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    filename || `${palette.name.replace(/\s+/g, "-").toLowerCase()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
