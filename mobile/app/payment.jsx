import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../assets/styles/payment.styles';

const API_URL = 'http://192.168.1.111:3000'; // Pastikan IP sesuai

const paymentOptions = [
  { key: 'Gopay', name: 'Gopay', logo: require('../assets/images/gopay-logo.jpeg') },
  { key: 'Dana', name: 'Dana', logo: require('../assets/images/dana-logo.png') },
  { key: 'BRI', name: 'BRI', logo: require('../assets/images/bri-logo.png') },
];

export default function PaymentPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { schedule: scheduleString, trainer: trainerString } = params;

  // Parse data yang dikirim dari halaman sebelumnya
  const schedule = JSON.parse(scheduleString);
  const trainer = JSON.parse(trainerString);

  const [selectedPayment, setSelectedPayment] = useState('Gopay');

  const handleConfirmPayment = async () => {
    Alert.alert(
      "Konfirmasi Pembayaran",
      `Anda akan memesan jadwal dengan ${trainer.name} menggunakan ${selectedPayment}. Lanjutkan?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya, Lanjutkan",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await fetch(`${API_URL}/auth/trainer/schedule/book/${schedule.id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal melakukan booking.');
              }
              
              Alert.alert('Booking Berhasil', 'Jadwal konsultasi Anda telah dikonfirmasi!');
              router.replace('/(tabs)/trainer'); // Kembali ke daftar trainer
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };
  
  const serviceFee = 5000;
  const subtotal = parseInt(trainer.price, 10);
  const total = subtotal + serviceFee;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.consultationInfo}>
            <Text style={styles.consultationText}>Consultation with {trainer.name}</Text>
            <Text style={styles.consultationDate}>{new Date(schedule.schedule_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {schedule.schedule_time}</Text>
          </View>

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Subtotal</Text>
              <Text style={styles.summaryText}>Rp.{subtotal.toLocaleString('id-ID')}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Application Service fee</Text>
              <Text style={styles.summaryText}>Rp.{serviceFee.toLocaleString('id-ID')}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>Rp.{total.toLocaleString('id-ID')}</Text>
            </View>
          </View>
          
          <View style={styles.paymentMethodContainer}>
             <Text style={styles.summaryTitle}>Payment Method</Text>
             {paymentOptions.map((option) => (
                <TouchableOpacity 
                    key={option.key} 
                    style={[styles.paymentOption, selectedPayment === option.key && styles.selectedOption]}
                    onPress={() => setSelectedPayment(option.key)}
                >
                    <Image source={option.logo} style={styles.paymentLogo}/>
                    <Text style={styles.paymentName}>{option.name}</Text>
                    <View style={[styles.radioCircle, selectedPayment === option.key && styles.selectedRadio]}>
                        {selectedPayment === option.key && <View style={styles.radioDot} />}
                    </View>
                </TouchableOpacity>
             ))}
          </View>
        </View>
      </ScrollView>
       <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
          <Text style={styles.confirmButtonText}>Tambah pembelian</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}