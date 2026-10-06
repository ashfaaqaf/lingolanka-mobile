import * as Haptics from "expo-haptics";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "@/components/glass-card";
import { PressableScale } from "@/components/pressable-scale";
import { SinhalaAudioButton } from "@/components/sinhala-audio-button";
import { Colors, Spacing } from "@/constants/theme";
import { useLearning } from "@/context/learning-context";
import { nativeLessons } from "@/data/curriculum";

export default function LearnScreen() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = Colors[scheme];
  const { completed, completeLesson, direction } = useLearning();
  const [openId, setOpenId] = useState(nativeLessons[0]!.id);
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <SafeAreaView edges={["top"]}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          BEGINNER PATH • 8 USEFUL MODULES
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          {direction === "english-to-sinhala" ? "English → Sinhala" : "සිංහල → English"}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          One clear idea at a time: see it, hear the Sinhala, say it, then use it.
        </Text>
        <View style={styles.list}>
          {nativeLessons.map((lesson, index) => {
            const done = completed.includes(lesson.id);
            const open = openId === lesson.id;
            return (
              <GlassCard
                key={lesson.id}
                style={[styles.lesson, done && { borderColor: colors.success }]}
              >
                <PressableScale
                  onPress={() => setOpenId(open ? "" : lesson.id)}
                  style={styles.lessonHeader}
                >
                  <View
                    style={[
                      styles.number,
                      { backgroundColor: done ? colors.success : colors.backgroundSelected }
                    ]}
                  >
                    <Text style={{ color: done ? "#FFFFFF" : colors.primary, fontWeight: "800" }}>
                      {done ? "✓" : index + 1}
                    </Text>
                  </View>
                  <View style={styles.lessonText}>
                    <Text style={[styles.lessonTitle, { color: colors.text }]}>{lesson.title}</Text>
                    <Text style={[styles.lessonSi, { color: colors.textSecondary }]}>
                      {lesson.titleSi}
                    </Text>
                  </View>
                  <Text style={{ color: colors.textSecondary }}>{lesson.minutes} min</Text>
                </PressableScale>
                {open && (
                  <View style={[styles.practice, { borderTopColor: colors.border }]}>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                      {lesson.description}
                    </Text>
                    <Text style={[styles.word, { color: colors.text }]}>{lesson.word.sinhala}</Text>
                    <Text style={[styles.translation, { color: colors.textSecondary }]}>
                      {lesson.word.transliteration} • {lesson.word.english}
                    </Text>
                    <SinhalaAudioButton text={lesson.word.sinhala} />
                    <Text style={[styles.instruction, { color: colors.text }]}>
                      1. Listen twice. 2. Repeat aloud. 3. Say it without looking.
                    </Text>
                    <PressableScale
                      disabled={done}
                      onPress={async () => {
                        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        await completeLesson(lesson.id);
                      }}
                      style={[
                        styles.complete,
                        { backgroundColor: done ? colors.backgroundSelected : colors.primary }
                      ]}
                    >
                      <Text
                        style={{
                          color: done ? colors.textSecondary : "#FFFFFF",
                          fontWeight: "800"
                        }}
                      >
                        {done ? "Practice saved on this phone" : "I practised this • +20 XP"}
                      </Text>
                    </PressableScale>
                  </View>
                )}
              </GlassCard>
            );
          })}
        </View>
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
  title: { fontSize: 35, lineHeight: 44, fontWeight: "800", marginTop: 8 },
  subtitle: { fontSize: 15, lineHeight: 23, marginTop: 8 },
  list: { gap: 10, marginTop: 24 },
  lesson: { padding: 0, borderRadius: 22 },
  lessonHeader: { minHeight: 78, flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  number: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  lessonText: { flex: 1 },
  lessonTitle: { fontSize: 16, fontWeight: "800" },
  lessonSi: { fontSize: 14, lineHeight: 22, marginTop: 2 },
  practice: { borderTopWidth: StyleSheet.hairlineWidth, padding: 18, gap: 10 },
  description: { fontSize: 14, lineHeight: 21 },
  word: { fontSize: 38, lineHeight: 56, fontWeight: "700" },
  translation: { fontSize: 14 },
  instruction: { fontSize: 13, lineHeight: 20, fontWeight: "600" },
  complete: {
    minHeight: 52,
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    paddingHorizontal: 12
  }
});
