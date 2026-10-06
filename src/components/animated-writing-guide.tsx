import { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";

import { Colors } from "@/constants/theme";

function LetterShapeReveal({
  character,
  replayKey,
  slow,
  reduceMotion,
  color
}: {
  character: string;
  replayKey: number;
  slow: boolean;
  reduceMotion: boolean;
  color: string;
}) {
  const [progress] = useState(() => new Animated.Value(reduceMotion ? 1 : 0));

  useEffect(() => {
    progress.stopAnimation();
    progress.setValue(reduceMotion ? 1 : 0);
    if (reduceMotion) return;
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: slow ? 4200 : 2600,
      useNativeDriver: true
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reduceMotion, replayKey, slow]);

  return (
    <Animated.Text
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.revealedGlyph,
        {
          color,
          opacity: progress,
          transform: [
            { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }
          ]
        }
      ]}
    >
      {character}
    </Animated.Text>
  );
}

export function AnimatedWritingGuide({ character }: { character: string }) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = Colors[scheme];
  const [replayKey, setReplayKey] = useState(0);
  const [slow, setSlow] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReduceMotion(enabled);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <View>
      <View
        style={[
          styles.stage,
          { backgroundColor: colors.backgroundElement, borderColor: colors.border }
        ]}
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Animated, font-rendered letter-shape preview for ${character}. Stroke order is awaiting educator review.`}
      >
        <Svg viewBox="0 0 320 320" width="100%" height="100%">
          <Path
            d="M32 160 H288 M160 32 V288"
            fill="none"
            stroke={`${colors.primary}22`}
            strokeWidth={1}
            strokeDasharray={[5, 8]}
          />
          <SvgText
            x={160}
            y={225}
            textAnchor="middle"
            fill={`${colors.primary}12`}
            stroke={`${colors.primary}1A`}
            strokeWidth={1}
            fontSize={205}
            fontWeight="600"
          >
            {character}
          </SvgText>
        </Svg>
        <LetterShapeReveal
          character={character}
          replayKey={replayKey}
          slow={slow}
          reduceMotion={reduceMotion}
          color={colors.primary}
        />
        <View
          style={[
            styles.chip,
            { backgroundColor: `${colors.background}E8`, borderColor: colors.border }
          ]}
        >
          <Text style={[styles.chipText, { color: colors.primary }]}>Reference letter shape</Text>
        </View>
      </View>
      <Text style={[styles.help, { color: colors.textSecondary }]}>
        Study the curves, joins and open spaces. Exact stroke order will appear only after a Sinhala
        educator verifies it.
      </Text>
      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Replay writing animation"
          onPress={() => setReplayKey((value) => value + 1)}
          style={({ pressed }) => [
            styles.control,
            {
              borderColor: colors.border,
              backgroundColor: pressed ? colors.backgroundSelected : colors.backgroundElement
            }
          ]}
        >
          <Text style={[styles.controlText, { color: colors.text }]}>↻ Replay</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: slow }}
          onPress={() => {
            setSlow((value) => !value);
            setReplayKey((value) => value + 1);
          }}
          style={({ pressed }) => [
            styles.control,
            {
              borderColor: colors.border,
              backgroundColor:
                pressed || slow ? colors.backgroundSelected : colors.backgroundElement
            }
          ]}
        >
          <Text style={[styles.controlText, { color: colors.text }]}>
            {slow ? "Normal speed" : "Slow it down"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { height: 330, overflow: "hidden", borderWidth: 1, borderRadius: 24 },
  revealedGlyph: {
    position: "absolute",
    inset: 0,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 205,
    fontWeight: "600",
    lineHeight: 300
  },
  chip: {
    position: "absolute",
    right: 12,
    bottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderRadius: 999
  },
  chipText: { fontSize: 11, fontWeight: "900" },
  help: { fontSize: 12, lineHeight: 18, marginTop: 10 },
  controls: { flexDirection: "row", gap: 8, marginTop: 12 },
  control: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 16
  },
  controlText: { fontSize: 13, fontWeight: "800" }
});
