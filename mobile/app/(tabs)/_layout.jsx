import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';

export default function TabLayout() {

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden")
    ;
  }, []);

  return (
    <>
      <StatusBar style="light" hidden />
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            // Gunakan icon dari library berbeda berdasarkan nama rute
            if (route.name === 'training') {
              return (
                <MaterialCommunityIcons name="dumbbell" size={size} color={color} />
              );
            } else {
              let iconName;
              switch (route.name) {
                case 'index':
                  iconName = 'home';
                  break;
                case 'nutrition':
                  iconName = 'fast-food';
                  break;
                case 'chatbot':
                  iconName = 'chatbubbles';
                  break;
                case 'profile':
                  iconName = 'person';
                  break;
                default:
                  iconName = 'apps';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            }
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
        <Tabs.Screen name="training" />
        <Tabs.Screen name="nutrition" />
        <Tabs.Screen name="chatbot" />
        <Tabs.Screen name="profile" options={{ title: 'Trainer' }} />
      </Tabs>
    </>
  );
}
