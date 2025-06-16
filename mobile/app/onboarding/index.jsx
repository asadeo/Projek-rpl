import { ImageBackground, View, Text, TouchableOpacity,Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from "@/assets/styles/auth.styles.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen() {
  const router = useRouter();

  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true'); 
      router.push('/onboarding/page2');
    } catch (e) {
      console.error('Error saving onboarding status:', e);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        source={require('@/assets/images/BackgroundImage.png')} 
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.containerBoarding}>
          <Image
            source={require('../../assets/images/Logo-mahao.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.contentBox}>
            <Text style={styles.titleBoarding}>Start Your Fitness Journey</Text>
            <Text style={styles.description}>
              Unlock your strength and transform your body with personalized training plans.
              Let's begin the path to a healthier, stronger you — one rep at a time.
            </Text>

            <TouchableOpacity style={styles.buttonPrimary} onPress={() => handleContinue('/onboarding/page2')}>
              <Text style={styles.buttonTextPrimary}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
