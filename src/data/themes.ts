export interface ThemeVars {
  "--brand":       string;
  "--brand-light": string;
  "--brand-dim":   string;
  "--brand-glow":  string;
  "--gold":        string;
  "--gold-light":  string;
  "--gold-dim":    string;
}

export interface ThemeDefinition {
  id: string;
  label: string;
  category: "kingdom" | "clubs" | "countries" | "events";
  preview: string;
  swatchA: string;
  swatchB: string;
  headerGradient: string;
  accentColor: string;
  accentTextColor: string;
  vars: ThemeVars;
}

export const THEME_CATALOG: Record<string, ThemeDefinition> = {

  // ── My Kingdom (default brand) ───────────────────────────────────────────
  "dark-gold": {
    id: "dark-gold", label: "My Kingdom", category: "kingdom",
    preview: "👑", swatchA: "#1A0408", swatchB: "#C8102E",
    headerGradient: "linear-gradient(160deg, #1A0408 0%, #C8102E 60%, #8B0B1E 100%)",
    accentColor: "#F0B429", accentTextColor: "#000",
    vars: {
      "--brand":       "#C8102E",
      "--brand-light": "#E5162F",
      "--brand-dim":   "#3D0510",
      "--brand-glow":  "rgba(200,16,46,0.25)",
      "--gold":        "#F0B429",
      "--gold-light":  "#FFD166",
      "--gold-dim":    "rgba(240,180,41,0.15)",
    },
  },

  // ── Clubs ────────────────────────────────────────────────────────────────
  "kaizer-chiefs": {
    id: "kaizer-chiefs", label: "Kaizer Chiefs", category: "clubs",
    preview: "🦅", swatchA: "#1a1200", swatchB: "#FFD700",
    headerGradient: "linear-gradient(160deg, #0d0d00 0%, #C5A000 55%, #8B7000 100%)",
    accentColor: "#FFD700", accentTextColor: "#000",
    vars: {
      "--brand":       "#C5A000",
      "--brand-light": "#FFD700",
      "--brand-dim":   "rgba(197,160,0,0.15)",
      "--brand-glow":  "rgba(197,160,0,0.30)",
      "--gold":        "#FFD700",
      "--gold-light":  "#FFE44D",
      "--gold-dim":    "rgba(255,215,0,0.15)",
    },
  },

  "orlando-pirates": {
    id: "orlando-pirates", label: "Orlando Pirates", category: "clubs",
    preview: "☠️", swatchA: "#000000", swatchB: "#CC2200",
    headerGradient: "linear-gradient(160deg, #000000 0%, #1a1a1a 40%, #CC2200 100%)",
    accentColor: "#CC2200", accentTextColor: "#fff",
    vars: {
      "--brand":       "#CC2200",
      "--brand-light": "#FF3322",
      "--brand-dim":   "rgba(204,34,0,0.15)",
      "--brand-glow":  "rgba(204,34,0,0.30)",
      "--gold":        "#AAAAAA",
      "--gold-light":  "#DDDDDD",
      "--gold-dim":    "rgba(200,200,200,0.10)",
    },
  },

  "sundowns": {
    id: "sundowns", label: "Mamelodi Sundowns", category: "clubs",
    preview: "☀️", swatchA: "#003087", swatchB: "#FFD700",
    headerGradient: "linear-gradient(160deg, #001a4d 0%, #009A44 50%, #FFD700 100%)",
    accentColor: "#FFD700", accentTextColor: "#000",
    vars: {
      "--brand":       "#FFCD00",
      "--brand-light": "#FFE033",
      "--brand-dim":   "rgba(255,205,0,0.15)",
      "--brand-glow":  "rgba(255,205,0,0.30)",
      "--gold":        "#009A44",
      "--gold-light":  "#00C458",
      "--gold-dim":    "rgba(0,154,68,0.15)",
    },
  },

  "real-madrid": {
    id: "real-madrid", label: "Real Madrid", category: "clubs",
    preview: "⚪", swatchA: "#1a1a2e", swatchB: "#FEBE10",
    headerGradient: "linear-gradient(160deg, #1a1a2e 0%, #003DA5 60%, #001489 100%)",
    accentColor: "#FEBE10", accentTextColor: "#000",
    vars: {
      "--brand":       "#FEBE10",
      "--brand-light": "#FFD34D",
      "--brand-dim":   "rgba(254,190,16,0.15)",
      "--brand-glow":  "rgba(254,190,16,0.30)",
      "--gold":        "#FFFFFF",
      "--gold-light":  "#E8E8E8",
      "--gold-dim":    "rgba(255,255,255,0.10)",
    },
  },

  "barcelona": {
    id: "barcelona", label: "Barcelona", category: "clubs",
    preview: "🔵", swatchA: "#003087", swatchB: "#A50044",
    headerGradient: "linear-gradient(160deg, #001a52 0%, #A50044 55%, #003087 100%)",
    accentColor: "#EDBB00", accentTextColor: "#000",
    vars: {
      "--brand":       "#A50044",
      "--brand-light": "#CF1168",
      "--brand-dim":   "rgba(165,0,68,0.15)",
      "--brand-glow":  "rgba(165,0,68,0.30)",
      "--gold":        "#004D98",
      "--gold-light":  "#1A6CB8",
      "--gold-dim":    "rgba(0,77,152,0.15)",
    },
  },

  "arsenal": {
    id: "arsenal", label: "Arsenal", category: "clubs",
    preview: "🔴", swatchA: "#0e0000", swatchB: "#EF0107",
    headerGradient: "linear-gradient(160deg, #0e0000 0%, #EF0107 60%, #9C0000 100%)",
    accentColor: "#EF0107", accentTextColor: "#fff",
    vars: {
      "--brand":       "#EF0107",
      "--brand-light": "#FF4D51",
      "--brand-dim":   "rgba(239,1,7,0.15)",
      "--brand-glow":  "rgba(239,1,7,0.30)",
      "--gold":        "#FFFFFF",
      "--gold-light":  "#E8E8E8",
      "--gold-dim":    "rgba(255,255,255,0.10)",
    },
  },

  // ── Countries ────────────────────────────────────────────────────────────
  "south-africa": {
    id: "south-africa", label: "South Africa", category: "countries",
    preview: "🇿🇦", swatchA: "#007749", swatchB: "#FFB612",
    headerGradient: "linear-gradient(160deg, #002395 0%, #007749 55%, #FFB612 100%)",
    accentColor: "#FFB612", accentTextColor: "#000",
    vars: {
      "--brand":       "#007A4D",
      "--brand-light": "#00A86B",
      "--brand-dim":   "rgba(0,122,77,0.15)",
      "--brand-glow":  "rgba(0,122,77,0.30)",
      "--gold":        "#FFB612",
      "--gold-light":  "#FFD04D",
      "--gold-dim":    "rgba(255,182,18,0.15)",
    },
  },

  "nigeria": {
    id: "nigeria", label: "Nigeria", category: "countries",
    preview: "🇳🇬", swatchA: "#006400", swatchB: "#008751",
    headerGradient: "linear-gradient(160deg, #003d00 0%, #008751 60%, #005c00 100%)",
    accentColor: "#FFFFFF", accentTextColor: "#006400",
    vars: {
      "--brand":       "#008751",
      "--brand-light": "#00B56B",
      "--brand-dim":   "rgba(0,135,81,0.15)",
      "--brand-glow":  "rgba(0,135,81,0.30)",
      "--gold":        "#FFFFFF",
      "--gold-light":  "#E8E8E8",
      "--gold-dim":    "rgba(255,255,255,0.10)",
    },
  },

  "zambia": {
    id: "zambia", label: "Zambia", category: "countries",
    preview: "🇿🇲", swatchA: "#198A00", swatchB: "#EF7D00",
    headerGradient: "linear-gradient(160deg, #0e4d00 0%, #DE2010 55%, #EF7D00 100%)",
    accentColor: "#EF7D00", accentTextColor: "#000",
    vars: {
      "--brand":       "#198A00",
      "--brand-light": "#22B800",
      "--brand-dim":   "rgba(25,138,0,0.15)",
      "--brand-glow":  "rgba(25,138,0,0.30)",
      "--gold":        "#EF7D00",
      "--gold-light":  "#FF9A22",
      "--gold-dim":    "rgba(239,125,0,0.15)",
    },
  },

  "spain": {
    id: "spain", label: "Spain", category: "countries",
    preview: "🇪🇸", swatchA: "#AA151B", swatchB: "#F1BF00",
    headerGradient: "linear-gradient(160deg, #5c0000 0%, #AA151B 60%, #8B0000 100%)",
    accentColor: "#F1BF00", accentTextColor: "#000",
    vars: {
      "--brand":       "#AA151B",
      "--brand-light": "#D42027",
      "--brand-dim":   "rgba(170,21,27,0.15)",
      "--brand-glow":  "rgba(170,21,27,0.30)",
      "--gold":        "#F1BF00",
      "--gold-light":  "#FFD733",
      "--gold-dim":    "rgba(241,191,0,0.15)",
    },
  },

  // ── Events ───────────────────────────────────────────────────────────────
  "champions-league": {
    id: "champions-league", label: "Champions League", category: "events",
    preview: "⭐", swatchA: "#0B0B3B", swatchB: "#1B3A8E",
    headerGradient: "linear-gradient(160deg, #0B0B3B 0%, #1B3A8E 60%, #00438A 100%)",
    accentColor: "#C0C0C0", accentTextColor: "#000",
    vars: {
      "--brand":       "#1B3A8E",
      "--brand-light": "#2A57C8",
      "--brand-dim":   "rgba(27,58,142,0.15)",
      "--brand-glow":  "rgba(27,58,142,0.30)",
      "--gold":        "#C0C0C0",
      "--gold-light":  "#E0E0E0",
      "--gold-dim":    "rgba(192,192,192,0.15)",
    },
  },

  "afcon": {
    id: "afcon", label: "AFCON", category: "events",
    preview: "🌍", swatchA: "#004C3F", swatchB: "#CF9C00",
    headerGradient: "linear-gradient(160deg, #002a23 0%, #CF9C00 55%, #006B3F 100%)",
    accentColor: "#CF9C00", accentTextColor: "#000",
    vars: {
      "--brand":       "#006B3F",
      "--brand-light": "#009658",
      "--brand-dim":   "rgba(0,107,63,0.15)",
      "--brand-glow":  "rgba(0,107,63,0.30)",
      "--gold":        "#CF9C00",
      "--gold-light":  "#F0B800",
      "--gold-dim":    "rgba(207,156,0,0.15)",
    },
  },

  "world-cup": {
    id: "world-cup", label: "World Cup", category: "events",
    preview: "🏆", swatchA: "#1a2744", swatchB: "#C9A84C",
    headerGradient: "linear-gradient(160deg, #0d1527 0%, #1a3a7a 55%, #C9A84C 100%)",
    accentColor: "#C9A84C", accentTextColor: "#000",
    vars: {
      "--brand":       "#003DA5",
      "--brand-light": "#1A5DD4",
      "--brand-dim":   "rgba(0,61,165,0.15)",
      "--brand-glow":  "rgba(0,61,165,0.30)",
      "--gold":        "#C9A84C",
      "--gold-light":  "#F0C860",
      "--gold-dim":    "rgba(201,168,76,0.15)",
    },
  },
};

export const DEFAULT_THEME = THEME_CATALOG["dark-gold"];

export const THEME_CATEGORIES: { id: ThemeDefinition["category"]; label: string }[] = [
  { id: "kingdom",   label: "MY KINGDOM" },
  { id: "clubs",     label: "CLUBS" },
  { id: "countries", label: "COUNTRIES" },
  { id: "events",    label: "EVENTS" },
];
