import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from '../assets/styles/set-schedule.styles';


const API_URL = 'http://192.168.1.49:3000'; 

export default function SetSchedulePage() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onChangeStartTime = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartTimePicker(Platform.OS === 'ios');
    setStartTime(currentTime);
  };

  const onChangeEndTime = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndTimePicker(Platform.OS === 'ios');
    setEndTime(currentTime);
  };

  const formatDate = (d) => {
      return d.toISOString().split('T')[0];
  };

  const formatTime = (t) => {
      return t.toTimeString().split(' ')[0].substring(0, 5);
  };

  const submitSchedule = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    
    const scheduleData = {
      date: formatDate(date),
      start_time: formatTime(startTime),
      end_time: formatTime(endTime),
    };

    try {
      const response = await fetch(`${API_URL}/auth/trainer/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(scheduleData)
      });
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menyimpan jadwal');
      }

      Alert.alert("Sukses", result.message || "Jadwal berhasil disimpan!");
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Atur Jadwal Konsultasi</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Pilih Tanggal</Text>
        <TouchableOpacity style={styles.inputButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.inputText}>{date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="datePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <Text style={styles.label}>Waktu Mulai</Text>
        <TouchableOpacity style={styles.inputButton} onPress={() => setShowStartTimePicker(true)}>
          <Text style={styles.inputText}>{formatTime(startTime)}</Text>
        </TouchableOpacity>
        {showStartTimePicker && (
          <DateTimePicker
            testID="startTimePicker"
            value={startTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeStartTime}
          />
        )}

        <Text style={styles.label}>Waktu Selesai</Text>
        <TouchableOpacity style={styles.inputButton} onPress={() => setShowEndTimePicker(true)}>
          <Text style={styles.inputText}>{formatTime(endTime)}</Text>
        </TouchableOpacity>
        {showEndTimePicker && (
          <DateTimePicker
            testID="endTimePicker"
            value={endTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeEndTime}
          />
        )}

        <TouchableOpacity style={styles.submitButton} onPress={submitSchedule} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Simpan Jadwal</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}