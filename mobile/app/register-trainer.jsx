import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const API_URL = 'http://192.168.1.49:3000';

export default function RegisterTrainer() {
  const router = useRouter();
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const submitTrainer = async () => {
    if (!experience || !education || !price) {
      return Alert.alert("Validation Error", "Semua field harus diisi.");
    }
    
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/auth/register-trainer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          experience_years: experience,
          education: education,
          price: price
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal mendaftar sebagai trainer.");
      }

      Alert.alert("Success", "Berhasil mendaftar sebagai trainer!");
      router.back(); // Go back to profile page
    } catch (err) {
      Alert.alert("Registration Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Trainer Registration</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Years of Experience"
            keyboardType="numeric"
            value={experience}
            onChangeText={setExperience}
          />
          <TextInput
            style={styles.input}
            placeholder="Education"
            value={education}
            onChangeText={setEducation}
          />
          <TextInput
            style={styles.input}
            placeholder="Price per Hour (Rp)"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <TouchableOpacity style={styles.button} onPress={submitTrainer} disabled={loading}>
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1A202C',
  },
  input: {
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 20,
    color: '#2D3748',
  },
  button: {
    backgroundColor: '#0d1b2a',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#CBD5E0',
  },
  cancelButtonText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: 'bold',
  },
});