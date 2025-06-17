import { useEffect, useState, useRef } from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, useWindowDimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../../assets/styles/home.styles.js';

export default function Page() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const banners = [
    require('@/assets/images/banner1.png'),
    require('@/assets/images/banner1.png'),
  ];

  const handleScroll = (event) => {
    const slide = Math.round(
      event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
    );
    setCurrentIndex(slide);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/(auth)/sign-in');
        return;
      }

      try {
        // Panggil API untuk ambil data user berdasarkan token
        const response = await fetch('http://192.168.0.143:3000/auth/login', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unauthorized');
        }

        setUserEmail(data.email);
      } catch (err) {
        console.error(err);
        await AsyncStorage.removeItem('token');
        router.replace('/(auth)/sign-in');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('token');
    Alert.alert("Logged out", "You have been signed out.");
    router.replace('/(auth)/sign-in');
  };

  if (loading) return null; // Bisa ganti dengan <ActivityIndicator />

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.containerHome}>
        <View style={styles.headerRow}>
          <Image source={require('@/assets/images/Logo-mahao.png')} style={styles.logoSmall} resizeMode="contain" />
          <View style={styles.headerRightColumn}>
            <Text style={styles.welcome}>Welcome, {userEmail}</Text>
            <TouchableOpacity onPress={handleSignOut}>
              <Text style={{ color: 'red', fontWeight: 'bold' }}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.bannerContainer}
          >
            {banners.map((image, index) => (
              <Image
                key={index}
                source={image}
                style={[styles.banner, { width: width - 10 }]}
              />
            ))}
          </ScrollView>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5, marginBottom: 5 }}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: 5,
                  marginHorizontal: 5,
                  backgroundColor: currentIndex === index ? '#0d1b2a' : '#a0aec0'
                }}
              />
            ))}
          </View>
        </View>

        <MenuItem image={require('@/assets/images/closestGym.png')} title="Closest Gym" />
        <MenuItem image={require('@/assets/images/trainYourself.png')} title="Train Yourself" />
        <MenuItem image={require('@/assets/images/trainWithExpert.png')} title="Train with Expert" />
        <MenuItem image={require('@/assets/images/chatBot.png')} title="Chatbot" />
        <MenuItem image={require('@/assets/images/nutrition.png')} title="Nutrition" />
      </ScrollView>
    </SafeAreaView>
  );
}

const MenuItem = ({ image, title }) => (
  <TouchableOpacity style={styles.menuItem}>
    <Image source={image} style={styles.menuImage} />
    <Text style={styles.menuTitle}>{title}</Text>
  </TouchableOpacity>
);
