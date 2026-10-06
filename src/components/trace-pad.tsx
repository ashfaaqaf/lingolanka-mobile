import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedProps, useSharedValue } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { PressableScale } from "@/components/pressable-scale";
import { Colors } from "@/constants/theme";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const IDLE_MESSAGE = "Trace over the pale font-rendered letter.";

/** Points closer together than this add nothing visible and just cost path length. */
const MIN_POINT_DISTANCE = 1.5;

export function TracePad({ character }: { character: string }) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = Colors[scheme];

  // Finished strokes live in React state and render once each. The stroke being
  // drawn lives in a shared value and never touches React until the finger
  // lifts, so a touch move costs one UI-thread string append instead of a full
  // re-render plus an SVG path remount.
  const [strokes, setStrokes] = useState<string[]>([]);
  const [message, setMessage] = useState(IDLE_MESSAGE);

  const activePath = useSharedValue("");
  const lastX = useSharedValue(0);
  const lastY = useSharedValue(0);

  const commitStroke = useCallback((d: string) => {
    // A tap with no travel is not a stroke.
    if (d.includes("L")) setStrokes((current) => [...current, d]);
  }, []);

  const draw = Gesture.Pan()
    // Drawing must mark from the moment of contact; any activation threshold
    // would swallow the start of every stroke.
    .minDistance(0)
    .onBegin((event) => {
      activePath.set(`M${event.x.toFixed(1)},${event.y.toFixed(1)}`);
      lastX.set(event.x);
      lastY.set(event.y);
    })
    .onUpdate((event) => {
      const dx = event.x - lastX.get();
      const dy = event.y - lastY.get();
      if (dx * dx + dy * dy < MIN_POINT_DISTANCE * MIN_POINT_DISTANCE) return;
      lastX.set(event.x);
      lastY.set(event.y);
      activePath.set((current) => `${current} L${event.x.toFixed(1)},${event.y.toFixed(1)}`);
    })
    .onFinalize(() => {
      runOnJS(commitStroke)(activePath.get());
      activePath.set("");
    });

  const activeProps = useAnimatedProps(() => ({ d: activePath.get() }));

  const reset = (next: string[]) => {
    setStrokes(next);
    setMessage(IDLE_MESSAGE);
  };

  const check = async () => {
    const completeAttempt = strokes.join("").split("L").length - 1 >= 8;
    await Haptics.notificationAsync(
      completeAttempt
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Warning
    );
    setMessage(
      completeAttempt
        ? "Compare your drawing with the pale letter. A numeric score will return after educator review."
        : "Draw more of the letter before comparing it."
    );
  };

  const ink = {
    stroke: colors.primary,
    strokeWidth: 8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none" as const
  };

  return (
    <View>
      <GestureDetector gesture={draw}>
        <View
          accessibilityLabel={`Tracing area for ${character}`}
          style={[
            styles.pad,
            { backgroundColor: colors.backgroundElement, borderColor: colors.primary }
          ]}
        >
          <Text
            pointerEvents="none"
            accessibilityElementsHidden
            style={[styles.guideGlyph, { color: `${colors.primary}24` }]}
          >
            {character}
          </Text>
          <Svg style={StyleSheet.absoluteFill}>
            {strokes.map((d, index) => (
              // Index is a stable key here: strokes are only ever appended, and
              // undo removes from the end. The previous key embedded the point
              // count, so every point remounted the path.
              <Path key={index} d={d} {...ink} />
            ))}
            <AnimatedPath animatedProps={activeProps} {...ink} />
          </Svg>
        </View>
      </GestureDetector>
      <Text
        accessibilityLiveRegion="polite"
        style={[styles.message, { color: colors.textSecondary }]}
      >
        {message}
      </Text>
      <View style={styles.actions}>
        <PressableScale
          accessibilityRole="button"
          onPress={() => reset(strokes.slice(0, -1))}
          style={[styles.secondary, { borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text }}>Undo</Text>
        </PressableScale>
        <PressableScale
          accessibilityRole="button"
          onPress={() => reset([])}
          style={[styles.secondary, { borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text }}>Clear</Text>
        </PressableScale>
        <PressableScale
          accessibilityRole="button"
          disabled={!strokes.length}
          onPress={check}
          style={[
            styles.primary,
            { backgroundColor: colors.primary, opacity: strokes.length ? 1 : 0.45 }
          ]}
        >
          <Text style={styles.primaryText}>Compare with letter</Text>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    height: 330,
    overflow: "hidden",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 24
  },
  guideGlyph: {
    position: "absolute",
    top: 18,
    left: 0,
    right: 0,
    height: 285,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 205,
    lineHeight: 285,
    fontWeight: "600"
  },
  message: { fontSize: 13, lineHeight: 19, marginTop: 10 },
  actions: { flexDirection: "row", gap: 8, marginTop: 10 },
  secondary: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 16
  },
  primary: {
    minHeight: 48,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16
  },
  primaryText: { color: "#FFFFFF", fontWeight: "800" }
});
