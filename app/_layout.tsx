import { SplashScreen, Tabs } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { TamaguiProvider, Theme } from "tamagui";
import appConfig from "../tamagui.config";
import { TamaguiSafeAreaView } from "../components/TamaguiSafeAreaView";
import { Calendar, Home, Settings } from "@tamagui/lucide-icons";
import { useColorScheme } from "react-native";
import "@tamagui/core/reset.css";
import {
  DefaultTheme,
  DarkTheme,
  ThemeProvider,
} from "@react-navigation/native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={appConfig}>
      <Theme name={colorScheme}>
        <ThemeProvider
          value={colorScheme === "light" ? DefaultTheme : DarkTheme}
        >
          <TamaguiSafeAreaView>
            <Tabs>
              <Tabs.Screen
                name="index"
                options={{
                  href: "/",
                  headerShown: false,
                  title: "Home",
                  tabBarIcon: ({ focused }) => (
                    <Home color={focused ? "$blue10" : "$gray10"} />
                  ),
                }}
              />
              <Tabs.Screen
                name="[...missing]"
                options={{ href: null, headerShown: false }}
              />
              <Tabs.Screen
                name="schedule"
                options={{
                  href: "/schedule",
                  headerShown: false,
                  title: "Schedule",
                  tabBarIcon: ({ focused }) => (
                    <Calendar color={focused ? "$blue10" : "$gray10"} />
                  ),
                }}
              />
              <Tabs.Screen
                name="settings"
                options={{
                  href: "/settings",
                  headerShown: false,
                  title: "Settings",
                  tabBarIcon: ({ focused }) => (
                    <Settings color={focused ? "$blue10" : "$gray10"} />
                  ),
                }}
              />
            </Tabs>
          </TamaguiSafeAreaView>
        </ThemeProvider>
      </Theme>
    </TamaguiProvider>
  );
}
