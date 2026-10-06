import {
  Tabs,
  TabList,
  TabSlot,
  TabTrigger,
  type TabListProps,
  type TabTriggerSlotProps
} from "expo-router/ui";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: "100%" }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="today" href="/" asChild>
            <TabButton>Today</TabButton>
          </TabTrigger>
          <TabTrigger name="learn" href="/learn" asChild>
            <TabButton>Learn</TabButton>
          </TabTrigger>
          <TabTrigger name="writing" href="/writing" asChild>
            <TabButton>Write</TabButton>
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton>Settings</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? "backgroundSelected" : "backgroundElement"}
        style={styles.tabButton}
      >
        <ThemedText type="smallBold" themeColor={isFocused ? "primary" : "textSecondary"}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.list}>
      <ThemedView type="backgroundElement" style={styles.inner}>
        <ThemedText type="smallBold" style={styles.brand}>
          LingoLanka
        </ThemedText>
        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { position: "absolute", width: "100%", padding: Spacing.three, alignItems: "center" },
  inner: {
    width: "100%",
    maxWidth: MaxContentWidth,
    padding: Spacing.two,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  brand: { marginRight: "auto", paddingHorizontal: 12 },
  tabButton: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: 15 },
  pressed: { opacity: 0.72 }
});
