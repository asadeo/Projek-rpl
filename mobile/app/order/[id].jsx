import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../assets/styles/order.styles';

const API_URL = 'http://192.168.1.104:3000'; // Pastikan IP sesuai

export default function OrderPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id: trainerId, name, profile_picture_url, price } = params;

  const handleCreateOrder = async () => {
    Alert.alert(
      "Konfirmasi Pesanan",
      `Anda akan memesan sesi dengan ${name} seharga Rp ${price}.`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Pesan Sekarang", onPress: async () => {
            try {
              const userId = await AsyncStorage.getItem('user_id');
              const consultationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Jadwal untuk besok (contoh)

              if (!userId) {
                Alert.alert("Error", "User tidak ditemukan, silakan login ulang.");
                router.replace('/(auth)/sign-in');
                return;
              }

              const response = await fetch(`${API_URL}/user/order-trainer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  user_id: parseInt(userId),
                  trainer_id: parseInt(trainerId),
                  consultation_date: consultationDate.toISOString(),
                  fee: parseInt(price),
                }),
              });

              const responseData = await response.json();

              if (!response.ok) {
                throw new Error(responseData.message || "Gagal membuat pesanan.");
              }

              Alert.alert("Sukses", "Pesanan Anda telah berhasil dibuat!");
              router.push('/(tabs)/trainer');

            } catch (error) {
              console.error("Create Order Error:", error);
              Alert.alert("Error", error.message);
            }
          }
        }
      ]
    );
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Pemesanan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        <View style={styles.trainerCard}>
          <Image source={{ uri: `${API_URL}${profile_picture_url}` }} style={styles.trainerImage} />
          <View style={styles.trainerInfo}>
            <Text style={styles.trainerName}>{name}</Text>
            <Text style={styles.trainerDesc}>Personal Trainer</Text>
          </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Jadwal Konsultasi</Text>
            <TouchableOpacity style={styles.scheduleButton}>
                <Text>Pilih Jadwal (Contoh: Besok)</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
            <View style={styles.paymentOption}>
                <Image source={require('../../assets/images/gopay-logo.png')} style={styles.paymentLogo} />
            </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.payButton} onPress={handleCreateOrder}>
          <Text style={styles.payButtonText}>Bayar Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}