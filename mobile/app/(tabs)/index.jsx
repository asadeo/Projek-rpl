import { useEffect, useState, useRef } from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, useWindowDimensions } from 'react-native';
import { styles } from '../../assets/styles/home.styles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'expo-router';

export default function Page() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState('');
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

  const loadUser = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      router.replace('/(auth)/sign-in');
      return;
    }

    try {
      const decoded = jwt_decode(token);
      setEmail(decoded.email || 'User');
    } catch (err) {
      console.error('Failed to decode token', err);
      setEmail('User');
    }
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/(auth)/sign-in');
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {email ? (
        <ScrollView style={styles.containerHome}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Image source={require('@/assets/images/Logo-mahao.png')} style={styles.logoSmall} resizeMode="contain" />
            <View style={styles.headerRightColumn}>
              <Text style={styles.welcome}>Welcome, {username}</Text>
              <TouchableOpacity onPress={handleSignOut}>
                <Text style={{ color: 'red' }}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Banner */}
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
                    backgroundColor: currentIndex === index ? '#0d1b2a' : '#a0aec0',
                  }}
                />
              ))}
            </View>
          </View>

          {/* Menu Sections */}
        <MenuItem image={require('@/assets/images/closestGym.png')} title="Closest Gym" />
        <MenuItem
          image={require('@/assets/images/trainYourself.png')}
          title="Train Yourself"
          onPress={() => router.push('/training')}
        />
        <MenuItem
          image={require('@/assets/images/trainWithExpert.png')}
          title="Train with Expert"
          onPress={() => router.push('/profile')}
        />
        <MenuItem
          image={require('@/assets/images/chatBot.png')}
          title="Chatbot"
          onPress={() => router.push('/chatbot')}
        />
        <MenuItem
          image={require('@/assets/images/nutrition.png')}
          title="Nutrition"
          onPress={() => router.push('/nutrition')}
        />
        </ScrollView>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const MenuItem = ({ image, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Image source={image} style={styles.menuImage} />
    <Text style={styles.menuTitle}>{title}</Text>
  </TouchableOpacity>
);
