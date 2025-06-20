import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles as originalStyles } from '../../assets/styles/trainer.styles';

const API_URL = 'http://192.168.1.103:3000'; 

const TrainerCard = ({ trainer, router }) => {
  const imageUrl = trainer.profile_picture_url 
    ? { uri: `${API_URL}${trainer.profile_picture_url}` }
    : require('../../assets/images/default-profile.png');

  const handleChatPress = () => {
    router.push({
      pathname: '/chat/chat_page',
      params: { ...trainer }
    });
  };

  return (
    <View style={originalStyles.card}>
      <Image source={imageUrl} style={originalStyles.cardImage} />
      <View style={originalStyles.cardBody}>
        <Text style={originalStyles.name}>{trainer.name}</Text>
        <Text style={originalStyles.title}>{trainer.education}</Text>
        <Text style={originalStyles.experience}>{trainer.experience_years} years experience</Text>
        <View style={originalStyles.footer}>
          <Text style={originalStyles.price}>Rp {parseInt(trainer.price || 0).toLocaleString('id-ID')}</Text>
        </View>
      </View>
      <TouchableOpacity style={originalStyles.chatButton} onPress={handleChatPress}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#888" />
      </TouchableOpacity>
    </View>
  );
};

export default function TrainerPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // State baru untuk role
  const router = useRouter();

  // useFocusEffect akan berjalan setiap kali layar ini dibuka
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Mengambil role dan token secara bersamaan
          const token = await AsyncStorage.getItem('token');
          const role = await AsyncStorage.getItem('role');
          setUserRole(role); // Set role pengguna

          if (!token) {
            router.replace('/(auth)/sign-in');
            return;
          }

          // Fetch daftar trainer
          const response = await fetch(`${API_URL}/trainer/trainers`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (response.status === 401 || response.status === 403) {
            Alert.alert('Sesi habis', 'Silakan masuk kembali.');
            await AsyncStorage.clear();
            router.replace('/(auth)/sign-in');
            return;
          }

          if (!response.ok) throw new Error('Gagal mengambil data trainer');

          const data = await response.json();
          setTrainers(data);
        } catch (error) {
          console.error("Fetch Trainer Error:", error);
          Alert.alert('Error', 'Tidak dapat memuat data trainer.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#0d1b2a" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* --- PENAMBAHAN TOMBOL TRAINER TOOLS --- */}
      {userRole === 'trainer' && (
        <View style={styles.toolsContainer}>
          <TouchableOpacity 
            style={styles.trainerToolsButton} 
            onPress={() => Alert.alert("Trainer Tools", "Halaman ini belum tersedia.")}
          >
            <Text style={styles.trainerToolsButtonText}>Trainer Tools</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your Personal Trainer</Text>
      </View>

      <FlatList
        data={trainers}
        renderItem={({ item }) => <TrainerCard trainer={item} router={router} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada trainer yang tersedia.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// Menggabungkan style lama dengan style baru untuk tombol
const styles = StyleSheet.create({
  ...originalStyles,
  toolsContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 0,
  },
  trainerToolsButton: {
    backgroundColor: '#e2e8f0', // Warna abu-abu muda
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trainerToolsButtonText: {
    color: '#1a202c', // Warna teks gelap
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  }
});