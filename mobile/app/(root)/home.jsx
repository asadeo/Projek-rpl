import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { useState, useRef } from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, useWindowDimensions } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
// import { useTransactions } from '../../hooks/useTransactions';
// import { useEffect } from 'react';
// import PageLoader from "../../components/PageLoader";
import { styles } from '../../assets/styles/home.styles.js';

export default function Page() {
  const { user } = useUser();
  const { width } = useWindowDimensions()
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const banners = [
  require('@/assets/images/banner1.png'),
  require('@/assets/images/banner1.png'),
  // tambahkan lagi kalau ada lebih banyak
  ];

  const handleScroll = (event) => {
    const slide = Math.round(
      event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
    )
    setCurrentIndex(slide)
  }
  // const { transactions, summary, isLoading, loadData } = useTransactions(user.id);


  // useEffect(() => {
  //   loadData();
  // }, [loadData]);

  // console.log("userId", user.id);
  // console.log("transactions:", transactions);
  // console.log("summary:", summary);

  // if(isLoading) return <PageLoader />

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SignedIn>
        <ScrollView style={styles.containerHome}>
          {/* Header: user dan sign out */}

          {/* Logo */}
          <View style={styles.headerRow}>
            <Image source={require('@/assets/images/Logo-mahao.png')} style={styles.logoSmall} resizeMode="contain" />
            <View style={styles.headerRightColumn}>
            <Text style={styles.welcome}>Welcome, {user?.emailAddresses[0]?.emailAddress}</Text>
          <SignOutButton />
          </View>
        </View>


          {/* Banner dengan indikator */}
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

            {/* Dot indicator */}
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

          {/* Menu Sections */}
          <MenuItem image={require('@/assets/images/closestGym.png')} title="Closest Gym" />
          <MenuItem image={require('@/assets/images/trainYourself.png')} title="Train Yourself" />
          <MenuItem image={require('@/assets/images/trainWithExpert.png')} title="Train with Expert" />
          <MenuItem image={require('@/assets/images/chatBot.png')} title="Chatbot" />
          <MenuItem image={require('@/assets/images/nutrition.png')} title="Nutrition" />
        </ScrollView>
      </SignedIn>

      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </SafeAreaView>
  );
}

  const MenuItem = ({ image, title }) => (
  <TouchableOpacity style={styles.menuItem}>
    <Image source={image} style={styles.menuImage} />
    <Text style={styles.menuTitle}>{title}</Text>
  </TouchableOpacity>
);
  

