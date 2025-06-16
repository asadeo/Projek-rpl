import React, { useEffect, useState } from 'react';
import { Redirect, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthRoutesLayout() {
  const [isSignedIn, setIsSignedIn] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsSignedIn(!!token);
    };
    checkAuth();
  }, []);

  if (isSignedIn === null) return null; // Atau loading indicator

  if (isSignedIn) {
    return <Redirect href={'/(tabs)/'} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
