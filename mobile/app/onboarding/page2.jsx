import { View, Text, TouchableOpacity,ImageBackground, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from "@/assets/styles/auth.styles.js";

export default function OnboardingPage2() {
  const router = useRouter();

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        source={require('@/assets/images/gym-image.png')} 
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.containerBoarding}>
          <Image
            source={require('../../assets/images/Logo-mahao.png')}
            style={styles.logo}
            resizeMode="contain"
            height={850}
          />
          <View style={styles.contentBox}>
            <Text style={styles.titleBoarding}>Guidance That Moves With You</Text>
            <Text style={styles.description}>
                Get expert guidance from certified trainers anytime, anywhere. 
                Train smarter with personalized support right from your phone.
            </Text>

            <TouchableOpacity style={styles.buttonPrimary} onPress={() => router.replace('/onboarding/page3')}>
              <Text style={styles.buttonTextPrimary}>Next</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.replace('/sign-in')}>
              <Text style={styles.buttonTextSecondary}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
