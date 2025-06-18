import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
// Impor style terpisah agar kode lebih rapi
// import { styles } from '../../assets/styles/order.styles';

// !!! PENTING: Pastikan alamat IP ini sesuai dengan alamat IP lokal backend Anda
const API_URL = 'http://192.168.1.111:3000'; 

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
              <Image 
                source={{ uri: profilePictureUrl }} 
                style={styles.trainerImage} 
              />
              <View>
                <Text style={styles.trainerName}>{trainer.name || 'Nama Trainer'}</Text>
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

// Menambahkan StyleSheet langsung di sini agar file menjadi mandiri
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    backButton: { marginRight: 15 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContainer: { paddingHorizontal: 20, paddingTop: 10 },
    trainerCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    trainerImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
    trainerName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    scheduleItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee'
    },
    scheduleTime: { fontSize: 16, fontWeight: '500' },
    scheduleStatus: { marginTop: 5 },
    statusBooked: { color: 'red', fontWeight: 'bold' },
    statusEmpty: { color: 'green' },
    emptyContainer: { alignItems: 'center', marginTop: 50 },
    emptyText: { fontSize: 16, color: 'gray' }
});
