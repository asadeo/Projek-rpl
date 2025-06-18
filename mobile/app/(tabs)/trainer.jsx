import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../assets/styles/trainer.styles';

// Ganti dengan IP Address lokal Anda
const API_URL = 'http://192.168.1.104:3000'; 

const TrainerCard = ({ trainer }) => {
  // Gunakan gambar placeholder jika URL gambar tidak ada
  const imageUrl = trainer.profile_picture_url 
    ? { uri: `${API_URL}${trainer.profile_picture_url}` }
    : require('../../assets/images/default-profile.png');

 const handleChatPress = () => {
    // Navigasi ke halaman chat dengan membawa data trainer sebagai parameter
    router.push({
      pathname: `/chat/${trainer.id}`,
      params: { ...trainer }
    });
  };

  return (
    <View style={styles.card}>
      <Image source={imageUrl} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.name}>{trainer.name}</Text>
        <Text style={styles.title}>{trainer.education}</Text>
        <Text style={styles.experience}>{trainer.experience_years} years experience</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>Rp {trainer.price}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>5.0</Text>
            <Text style={styles.review}> (Review 22)</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#888" />
      </TouchableOpacity>
    </View>
  );
};

export default function TrainerPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          router.replace('/(auth)/sign-in');
          return;
        }

        const response = await fetch(`${API_URL}/trainer/trainers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
             Alert.alert('Sesi habis', 'Silakan masuk kembali.');
             router.replace('/(auth)/sign-in');
             return;
        }

        if (!response.ok) {
          throw new Error('Gagal mengambil data trainer');
        }

        const data = await response.json();
        setTrainers(data);
      } catch (error) {
        console.error("Fetch Trainer Error:", error);
        Alert.alert('Error', 'Tidak dapat memuat data trainer.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#0d1b2a" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your Personal Trainer</Text>
      </View>
      <FlatList
        data={trainers}
        renderItem={({ item }) => <TrainerCard trainer={item} router={router} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}
