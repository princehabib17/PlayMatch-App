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

  // Typography
  typography: {
    h1: { fontSize: 32, lineHeight: 38, letterSpacing: -0.32 },
    h2: { fontSize: 24, lineHeight: 31, letterSpacing: -0.24 },
    h3: { fontSize: 20, lineHeight: 28, letterSpacing: -0.2 },
    body: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
    caption: { fontSize: 12, lineHeight: 18, letterSpacing: 0.12 },
  },

  // Spacing (8pt grid system)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 999,
  },

  // Component dimensions
  components: {
    buttonHeight: 48,
    cardPadding: 12,
    cardMargin: 8,
    screenPadding: 16,
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
