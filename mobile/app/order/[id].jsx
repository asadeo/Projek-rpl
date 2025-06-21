import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { styles } from '../../assets/styles/order.styles';

const API_URL = 'http://192.168.1.49:3000'; 

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
    if (!trainer?.id) {
        Alert.alert("Error", "Trainer ID tidak ditemukan.");
        setLoading(false);
        return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/(auth)/sign-in');
        return;
      }
      
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

  useEffect(() => {
    fetchSchedules();
  }, [trainer.id]);
  
  const handleSelectSchedule = (scheduleItem) => {
    if (scheduleItem.is_booked) {
      Alert.alert('Sudah Dipesan', 'Jadwal ini tidak lagi tersedia.');
      return;
    }
    router.push({
      pathname: '/payment', 
      params: { 
        schedule: JSON.stringify(scheduleItem), 
        trainer: JSON.stringify(trainer)       
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

  const profilePictureUrl = trainer.profile_picture_url
    ? `${API_URL}${trainer.profile_picture_url}`
    : 'https://via.placeholder.com/80';

  return (
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
          <View style={styles.mainContentCard}>
            <FlatList
              data={schedules}
              renderItem={renderScheduleItem}
              keyExtractor={(item) => item.id.toString()}
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