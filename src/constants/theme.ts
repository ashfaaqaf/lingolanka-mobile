import { Platform } from "react-native";

export const Palette = {
  ivory: "#FFF9F0",
  paper: "#FFFEFA",
  teal: "#226E78",
  tealBright: "#2F8290",
  tealDeep: "#164B57",
  mist: "#E3F1EF",
  amber: "#E7A63A",
  sky: "#3B8FB8",
  coral: "#D56D5C",
  success: "#2F765B",
  ink: "#18323A",
  muted: "#5E7074",
  line: "#D8E4E1"
} as const;

export const Colors = {
  light: {
    text: Palette.ink,
    background: Palette.ivory,
    backgroundElement: Palette.paper,
    backgroundSelected: Palette.mist,
    textSecondary: Palette.muted,
    primary: Palette.teal,
    border: Palette.line,
    attention: Palette.amber,
    success: Palette.success,
    error: "#B64343"
  },
  dark: {
    text: "#F8F1E7",
    background: "#0E1D23",
    backgroundElement: "#162A30",
    backgroundSelected: "#203A41",
    textSecondary: "#B7C7C4",
    primary: "#94D0D4",
    border: "#31525A",
    attention: "#F3C265",
    success: "#86C8A5",
    error: "#FF9B8C"
  }
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: { sans: "system-ui", serif: "ui-serif", rounded: "ui-rounded", mono: "ui-monospace" },
  default: { sans: "normal", serif: "serif", rounded: "normal", mono: "monospace" },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)"
  }
});

export const Spacing = { half: 2, one: 4, two: 8, three: 16, four: 24, five: 32, six: 48 } as const;
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
