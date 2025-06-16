import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';

export default function TabLayout() {

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden"); // Sembunyikan nav bar Android
  }, []);

  return (
    <>
      <StatusBar style="light" hidden />
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case 'index':
                iconName = 'home';
                break;
              case 'nutrition':
                iconName = 'fast-food';
                break;
              case 'chatbot':
                iconName = 'chatbubble-ellipses';
                break;
              case 'profile':
                iconName = 'person';
                break;
              default:
                iconName = 'apps';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0d1b2a',
          tabBarInactiveTintColor: '#a0aec0',
          tabBarStyle: {
            backgroundColor: '#fff',
            height: 60,
            paddingBottom: 8,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          headerShown: false,
        })}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="nutrition" />
        <Tabs.Screen name="chatbot" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </>
  );
}
