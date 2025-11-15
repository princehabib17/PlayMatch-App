const theme = {
  colors: {
    // Core colors - GOLD RESERVED FOR PRIMARY ACTIONS ONLY
    primary: "#D4AF37", // metallic gold - USE SPARINGLY
    primaryHover: "#F7E68D", // soft gold hover
    secondary: "#3B82F6", // blue for secondary actions
    background: "#000000", // matte black

    // Text colors - IMPROVED CONTRAST
    text: "#FFFFFF", // primary text (white)
    textSecondary: "#E0E0E0", // secondary text (was #B5B5B5 - too low contrast)
    textMuted: "#A0A0A0", // muted text (was #888888 - too low contrast)

    // Status colors
    error: "#FF4D4D",
    success: "#43FF86",
    warning: "#FFB800",
    info: "#3B82F6",

    // Surface colors
    card: "#0A0A0A", // slightly lighter than pure black for depth
    cardElevated: "#141414", // for elevated cards
    surface: "#111111", // general surfaces
    elevated: "#1A1A1A",

    // Borders - SUBTLE, NOT GOLD
    border: "rgba(255,255,255,0.08)", // subtle white border (was gold)
    borderLight: "rgba(255,255,255,0.04)",
    borderActive: "rgba(212,175,55,0.3)", // gold only when active
    borderFocus: "rgba(212,175,55,0.5)", // gold only when focused

    // Glows and accents
    glow: "rgba(212,175,55,0.12)",
    glowActive: "rgba(212,175,55,0.25)",

    // Navigation
    tabBackground: "#000000",
    tabActive: "#D4AF37",
    tabInactive: "#888888", // darker when inactive
  },

  // Typography - clear hierarchy
  typography: {
    h1Display: { fontSize: 40, lineHeight: 48, letterSpacing: -0.6 }, // hero moments
    h1: { fontSize: 34, lineHeight: 40, letterSpacing: -0.4 },
    h2: { fontSize: 24, lineHeight: 30, letterSpacing: -0.26 },
    h3: { fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
    bodyLarge: { fontSize: 17, lineHeight: 24, letterSpacing: 0 }, // important info
    body: { fontSize: 15, lineHeight: 22, letterSpacing: 0.02 },
    bodySmall: { fontSize: 13, lineHeight: 18, letterSpacing: 0.04 }, // secondary info
    caption: { fontSize: 12, lineHeight: 16, letterSpacing: 0.16 },
  },

  // Spacing (8pt grid system, tuned for more breathing room)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // Border radius - softer cards and controls
  radius: {
    xs: 4,
    sm: 8,
    md: 12, // reduced from 14
    lg: 16, // reduced from 20
    xl: 24, // reduced from 28
    round: 999,
  },

  // Component dimensions
  components: {
    buttonHeight: 52,
    buttonHeightSmall: 44,
    cardPadding: 16,
    cardMargin: 16, // increased from 12
    screenPadding: 20,
    iconSize: 24,
    iconSizeSmall: 20,
  },
};

export const useTheme = () => {
  return {
    ...theme,
    statusBarStyle: "light",
  };
};

export default theme;
