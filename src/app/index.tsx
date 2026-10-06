import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "@/components/glass-card";
import { SinhalaAudioButton } from "@/components/sinhala-audio-button";
import { Colors, Spacing } from "@/constants/theme";
import { useLearning } from "@/context/learning-context";
import { nativeLessons } from "@/data/curriculum";

export default function TodayScreen() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = Colors[scheme];
  const { completed, xp } = useLearning();
  const lesson = nativeLessons.find((item) => !completed.includes(item.id)) ?? nativeLessons[0]!;
  const percent = Math.round((completed.length / nativeLessons.length) * 100);
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <SafeAreaView edges={["top"]}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          PRIVATE • FREE • OFFLINE-FRIENDLY
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          Learn a little.{`\n`}Use it today.
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Practical Sinhala and English lessons made for complete beginners.
        </Text>

        <GlassCard style={styles.hero}>
          <View style={styles.rowBetween}>
            <View style={styles.heroText}>
              <Text style={[styles.kicker, { color: colors.attention }]}>
                TODAY&apos;S 7-MINUTE STEP
              </Text>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{lesson.title}</Text>
              <Text style={[styles.sinhala, { color: colors.text }]}>{lesson.word.sinhala}</Text>
              <Text style={[styles.body, { color: colors.textSecondary }]}>
                {lesson.word.transliteration} • {lesson.word.english}
              </Text>
            </View>
            <SinhalaAudioButton text={lesson.word.sinhala} compact />
          </View>
          <Pressable
            onPress={() => router.push("/learn")}
            style={({ pressed }) => [
              styles.primary,
              { backgroundColor: colors.primary },
              pressed && styles.pressed
            ]}
          >
            <Text style={styles.primaryText}>
              {completed.length ? "Continue learning" : "Start from the beginning"} →
            </Text>
          </Pressable>
        </GlassCard>

        <View style={styles.metrics}>
          <GlassCard style={styles.metric}>
            <Text style={[styles.metricValue, { color: colors.text }]}>{percent}%</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>course</Text>
          </GlassCard>
          <GlassCard style={styles.metric}>
            <Text style={[styles.metricValue, { color: colors.text }]}>{xp}</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>XP saved</Text>
          </GlassCard>
          <GlassCard style={styles.metric}>
            <Text style={[styles.metricValue, { color: colors.text }]}>{completed.length}</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>lessons</Text>
          </GlassCard>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Built for real life</Text>
        <GlassCard style={styles.benefits}>
          {[
            "Hear the actual Sinhala-script word—not the English label.",
            "Keep progress on this phone without creating an account.",
            "Practise reading, listening and writing in short steps."
          ].map((item, index) => (
            <View style={styles.benefit} key={item}>
              <Text
                style={[styles.bullet, { color: index === 1 ? colors.attention : colors.primary }]}
              >
                ●
              </Text>
              <Text style={[styles.body, { color: colors.text }]}>{item}</Text>
            </View>
          ))}
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
  eyebrow: { fontSize: 11, fontWeight: "900", letterSpacing: 1.2, marginTop: 18 },
  title: { fontSize: 42, lineHeight: 46, fontWeight: "800", marginTop: 12 },
  subtitle: { fontSize: 16, lineHeight: 24, marginTop: 12, maxWidth: 520 },
  hero: { marginTop: 26, gap: 18 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12
  },
  heroText: { flex: 1 },
  kicker: { fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  cardTitle: { fontSize: 25, lineHeight: 31, fontWeight: "800", marginTop: 8 },
  sinhala: { fontSize: 35, lineHeight: 52, fontWeight: "700", marginTop: 10 },
  body: { fontSize: 15, lineHeight: 22 },
  primary: { minHeight: 54, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  primaryText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  pressed: { transform: [{ scale: 0.985 }], opacity: 0.92 },
  metrics: { flexDirection: "row", gap: 10, marginTop: 12 },
  metric: { flex: 1, padding: 14, alignItems: "center", borderRadius: 18 },
  metricValue: { fontSize: 23, fontWeight: "800" },
  metricLabel: { fontSize: 11, marginTop: 2 },
  sectionTitle: { fontSize: 23, fontWeight: "800", marginTop: 30, marginBottom: 12 },
  benefits: { gap: 14 },
  benefit: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  bullet: { fontSize: 12, marginTop: 4 }
});
