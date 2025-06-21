import SafeScreen from "../components/SafeScreen";
import { Slot, Redirect, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PageLoader from "../components/PageLoader";
import * as NavigationBar from 'expo-navigation-bar';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem("hasSeenOnboarding");
      console.log("HAS SEEN ONBOARDING:", seen);
      setHasSeenOnboarding(seen === "true");
      setLoading(false);
    };
    checkOnboarding();
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  if (!hasSeenOnboarding && pathname === "/") {
    return <Redirect href="/onboarding" />;
  }

  return (
    <SafeScreen>
      <Slot />
    </SafeScreen>
  );
}
