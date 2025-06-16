import SafeScreen from "../components/SafeScreen";
import { View, Text } from "react-native";
import { ClerkProvider } from '@clerk/clerk-expo';
import { usePathname, Slot, Redirect } from 'expo-router';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PageLoader from "../components/PageLoader";

export default function RootLayout() {

  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem('hasSeenOnboarding');
          console.log('HAS SEEN ONBOARDING:', seen);
      setHasSeenOnboarding(seen === "true");
      setLoading(false);
    };
    checkOnboarding();
  }, []);

  if (loading) {
    return (
      <PageLoader />
    );
  }


  if (!hasSeenOnboarding && pathname === '/') {
    return <Redirect href="/onboarding" />;
  }

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  );
}
