import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// !!! PENTING: Ganti alamat IP ini dengan alamat IP lokal backend Anda.
// Anda bisa melihatnya dengan menjalankan 'ipconfig' (Windows) atau 'ifconfig' (macOS/Linux).
const API_URL = 'http://192.168.1.111:3000';

/**
 * Fungsi untuk memformat tanggal dan waktu dari string.
 * @param {string} dateStr - String tanggal dari database (misal: "2025-06-22T17:00:00.000Z")
 * @param {string} timeStr - String waktu dari database (misal: "03:00:00")
 * @returns {string} Tanggal dan waktu yang sudah diformat (misal: "Minggu, 22 Juni 2025 pukul 15.00")
 */
function formatDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return "Tanggal tidak valid";
  try {
    // Menggabungkan tanggal dan waktu untuk membuat objek Date yang akurat
    const dateTimeString = `${dateStr.split('T')[0]}T${timeStr}`;
    const dateObj = new Date(dateTimeString);

    if (isNaN(dateObj.getTime())) {
      return `${dateStr} ${timeStr}`;
    }
    
    // Menggunakan toLocaleString untuk format bahasa Indonesia
    return dateObj.toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).replace('pukul', 'at'); // Mengganti format agar mirip dengan desain
  } catch (error) {
    console.error("Kesalahan format tanggal:", dateStr, timeStr, error);
    return `${dateStr} ${timeStr}`;
  }
}

export default function OrderSchedulePage() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  const trainer = params; // Data trainer diterima dari halaman sebelumnya

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data jadwal dari backend
  const loadSchedule = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    const trainerId = trainer.id;

    if (!token || !trainerId) {
      Alert.alert("Error", "Informasi trainer atau token tidak ditemukan.");
      router.back();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/trainer/schedule/${trainerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`Gagal memuat jadwal (HTTP ${response.status})`);
      }
      
      const data = await response.json();
      setSchedules(data);
    } catch (err) {
      console.error("Error fetching schedule:", err);
      Alert.alert("Gagal Memuat", `Terjadi kesalahan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Panggil loadSchedule saat komponen pertama kali dimuat
  useEffect(() => {
    loadSchedule();
  }, [trainer.id]);

  // Fungsi untuk menangani proses booking
  const book = (scheduleItem) => {
    // Arahkan ke halaman pembayaran dan kirim data yang diperlukan
    router.push({
      pathname: '/payment',
      params: { 
        schedule: JSON.stringify(scheduleItem),
        trainer: JSON.stringify(trainer)
      }
    });
  };

  // Komponen untuk merender setiap item jadwal
  const renderItem = ({ item }) => (
    <View style={styles.scheduleCard}>
        <Text style={styles.scheduleDateTime}>{formatDateTime(item.schedule_date, item.schedule_time)}</Text>
        {item.is_booked ? (
            <Text style={styles.bookedText}>Already Booked</Text>
        ) : (
            <Text style={styles.emptyText}>Empty</Text>
        )}
        {!item.is_booked && (
            <TouchableOpacity style={styles.bookButton} onPress={() => book(item)}>
                <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
        )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
       <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order a Consultation Schedule</Text>
      </View>

      {/* Tampilan Trainer */}
      <View style={styles.trainerInfoCard}>
        <Image 
          source={{ uri: trainer.profile_picture_url ? `${API_URL}${trainer.profile_picture_url}` : 'https://via.placeholder.com/80' }}
          style={styles.trainerImage}
        />
        <Text style={styles.trainerName}>{trainer.name || 'Nama Trainer'}</Text>
      </View>

      {/* Tampilan Loading atau Daftar Jadwal */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={schedules}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          ListEmptyComponent={
            <Text style={styles.noScheduleText}>Tidak ada jadwal tersedia.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

// Styles untuk komponen, mirip dengan CSS yang diberikan
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff' },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  trainerInfoCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trainerImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  trainerName: { fontSize: 18, fontWeight: 'bold' },
  scheduleCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  scheduleDateTime: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  bookedText: { color: 'red', fontWeight: 'bold' },
  emptyText: { color: 'green' },
  bookButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center'
  },
  bookButtonText: { color: 'white', fontWeight: 'bold' },
  noScheduleText: { textAlign: 'center', marginTop: 30, fontSize: 16, color: 'gray' },
});