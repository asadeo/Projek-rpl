import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
// Pastikan useSafeAreaInsets diimpor
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; 
// Pastikan styles diimpor dari file terpisah (assets/styles/order.styles.js)
import { styles } from '../../assets/styles/order.styles';
import { Background } from '@react-navigation/elements';

// !!! PENTING: Pastikan alamat IP ini sesuai dengan alamat IP lokal backend Anda
const API_URL = 'http://192.168.1.103:3000'; 

/**
 * Fungsi untuk memformat tanggal dan waktu agar lebih mudah dibaca.
 */
const formatDate = (dateString, timeString) => {
  try {
    const date = new Date(`${dateString.split('T')[0]}T${timeString}`);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

export default function OrderPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const trainer = params; 

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets(); 

  const fetchSchedules = async () => {
    // Pastikan trainer.id ada sebelum melakukan fetch
    if (!trainer?.id) {
        Alert.alert("Error", "Trainer ID tidak ditemukan.");
        setLoading(false);
        return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        // Jika tidak ada token, arahkan kembali ke halaman sign-in
        router.replace('/(auth)/sign-in');
        return;
      }
      
      // --- PERBAIKAN 1: URL ENDPOINT ---
      // Endpoint diubah menjadi '/auth/trainer/schedule/' sesuai perbaikan backend sebelumnya.
      const response = await fetch(`${API_URL}/auth/trainer/schedule/${trainer.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Gagal mengambil jadwal: ${errorData.message || response.status}`);
      }
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- PERBAIKAN 2: DEPENDENCY USEEFFECT ---
  // Menambahkan trainer.id sebagai dependency agar data di-fetch ulang jika ID trainer berubah.
  useEffect(() => {
    fetchSchedules();
  }, [trainer.id]);
  
  const handleSelectSchedule = (scheduleItem) => {
    if (scheduleItem.is_booked) {
      Alert.alert('Sudah Dipesan', 'Jadwal ini tidak lagi tersedia.');
      return;
    }
    router.push({
      pathname: '/payment', // Halaman pembayaran yang kita buat sebelumnya
      params: { 
        schedule: JSON.stringify(scheduleItem), // Kirim objek jadwal
        trainer: JSON.stringify(trainer)       // Kirim objek trainer
      }
    });
  };

  const renderScheduleItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectSchedule(item)} style={styles.scheduleItem}>
      <Text style={styles.scheduleTime}>
        {formatDate(item.schedule_date, item.schedule_time)}
      </Text>
      <Text style={[styles.scheduleStatus, item.is_booked ? styles.statusBooked : styles.statusEmpty]}>
        {item.is_booked ? 'Already Booked' : 'Empty'}
      </Text>
    </TouchableOpacity>
  );

  // --- PERBAIKAN 3: URL GAMBAR & FALLBACK ---
  // Membentuk URL gambar dengan benar dan memberikan gambar placeholder jika tidak ada.
  const profilePictureUrl = trainer.profile_picture_url
    ? `${API_URL}${trainer.profile_picture_url}`
    : 'https://via.placeholder.com/80';

  return (
    // SafeAreaView untuk menangani area status bar, menyesuaikan warna dengan header
    <SafeAreaView style={styles.container} edges={['bottom']} backgroundColor={styles.header.backgroundColor}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order a Consultation Schedule</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#123459" />
            <Text style={{ color: '#123459', marginTop: 10 }}>Loading schedules...</Text>
          </View>
        ) : (
          // Wrapper View baru untuk kartu konten utama (trainer dan daftar jadwal)
          <View style={styles.mainContentCard}>
            <FlatList
              data={schedules}
              renderItem={renderScheduleItem}
              keyExtractor={(item) => item.id.toString()}
              // Menggunakan nama gaya baru untuk contentContainerStyle
              contentContainerStyle={styles.listContentContainer} 
              ListHeaderComponent={
                <View style={styles.trainerCard}>
                  <Image 
                    source={{ uri: profilePictureUrl }} 
                    style={styles.trainerImage} 
                  />
                  <View>
                    <Text style={styles.trainerName}>
                      {trainer.name || 'Nama Trainer'}
                    </Text>
                  </View>
                </View>
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Trainer ini belum memiliki jadwal.</Text>
                  <TouchableOpacity onPress={() => router.back()} style={styles.goBackButton}>
                    <Text style={styles.goBackText}>Kembali ke Home</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        )}
    </SafeAreaView>
  );
}