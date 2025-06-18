import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../assets/styles/order.styles';

const API_URL = 'http://192.168.1.111:3000'; // Pastikan IP sesuai

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
  const { id: trainerId, name, profile_picture_url } = params;

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/trainer/schedule/${trainerId}`, {
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

  const handleBookSchedule = async (schedule) => {
    if (schedule.is_booked) {
      Alert.alert('Sudah Dipesan', 'Jadwal ini tidak lagi tersedia.');
      return;
    }

    Alert.alert(
      'Konfirmasi Booking',
      `Anda yakin ingin memesan jadwal pada ${formatDate(schedule.schedule_date, schedule.schedule_time)}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Pesan',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await fetch(`${API_URL}/trainer/schedule/book/${schedule.id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
              });
              if (!response.ok) throw new Error('Gagal melakukan booking.');
              
              Alert.alert('Sukses', 'Jadwal berhasil dipesan!');
              setLoading(true);
              fetchSchedules(); // Muat ulang jadwal untuk melihat status terbaru
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const renderScheduleItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleBookSchedule(item)} style={styles.scheduleItem}>
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
              <Image source={{ uri: `${API_URL}${profile_picture_url}` }} style={styles.trainerImage} />
              <View>
                <Text style={styles.trainerName}>{name}</Text>
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