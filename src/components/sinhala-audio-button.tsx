import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { useState } from "react";
import { Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";

import { Colors } from "@/constants/theme";
import ayubowanAudio from "@/../assets/audio/si-1dfe3d4a61e198b2.mp3";
import ammaAudio from "@/../assets/audio/si-4e567e486ca76a8b.mp3";
import asaAudio from "@/../assets/audio/si-2b1268db1b7cd4dd.mp3";
import iyeAudio from "@/../assets/audio/si-7f83479f4cf4c4b8.mp3";
import ekaAudio from "@/../assets/audio/si-8aef883104388cf2.mp3";
import kohomadaAudio from "@/../assets/audio/si-84a7ecbabb9be7e5.mp3";
import gamaAudio from "@/../assets/audio/si-1d1d3ea439ed0d22.mp3";
import vaturaAudio from "@/../assets/audio/si-03cdddde1da96f21.mp3";
import stutiyiAudio from "@/../assets/audio/si-47c79ff5201ab6fc.mp3";

const SINHALA_SCRIPT = /[\u0D80-\u0DFF]/u;
const audioSources: Record<string, number> = {
  ආයුබෝවන්: ayubowanAudio,
  අම්මා: ammaAudio,
  ඇස: asaAudio,
  ඊයේ: iyeAudio,
  එක: ekaAudio,
  "කොහොමද?": kohomadaAudio,
  ගම: gamaAudio,
  වතුර: vaturaAudio,
  ස්තුතියි: stutiyiAudio
};

export function SinhalaAudioButton({ text, compact = false }: { text: string; compact?: boolean }) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = Colors[scheme];
  const source = audioSources[text];
  const player = useAudioPlayer(source);
  const [status, setStatus] = useState<"ready" | "playing" | "unavailable">("ready");

  const play = async () => {
    if (!SINHALA_SCRIPT.test(text)) {
      setStatus("unavailable");
      return;
    }
    await Haptics.selectionAsync();
    setStatus("playing");
    if (source) {
      await player.seekTo(0);
      player.play();
      setTimeout(() => setStatus("ready"), 1400);
      return;
    }
    Speech.stop();
    Speech.speak(text, {
      language: "si-LK",
      rate: 0.76,
      pitch: 1,
      onDone: () => setStatus("ready"),
      onError: () => setStatus("unavailable")
    });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Hear the Sinhala word ${text}`}
      onPress={play}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compact,
        { backgroundColor: colors.primary },
        pressed && styles.pressed
      ]}
    >
      <Text style={styles.play}>▶</Text>
      {!compact && (
        <View>
          <Text style={styles.label}>Hear Sinhala</Text>
          <Text style={styles.status}>
            {status === "playing"
              ? "Playing…"
              : status === "unavailable"
                ? "Voice unavailable"
                : text}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  compact: { width: 52, paddingHorizontal: 0, justifyContent: "center" },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
  play: { color: "#FFFFFF", fontSize: 17 },
  label: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  status: { color: "#E9FBFA", fontSize: 11, marginTop: 1 }
});
