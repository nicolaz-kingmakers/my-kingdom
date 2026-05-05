// Theme catalog — clubs, countries, events.
// Each theme drives the Kingdom header gradient and accent colour.

export interface ThemeDefinition {
  id: string;
  label: string;
  category: "kingdom" | "clubs" | "countries" | "events";
  preview: string;          // emoji shown in picker
  swatchA: string;          // left swatch colour
  swatchB: string;          // right swatch colour
  headerGradient: string;   // Kingdom header background
  accentColor: string;      // badge + highlights
  accentTextColor: string;  // text on top of accentColor
}

export const THEME_CATALOG: Record<string, ThemeDefinition> = {

  // ── My Kingdom (default brand) ───────────────────────────────────────────
  "dark-gold": {
    id: "dark-gold", label: "My Kingdom", category: "kingdom",
    preview: "👑", swatchA: "#1A0408", swatchB: "#C8102E",
    headerGradient: "linear-gradient(160deg, #1A0408 0%, #C8102E 60%, #8B0B1E 100%)",
    accentColor: "#F0B429", accentTextColor: "#000",
  },

  // ── Clubs ────────────────────────────────────────────────────────────────
  "kaizer-chiefs": {
    id: "kaizer-chiefs", label: "Kaizer Chiefs", category: "clubs",
    preview: "🦅", swatchA: "#1a1200", swatchB: "#FFD700",
    headerGradient: "linear-gradient(160deg, #0d0d00 0%, #C5A000 55%, #8B7000 100%)",
    accentColor: "#FFD700", accentTextColor: "#000",
  },
  "orlando-pirates": {
    id: "orlando-pirates", label: "Orlando Pirates", category: "clubs",
    preview: "☠️", swatchA: "#000000", swatchB: "#555555",
    headerGradient: "linear-gradient(160deg, #000000 0%, #1a1a1a 55%, #2e2e2e 100%)",
    accentColor: "#ffffff", accentTextColor: "#000",
  },
  "sundowns": {
    id: "sundowns", label: "Mamelodi Sundowns", category: "clubs",
    preview: "☀️", swatchA: "#003087", swatchB: "#FFD700",
    headerGradient: "linear-gradient(160deg, #001a4d 0%, #009A44 50%, #FFD700 100%)",
    accentColor: "#FFD700", accentTextColor: "#000",
  },
  "real-madrid": {
    id: "real-madrid", label: "Real Madrid", category: "clubs",
    preview: "⚪", swatchA: "#1a1a2e", swatchB: "#FEBE10",
    headerGradient: "linear-gradient(160deg, #1a1a2e 0%, #003DA5 60%, #001489 100%)",
    accentColor: "#FEBE10", accentTextColor: "#000",
  },
  "barcelona": {
    id: "barcelona", label: "Barcelona", category: "clubs",
    preview: "🔵", swatchA: "#003087", swatchB: "#A50044",
    headerGradient: "linear-gradient(160deg, #001a52 0%, #A50044 55%, #003087 100%)",
    accentColor: "#EDBB00", accentTextColor: "#000",
  },
  "arsenal": {
    id: "arsenal", label: "Arsenal", category: "clubs",
    preview: "🔴", swatchA: "#0e0000", swatchB: "#EF0107",
    headerGradient: "linear-gradient(160deg, #0e0000 0%, #EF0107 60%, #9C0000 100%)",
    accentColor: "#EF0107", accentTextColor: "#fff",
  },

  // ── Countries ────────────────────────────────────────────────────────────
  "south-africa": {
    id: "south-africa", label: "South Africa", category: "countries",
    preview: "🇿🇦", swatchA: "#007749", swatchB: "#FFB612",
    headerGradient: "linear-gradient(160deg, #002395 0%, #007749 55%, #FFB612 100%)",
    accentColor: "#FFB612", accentTextColor: "#000",
  },
  "nigeria": {
    id: "nigeria", label: "Nigeria", category: "countries",
    preview: "🇳🇬", swatchA: "#006400", swatchB: "#008751",
    headerGradient: "linear-gradient(160deg, #003d00 0%, #008751 60%, #005c00 100%)",
    accentColor: "#00b341", accentTextColor: "#000",
  },
  "zambia": {
    id: "zambia", label: "Zambia", category: "countries",
    preview: "🇿🇲", swatchA: "#198A00", swatchB: "#EF7D00",
    headerGradient: "linear-gradient(160deg, #0e4d00 0%, #DE2010 55%, #EF7D00 100%)",
    accentColor: "#EF7D00", accentTextColor: "#000",
  },
  "spain": {
    id: "spain", label: "Spain", category: "countries",
    preview: "🇪🇸", swatchA: "#AA151B", swatchB: "#F1BF00",
    headerGradient: "linear-gradient(160deg, #5c0000 0%, #AA151B 60%, #8B0000 100%)",
    accentColor: "#F1BF00", accentTextColor: "#000",
  },

  // ── Events ───────────────────────────────────────────────────────────────
  "champions-league": {
    id: "champions-league", label: "Champions League", category: "events",
    preview: "⭐", swatchA: "#0B0B3B", swatchB: "#1B3A8E",
    headerGradient: "linear-gradient(160deg, #0B0B3B 0%, #1B3A8E 60%, #00438A 100%)",
    accentColor: "#C0C0C0", accentTextColor: "#000",
  },
  "afcon": {
    id: "afcon", label: "AFCON", category: "events",
    preview: "🌍", swatchA: "#004C3F", swatchB: "#CF9C00",
    headerGradient: "linear-gradient(160deg, #002a23 0%, #CF9C00 55%, #006B3F 100%)",
    accentColor: "#CF9C00", accentTextColor: "#000",
  },
  "world-cup": {
    id: "world-cup", label: "World Cup", category: "events",
    preview: "🏆", swatchA: "#1a2744", swatchB: "#C9A84C",
    headerGradient: "linear-gradient(160deg, #0d1527 0%, #1a3a7a 55%, #C9A84C 100%)",
    accentColor: "#C9A84C", accentTextColor: "#000",
  },
};

export const DEFAULT_THEME = THEME_CATALOG["dark-gold"];

export const THEME_CATEGORIES: { id: ThemeDefinition["category"]; label: string }[] = [
  { id: "kingdom",   label: "MY KINGDOM" },
  { id: "clubs",     label: "CLUBS" },
  { id: "countries", label: "COUNTRIES" },
  { id: "events",    label: "EVENTS" },
];
