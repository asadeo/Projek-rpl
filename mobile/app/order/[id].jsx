import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../assets/styles/order.styles';

const API_URL = 'http://192.168.1.111:3000'; // Pastikan IP sesuai

// ... (fungsi formatDate tetap sama)

export default function OrderPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // Ambil semua data trainer yang dikirim dari halaman chat
  const trainer = params; 

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => { /* ... (fungsi fetchSchedules tetap sama) ... */ };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // --- MODIFIKASI FUNGSI INI ---
  const handleSelectSchedule = (scheduleItem) => {
    if (scheduleItem.is_booked) {
      Alert.alert('Sudah Dipesan', 'Jadwal ini tidak lagi tersedia.');
      return;
    }
    // Arahkan ke halaman payment dengan membawa data jadwal dan trainer
    router.push({
      pathname: '/payment',
      params: { 
        schedule: JSON.stringify(scheduleItem), 
        trainer: JSON.stringify(trainer) 
      }
    });
  };

  const renderScheduleItem = ({ item }) => (
    // Panggil handleSelectSchedule saat ditekan
    <TouchableOpacity onPress={() => handleSelectSchedule(item)} style={styles.scheduleItem}>
      <Text style={styles.scheduleTime}>
        {/* ... format tanggal ... */}
      </Text>
      <Text style={[styles.scheduleStatus, item.is_booked ? styles.statusBooked : styles.statusEmpty]}>
        {item.is_booked ? 'Already Booked' : 'Empty'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ... (Header dan ListHeaderComponent tetap sama) ... */}
      {loading ? (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0d1b2a" />
        </View>
      ) : (
        <FlatList
          data={schedules}
          renderItem={renderScheduleItem}
          // ... (sisa props FlatList) ...
        />
      )}
    </SafeAreaView>
  );
}