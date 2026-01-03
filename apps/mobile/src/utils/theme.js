const theme = {
  colors: {
    // Core colors
    primary: "#D4AF37", // metallic gold
    primaryHover: "#F7E68D", // soft gold hover
    secondary: "#111111", // carbon black
    background: "#000000", // matte black

    // Text colors
    text: "#FFFFFF", // primary text
    textSecondary: "#B5B5B5", // secondary text
    textMuted: "#888888",

    // Status colors
    error: "#FF4D4D",
    success: "#43FF86",
    warning: "#FFB800",

    // Surface colors
    card: "#111111",
    elevated: "#1A1A1A",
    border: "rgba(212,175,55,0.2)",
    glow: "rgba(212,175,55,0.12)",

    // Navigation
    tabBackground: "#000000",
    tabActive: "#D4AF37",
    tabInactive: "#B5B5B5",
  },

  // Typography - slightly more athletic and airy
  typography: {
    h1: { fontSize: 34, lineHeight: 40, letterSpacing: -0.4 },
    h2: { fontSize: 24, lineHeight: 30, letterSpacing: -0.26 },
    h3: { fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
    body: { fontSize: 15, lineHeight: 22, letterSpacing: 0.02 },
    caption: { fontSize: 12, lineHeight: 16, letterSpacing: 0.16 },
  },

  // Spacing (8pt grid system, tuned for more breathing room)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 56,
  },

  // Border radius - softer cards and controls
  radius: {
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
    round: 999,
  },

  // Component dimensions
  components: {
    buttonHeight: 52,
    cardPadding: 16,
    cardMargin: 12,
    screenPadding: 20,
    iconSize: 24,
  },
};

export const useTheme = () => {
  return {
    ...theme,
    statusBarStyle: "light",
  };
};

export default theme;
