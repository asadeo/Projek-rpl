import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, ActivityIndicator, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '@/assets/styles/auth.styles.js';
import { COLORS } from '../../constants/color';
import { Ionicons } from "@expo/vector-icons";
import { Image } from 'expo-image'; // Menggunakan expo-image
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen() {
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    setError(''); // Bersihkan error sebelumnya

    if (!name || !emailAddress || !password || !confirmPassword) {
      setError('Harap isi semua kolom.');
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      setError('Format email tidak valid.');
      return;
    }

    // Validasi kekuatan kata sandi
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
      setError('Kata sandi harus mengandung setidaknya satu huruf kapital.');
      return;
    }
    if (!hasLowercase) {
      setError('Kata sandi harus mengandung setidaknya satu huruf kecil.');
      return;
    }
    if (!hasNumber) {
      setError('Kata sandi harus mengandung setidaknya satu angka.');
      return;
    }
    if (!hasSpecialChar) {
      setError('Kata sandi harus mengandung setidaknya satu karakter spesial (!@#$%^&*...).');
      return;
    }

    // Validasi konfirmasi kata sandi
    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('http://192.168.1.103:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: emailAddress,
          password,
        }),
      });
      
      let data;
      try {
        const text = await response.text();
        data = JSON.parse(text);
      } catch (e) {
        console.error('Not JSON:', e);
        setError('Invalid response format from server.');
        return;
      }

      if (!response.ok) {
        setError(data.message || 'Sign up failed.');
        return;
      }

      // Pastikan user_id dan role juga disimpan setelah registrasi sukses
      // Asumsi backend mengembalikan user_id dan role setelah registrasi
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user_id', data.user_id.toString()); 
      await AsyncStorage.setItem('role', data.role); 

      Alert.alert('Sukses', 'Akun Anda berhasil dibuat.');
      router.replace('/(tabs)/'); // Redirect ke halaman utama setelah sukses
    } catch (err) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true}>
      <View style={styles.container}>
        <Image source={require("../../assets/images/Logo-mahao.png")} style={{ width: 300, height: 150 }} />
        <Text style={styles.title}>Welcome to T2MOVE</Text>
        <Text style={styles.subTitle}>
          Start your journey to a stronger, healthier you. Sign up or log in below to connect with your personal trainer and reach your fitness goals.
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
          placeholder="Username"
          placeholderTextColor="#8F9098"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholderTextColor="#8F9098"
          placeholder="Enter email"
          onChangeText={setEmailAddress}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#8F9098"
          secureTextEntry
          onChangeText={setPassword}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          placeholder="Confirm Password"
          placeholderTextColor="#8F9098"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={onSignUpPress} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.LinkText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}