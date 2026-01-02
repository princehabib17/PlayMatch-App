const theme = {
  colors: {
    // Core colors - STREET COURT VOLTAGE
    primary: "#CCFF00", // electric volt green
    primaryDark: "#9FCC00", // darker volt
    secondary: "#00F0FF", // neon cyan
    background: "#0A0A0A", // deep charcoal black
    backgroundElevated: "#121212", // slightly elevated black

    // Text colors
    text: "#FFFFFF", // pure white
    textSecondary: "#A8A8A8", // concrete gray
    textMuted: "#666666", // dark gray
    textBlack: "#0A0A0A", // for text on bright backgrounds

    // Status colors
    error: "#FF3366",
    success: "#00FF88",
    warning: "#FFAA00",

    // Surface colors
    card: "#141414", // dark card
    cardElevated: "#1A1A1A", // elevated card
    border: "rgba(204,255,0,0.15)", // volt border
    borderSubtle: "rgba(255,255,255,0.08)", // subtle white border

    // Glow effects
    glowPrimary: "rgba(204,255,0,0.25)", // volt glow
    glowSecondary: "rgba(0,240,255,0.2)", // cyan glow
    glowStrong: "rgba(204,255,0,0.4)", // strong volt glow

    // Gradient overlays
    gradientDark: "rgba(10,10,10,0.92)",
    gradientMid: "rgba(10,10,10,0.7)",

    // Navigation
    tabBackground: "#0A0A0A",
    tabActive: "#CCFF00",
    tabInactive: "#666666",
  },

  // Typography - ATHLETIC BRUTALISM
  typography: {
    // Ultra-condensed athletic display (Teko style)
    display: { fontSize: 56, lineHeight: 58, letterSpacing: 1.5, textTransform: 'uppercase' },
    h1: { fontSize: 42, lineHeight: 46, letterSpacing: 1.2, textTransform: 'uppercase' },
    h2: { fontSize: 32, lineHeight: 36, letterSpacing: 1, textTransform: 'uppercase' },
    h3: { fontSize: 24, lineHeight: 28, letterSpacing: 0.8, textTransform: 'uppercase' },
    h4: { fontSize: 18, lineHeight: 22, letterSpacing: 0.6 },

    // Clean body text (Barlow/DM Sans style)
    body: { fontSize: 16, lineHeight: 24, letterSpacing: 0.3 },
    bodySmall: { fontSize: 14, lineHeight: 20, letterSpacing: 0.2 },
    caption: { fontSize: 12, lineHeight: 16, letterSpacing: 0.8, textTransform: 'uppercase' },
    captionSmall: { fontSize: 10, lineHeight: 14, letterSpacing: 1 },
  },

  // Spacing (8pt grid system)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // Border radius - Sharp and angular
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },

  // Shadows and glows
  shadows: {
    glow: {
      shadowColor: "#CCFF00",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    glowStrong: {
      shadowColor: "#CCFF00",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 20,
      elevation: 12,
    },
    subtle: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
  },

  // Component dimensions
  components: {
    buttonHeight: 56,
    buttonHeightSmall: 44,
    cardPadding: 20,
    cardMargin: 12,
    screenPadding: 20,
    iconSize: 24,
    iconSizeLarge: 32,
  },

  // Animations
  animations: {
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
};

export const useTheme = () => {
  return {
    ...theme,
    statusBarStyle: "light",
  };
};

export default theme;
