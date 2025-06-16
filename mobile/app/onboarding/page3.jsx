import { View, Text, TouchableOpacity, Image, SafeAreaView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from "@/assets/styles/auth.styles.js";

export default function OnboardingPage3() {
  const router = useRouter();

  const handleFinish = async (target) => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace(target);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        source={require('@/assets/images/food-boarding.png')} 
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.containerBoarding}>
          <Image
            source={require('../../assets/images/Logo-mahao.png')}
            style={styles.logo}
            resizeMode="contain"
            height={825}
          />
          <View style={styles.contentBox}>
            <Text style={styles.titleBoarding}>Fuel Your Fitness</Text>
            <Text style={styles.description}>
                Achieve your fitness goals with expert workouts and nutritious meals tailored just for you. 
                Track your progress and fuel your body — all in one app.
            </Text>

      <TouchableOpacity style={styles.buttonPrimary} onPress={() => handleFinish('/sign-in')}>
        <Text style={styles.buttonTextPrimary}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => handleFinish('/sign-up')}>
        <Text style={styles.buttonTextSecondary}>Sign Up</Text>
      </TouchableOpacity>
       </View>
      </View>
     </ImageBackground>
   </SafeAreaView>
  );
}
