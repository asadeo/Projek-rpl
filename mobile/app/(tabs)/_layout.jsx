import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync('dark');
    }
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {

            if (route.name === 'training') {
              return <MaterialCommunityIcons name="dumbbell" size={24} color={color} />; 
            } else {
              let iconName;
              switch (route.name) {
                case 'index': iconName = 'home-outline'; break;
                case 'nutrition': iconName = 'fast-food-outline'; break;
                case 'chatbot': iconName = 'chatbubbles-outline'; break;
                case 'trainer': iconName = 'person-outline'; break;
                default: iconName = 'apps-outline';
              }
              return <Ionicons name={iconName} size={24} color={color} />; 
            }
          },

          tabBarShowLabel: true,
          tabBarActiveTintColor: '#123459',      
          tabBarInactiveTintColor: '#a0aec0',  
          
          tabBarStyle: {
            backgroundColor: '#fff',
            height: 65 + insets.bottom, 
            paddingTop: 8, 
            paddingBottom: 5 + insets.bottom, 
            borderTopWidth: 1, 
            borderTopColor: '#f0f0f0', 
          },
          headerShown: false,
        })}
      >
        {/* MODIFIKASI 3: Gunakan 'tabBarLabel' untuk mengatur teks */}
        <Tabs.Screen name="index" options={{ tabBarLabel: 'Home' }} />
        <Tabs.Screen name="training" options={{ tabBarLabel: 'Training' }} />
        <Tabs.Screen name="nutrition" options={{ tabBarLabel: 'Nutrition' }} />
        <Tabs.Screen name="chatbot" options={{ tabBarLabel: 'Chatbot' }} />
        <Tabs.Screen name="trainer" options={{ tabBarLabel: 'Trainer' }} />
      </Tabs>
    </>
  );
}