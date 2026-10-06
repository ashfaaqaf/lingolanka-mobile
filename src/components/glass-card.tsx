import { GlassView } from "expo-glass-effect";
import { StyleSheet, useColorScheme, type ViewProps } from "react-native";

import { Colors } from "@/constants/theme";

export function GlassCard({ style, ...props }: ViewProps) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  return (
    <GlassView
      {...props}
      colorScheme={scheme}
      glassEffectStyle="regular"
      tintColor={Colors[scheme].backgroundElement}
      style={[styles.card, { borderColor: Colors[scheme].border }, style]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 24,
    padding: 20
  }
});
