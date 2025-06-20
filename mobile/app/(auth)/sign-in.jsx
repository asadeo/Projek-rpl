import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, Image, BackHandler } from 'react-native'
import { useState } from 'react'
import { styles } from "@/assets/styles/auth.styles.js";
import { COLORS } from '../../constants/color';
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function Page() {
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error,setError] = useState("")
  const [loading, setLoading] = useState(false)

    // useFocusEffect(
    //   React.useCallback(() => {
    //     const onBackPress = () => true;
    //     BackHandler.addEventListener('hardwareBackPress', onBackPress);
    //     return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    //   }, [])
    // );

const onSignInPress = async () => {
  setError(""); // Bersihkan error sebelumnya
  
  if (!emailAddress || !password) {
    setError("Email dan kata sandi tidak boleh kosong.");
    return;
  }

  // Validasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailAddress)) {
    setError("Format email tidak valid.");
    return;
  }

  // Validasi kekuatan kata sandi (contoh)
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    setError(`Kata sandi minimal ${minLength} karakter.`);
    return;
  }
  if (!hasUppercase) {
    setError("Kata sandi harus mengandung setidaknya satu huruf kapital.");
    return;
  }
  if (!hasLowercase) {
    setError("Kata sandi harus mengandung setidaknya satu huruf kecil.");
    return;
  }
  if (!hasNumber) {
    setError("Kata sandi harus mengandung setidaknya satu angka.");
    return;
  }
  if (!hasSpecialChar) {
    setError("Kata sandi harus mengandung setidaknya satu karakter spesial (!@#$%^&*...).");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("http://192.168.1.103:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: emailAddress,
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login gagal");
    }

    // Simpan token ke local storage
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user_id", data.user_id.toString());
    await AsyncStorage.setItem("role", data.role);

    router.replace("/"); // Redirect ke halaman utama
  } catch (err) {
    setError(err.message || "Terjadi kesalahan");
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAwareScrollView 
      style={{ flex: 1}}
      contentContainerStyle={{ flexGrow: 1}}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={0}
    >
        <View style={styles.container}>
        <Image 
            source={require("../../assets/images/Logo-mahao.png")} 
            style={styles.illustration}
        />
        <Text style={styles.title}>Welcome to T2MOVE</Text>
        <Text style={styles.subTitle}>
          Start your journey to a stronger, healthier you. Sign up or log in below to connect with your personal trainer and reach your fitness goals
        </Text>

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => setError("")}>
            <Ionicons name="close" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholderTextColor="#8F9098"
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
        />

      <TextInput
        style={[styles.input, error && styles.errorInput]}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#8F9098"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
        <TouchableOpacity style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Belum punya akun?</Text>
          <Link href="/sign-up" asChild>
          <TouchableOpacity>
            <Text style={styles.LinkText}>Sign Up</Text>
          </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.or}>Or</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity onPress={() => Alert.alert('Login Google', 'Fitur Login google akan datang!')} style={styles.socialButton}>
          <Image
            source={require("../../assets/images/google logo.jpg")} // pastikan ikon ada
            style={styles.socialIcon}
          />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Alert.alert('Login Facebook', 'Fitur Login Facebook akan datang!')} style={styles.socialButton}>
        <Image
          source={require("../../assets/images/facebook logo.jpg")} // pastikan ikon ada
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>Continue with Facebook</Text>
      </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  )
}