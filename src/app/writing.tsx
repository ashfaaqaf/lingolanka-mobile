import { useState } from "react";
import { ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "@/components/glass-card";
import { PressableScale } from "@/components/pressable-scale";
import { AnimatedWritingGuide } from "@/components/animated-writing-guide";
import { SinhalaAudioButton } from "@/components/sinhala-audio-button";
import { TracePad } from "@/components/trace-pad";
import { Colors, Spacing } from "@/constants/theme";

const letters = [
  { character: "අ", word: "අම්මා" },
  { character: "ආ", word: "ආයුබෝවන්" },
  { character: "ඇ", word: "ඇස" },
  { character: "ඈ", word: "ඈත" },
  { character: "ඉ", word: "ඉර" },
  { character: "ඊ", word: "ඊයේ" },
  { character: "උ", word: "උදය" },
  { character: "ඌ", word: "ඌරා" },
  { character: "එ", word: "එක" },
  { character: "ඒ", word: "ඒක" },
  { character: "ඔ", word: "ඔබ" },
  { character: "ඕ", word: "ඕනෑ" }
];

export default function WritingScreen() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = Colors[scheme];
  const [letterIndex, setLetterIndex] = useState(0);
  const selected = letters[letterIndex]!;
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <SafeAreaView edges={["top"]}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>GUIDED WRITING PRACTICE</Text>
        <Text style={[styles.title, { color: colors.text }]}>
          Study the shape.{`\n`}Then trace it.
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Study the correctly rendered Sinhala letter, notice its curves and open spaces, then trace
          over the pale guide. Numbered stroke order stays hidden until a Sinhala educator approves
          it.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.letterPicker}
        >
          {letters.map((letter, index) => (
            <PressableScale
              key={letter.character}
              onPress={() => setLetterIndex(index)}
              style={[
                styles.letterButton,
                {
                  backgroundColor:
                    index === letterIndex ? colors.primary : colors.backgroundElement,
                  borderColor: colors.border
                }
              ]}
            >
              <Text
                style={[
                  styles.letterButtonText,
                  { color: index === letterIndex ? "#FFFFFF" : colors.text }
                ]}
              >
                {letter.character}
              </Text>
            </PressableScale>
          ))}
        </ScrollView>

        <GlassCard style={styles.referenceCard}>
          <View style={styles.referenceHeader}>
            <View>
              <Text style={[styles.referenceLabel, { color: colors.attention }]}>LETTER SHAPE</Text>
              <Text style={[styles.referenceTitle, { color: colors.text }]}>
                Study {selected.character}
              </Text>
            </View>
            <SinhalaAudioButton text={selected.word} compact />
          </View>
          <AnimatedWritingGuide key={selected.character} character={selected.character} />
          <Text style={[styles.source, { color: colors.textSecondary }]}>
            This is a shape-learning preview, not a claim about pen-stroke order. Exact starts,
            directions and pen lifts will appear only after educator review.
          </Text>
        </GlassCard>

        <GlassCard style={styles.traceCard}>
          <Text style={[styles.traceTitle, { color: colors.text }]}>
            Trace {selected.character}
          </Text>
          <Text style={[styles.traceWord, { color: colors.textSecondary }]}>
            Example: {selected.word}
          </Text>
          <TracePad key={selected.character} character={selected.character} />
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
  title: { fontSize: 37, lineHeight: 43, fontWeight: "800", marginTop: 10 },
  subtitle: { fontSize: 15, lineHeight: 23, marginTop: 10 },
  letterPicker: { gap: 8, paddingVertical: 20 },
  letterButton: {
    width: 52,
    height: 52,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  letterButtonText: { fontSize: 25, fontWeight: "700" },
  referenceCard: { gap: 12 },
  referenceHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12
  },
  referenceLabel: { fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  referenceTitle: { fontSize: 19, fontWeight: "800", marginTop: 4 },
  source: { fontSize: 11, lineHeight: 17 },
  traceCard: { marginTop: 12 },
  traceTitle: { fontSize: 25, fontWeight: "800" },
  traceWord: { fontSize: 14, marginTop: 3, marginBottom: 14 }
});
