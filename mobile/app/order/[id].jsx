import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../assets/styles/order.styles';

// Pastikan IP address ini sesuai dengan alamat IP backend Anda
const API_URL = 'http://192.168.1.111:3000'; 

/**
 * Fungsi untuk memformat tanggal dan waktu agar lebih mudah dibaca.
 * @param {string} dateString - String tanggal (misal: "2025-06-22T00:00:00.000Z")
 * @param {string} timeString - String waktu (misal: "15:00:00")
 * @returns {string} Tanggal dan waktu yang diformat (misal: "Sunday, June 22, 2025 at 3:00 PM")
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
    console.error("Invalid date format:", e);
    return 'Invalid Date';
  }
};

export default function OrderPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const trainer = params; // Mengambil semua data trainer dari parameter navigasi

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil jadwal dari server
  const fetchSchedules = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/(auth)/sign-in');
        return;
      }
      
      const response = await fetch(`${API_URL}/trainer/schedule/${trainer.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil jadwal konsultasi');
      }
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [trainer.id]); // Ambil ulang data jika ID trainer berubah

  // Fungsi yang dipanggil saat user memilih jadwal
  const handleSelectSchedule = (scheduleItem) => {
    if (scheduleItem.is_booked) {
      Alert.alert('Sudah Dipesan', 'Jadwal ini tidak lagi tersedia untuk dipesan.');
      return;
    }
    
    // Navigasi ke halaman pembayaran dengan mengirimkan data jadwal dan trainer
    router.push({
      pathname: '/payment',
      params: { 
        schedule: JSON.stringify(scheduleItem),
        trainer: JSON.stringify(trainer)
      }
    });
  };

  // Komponen untuk merender setiap item jadwal
  const renderScheduleItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.scheduleItem}
      onPress={() => handleSelectSchedule(item)} 
      disabled={item.is_booked}
    >
      <Text style={styles.scheduleTime}>
        {formatDate(item.schedule_date, item.schedule_time)}
      </Text>
      <Text style={[styles.scheduleStatus, item.is_booked ? styles.statusBooked : styles.statusEmpty]}>
        {item.is_booked ? 'Already Booked' : 'Empty'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order a Consultation Schedule</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0d1b2a" />
        </View>
      ) : (
        <FlatList
          data={schedules}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            // Menampilkan informasi trainer di bagian atas daftar
            <View style={styles.trainerCard}>
              <Image 
                source={{ uri: trainer.profile_picture_url ? `${API_URL}${trainer.profile_picture_url}` : 'https://via.placeholder.com/80' }} 
                style={styles.trainerImage} 
              />
              <View>
                <Text style={styles.trainerName}>{trainer.name}</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            // Tampilan jika tidak ada jadwal yang tersedia
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Trainer ini belum memiliki jadwal yang tersedia.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}