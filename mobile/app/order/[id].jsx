import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../assets/styles/order.styles';

const API_URL = 'http://192.168.1.104:3000'; // Pastikan IP sesuai

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
  // Ambil semua data trainer yang dikirim dari halaman chat
  const trainer = params; 

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/trainer/schedule/${trainer.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Gagal mengambil jadwal');
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
  }, []);

  // --- PERBAIKAN UTAMA ADA DI FUNGSI INI ---
  // Fungsi ini sekarang hanya untuk memilih jadwal dan navigasi, bukan booking.
  const handleSelectSchedule = (scheduleItem) => {
    if (scheduleItem.is_booked) {
      Alert.alert('Sudah Dipesan', 'Jadwal ini tidak lagi tersedia.');
      return;
    }
    
    // Arahkan pengguna ke halaman pembayaran dengan membawa data trainer dan jadwal yang dipilih.
    router.push({
      pathname: '/payment', // Halaman pembayaran yang kita buat sebelumnya
      params: { 
        schedule: JSON.stringify(scheduleItem), // Kirim objek jadwal
        trainer: JSON.stringify(trainer)       // Kirim objek trainer
      }
    });
  };

  const renderScheduleItem = ({ item }) => (
    // Panggil handleSelectSchedule saat jadwal ditekan
    <TouchableOpacity onPress={() => handleSelectSchedule(item)} style={styles.scheduleItem}>
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
            <View style={styles.trainerCard}>
              <Image source={{ uri: `${API_URL}${trainer.profile_picture_url}` }} style={styles.trainerImage} />
              <View>
                <Text style={styles.trainerName}>{trainer.name}</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Trainer ini belum memiliki jadwal.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}