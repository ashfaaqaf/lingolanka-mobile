import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

import AppTabs from "@/components/app-tabs";
import { LearningProvider } from "@/context/learning-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  return (
    // GestureHandlerRootView must wrap everything that uses a GestureDetector,
    // and must fill the screen or gestures inside it silently never fire.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LearningProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <AppTabs />
        </ThemeProvider>
      </LearningProvider>
    </GestureHandlerRootView>
  );
}
