import { Alert, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PressableScale } from "@/components/pressable-scale";
import { GlassCard } from "@/components/glass-card";
import { Colors, Spacing } from "@/constants/theme";
import { useLearning } from "@/context/learning-context";

export default function SettingsScreen() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = Colors[scheme];
  const { direction, setDirection, completed, xp, reset } = useLearning();
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <SafeAreaView edges={["top"]}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR LEARNING, YOUR DEVICE</Text>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          No account, advertising or tracking. Your progress stays on this phone.
        </Text>

        <Text style={[styles.section, { color: colors.text }]}>Learning direction</Text>
        <GlassCard style={styles.card}>
          {(
            [
              ["english-to-sinhala", "I understand English", "Learn Sinhala • සිංහල ඉගෙනගන්න"],
              ["sinhala-to-english", "මට සිංහල තේරෙනවා", "ඉංග්‍රීසි ඉගෙනගන්න • Learn English"]
            ] as const
          ).map(([value, title, detail]) => (
            <PressableScale
              key={value}
              onPress={() => setDirection(value)}
              style={[
                styles.option,
                {
                  borderColor: direction === value ? colors.primary : colors.border,
                  backgroundColor: direction === value ? colors.backgroundSelected : "transparent"
                }
              ]}
            >
              <Text style={[styles.optionTitle, { color: colors.text }]}>{title}</Text>
              <Text style={[styles.optionDetail, { color: colors.textSecondary }]}>{detail}</Text>
            </PressableScale>
          ))}
        </GlassCard>

        <Text style={[styles.section, { color: colors.text }]}>Saved on this phone</Text>
        <GlassCard style={styles.card}>
          <View style={styles.stats}>
            <Text style={[styles.stat, { color: colors.text }]}>{completed.length} lessons</Text>
            <Text style={[styles.stat, { color: colors.text }]}>{xp} XP</Text>
          </View>
          <Text style={[styles.privacy, { color: colors.textSecondary }]}>
            Audio practice is played locally. Voice recordings are not uploaded or permanently
            stored.
          </Text>
          <PressableScale
            onPress={() =>
              Alert.alert(
                "Reset all progress?",
                "This removes completed lessons and XP from this phone. It cannot be undone.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Reset", style: "destructive", onPress: reset }
                ]
              )
            }
            style={[styles.reset, { borderColor: colors.error }]}
          >
            <Text style={{ color: colors.error, fontWeight: "800" }}>Reset all progress</Text>
          </PressableScale>
        </GlassCard>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.three,
    paddingBottom: 130,
    maxWidth: 760,
    width: "100%",
    alignSelf: "center"
  },
  eyebrow: { fontSize: 11, fontWeight: "900", letterSpacing: 1.1, marginTop: 18 },
  title: { fontSize: 38, fontWeight: "800", marginTop: 10 },
  subtitle: { fontSize: 15, lineHeight: 23, marginTop: 8 },
  section: { fontSize: 21, fontWeight: "800", marginTop: 28, marginBottom: 10 },
  card: { gap: 10 },
  option: { padding: 15, borderWidth: 1.5, borderRadius: 18 },
  optionTitle: { fontSize: 16, fontWeight: "800" },
  optionDetail: { fontSize: 13, marginTop: 4 },
  stats: { flexDirection: "row", justifyContent: "space-between" },
  stat: { fontSize: 20, fontWeight: "800" },
  privacy: { fontSize: 13, lineHeight: 20, marginVertical: 6 },
  reset: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 17
  }
});
