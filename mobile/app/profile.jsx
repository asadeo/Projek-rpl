import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

// Make sure this IP address is correct for your local network.
const API_URL = 'http://192.168.1.103:3000'; 

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile data every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const getProfile = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          router.replace('/sign-in');
          return;
        }

        try {
          const res = await fetch(`${API_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!res.ok) {
            // If the token is invalid, sign out the user
            if (res.status === 401 || res.status === 403) {
              await handleSignOut();
            }
            throw new Error('Gagal mengambil profil');
          }

          const data = await res.json();
          setProfile(data);
        } catch (err) {
          console.error("Fetch error:", err);
          Alert.alert("Error", "Terjadi kesalahan saat mengambil data profil.");
        } finally {
          setLoading(false);
        }
      };

      getProfile();
    }, [])
  );

  const handleSignOut = async () => {
    await AsyncStorage.multiRemove(['token', 'user_id', 'role']);
    router.replace('/(auth)/sign-in');
  };

  const handleImagePick = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const formData = new FormData();
      formData.append('profile_picture', {
        uri: uri,
        name: `photo_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });
      
      const token = await AsyncStorage.getItem('token');

      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/auth/upload-picture`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const resData = await res.json();
        if (res.ok) {
          Alert.alert("Success", "Foto profil berhasil diupload!");
          // Update profile picture URL in state to reflect change immediately
          setProfile(prev => ({ ...prev, profile_picture_url: resData.url }));
        } else {
          throw new Error(resData.message || "Gagal mengupload gambar");
        }
      } catch (err) {
        console.error("Upload error:", err);
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading || !profile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0d1b2a" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
         <TouchableOpacity onPress={handleImagePick} style={styles.avatarContainer}>
            <Image 
              id="profile-picture"
              source={{ uri: profile.profile_picture_url ? `${API_URL}${profile.profile_picture_url}` : 'https://via.placeholder.com/150' }} 
              style={styles.avatar} 
            />
            <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={20} color="white" />
            </View>
        </TouchableOpacity>
        
        <Text style={styles.name}>{profile.name || 'User'}</Text>
        
        <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{profile.email}</Text>
        </View>
        <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Role:</Text>
            <Text style={styles.infoValue}>{profile.role}</Text>
        </View>

        {profile.role === 'trainer' && (
          <View style={styles.trainerSection}>
            <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Experience:</Text>
                <Text style={styles.infoValue}>{profile.experience_years ?? '-'} years</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Education:</Text>
                <Text style={styles.infoValue}>{profile.education ?? '-'}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Price/Hour:</Text>
                <Text style={styles.infoValue}>Rp {profile.price ? parseInt(profile.price).toLocaleString('id-ID') : '-'}</Text>
            </View>
          </View>
        )}

        {profile.role !== 'trainer' && (
            <TouchableOpacity 
                style={[styles.button, styles.registerButton]} 
                onPress={() => router.push('/register-trainer')}
            >
                <Text style={styles.buttonText}>Register as Trainer</Text>
            </TouchableOpacity>
        )}
        
        <TouchableOpacity style={[styles.button, styles.signOutButton]} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#0d1b2a',
  },
  cameraIcon: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      backgroundColor: '#0d1b2a',
      borderRadius: 15,
      padding: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  trainerSection: {
    width: '100%',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  registerButton: {
    backgroundColor: '#0d1b2a',
  },
  signOutButton: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});