import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../assets/styles/trainer-tools.styles';

// Pastikan alamat IP ini sesuai dengan alamat IP lokal backend Anda
const API_URL = 'http://192.168.1.103:3000'; 

const formatRupiah = (amount) => {
  if (amount == null) return 'Rp 0';
  return `Rp${parseInt(amount, 10).toLocaleString('id-ID')}`;
};

export default function TrainerToolsPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      router.replace('/(auth)/sign-in');
      return;
    }

    try {
      const [walletRes, historyRes] = await Promise.all([
        fetch(`${API_URL}/auth/trainer/me`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/auth/trainer/chat-history`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (!walletRes.ok || !historyRes.ok) {
        throw new Error('Gagal mengambil data trainer');
      }

      const walletData = await walletRes.json();
      const historyData = await historyRes.json();

      setWallet(walletData.trainer_wallet || 0);
      const enrichedHistory = await Promise.all(
        historyData.map(async (item) => {
          try {
            const profileRes = await fetch(`${API_URL}/auth/profile-by-id/${item.user_id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!profileRes.ok) {
              console.warn(`Failed to fetch profile for user_id: ${item.user_id}`);
              return { ...item, profile_picture_url: null }; // Fallback if fetch fails
            }
            const userProfile = await profileRes.json();
            return { ...item, profile_picture_url: userProfile.profile_picture_url };
          } catch (profileError) {
            console.error(`Error fetching profile for user_id ${item.user_id}:`, profileError);
            return { ...item, profile_picture_url: null }; // Ensure profile_picture_url is set to null on error
          }
        })
      );
      setHistory(enrichedHistory);

    } catch (error) {
      Alert.alert('Error', 'Tidak dapat memuat data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleNavigateToChat = async (userId) => {
     try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_URL}/auth/profile-by-id/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Gagal mengambil detail user.');
        
        const userProfile = await response.json();
        router.push({
            pathname: `/chat/chat_page`,
            params: {
                id: userProfile.id, // ID pengguna yang akan diajak chat (digunakan sebagai trainerId di chat_page)
                name: userProfile.name,
                profile_picture_url: userProfile.profile_picture_url,
              }
        });
    } catch (error) {
        Alert.alert('Error', error.message);
    }
  };

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity style={styles.logItem} onPress={() => handleNavigateToChat(item.user_id)}>
      <Image
        source={item.profile_picture_url 
                  ? { uri: `${API_URL}${item.profile_picture_url}` } 
                  : require('../assets/images/default-profile.png')}
        style={styles.logAvatar}
      />
      <View style={styles.logTextContainer}>
        <Text style={styles.logName}>{item.user_name}</Text>
        <Text style={styles.logDetail}>Email: {item.email}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#c0c0c0" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/trainer')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trainer Tools</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#0d1b2a" />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={renderHistoryItem}
          ListHeaderComponent={
            <>
              <View style={styles.earningsCard}>
                <Text style={styles.earningsLabel}>Earnings</Text>
                <Text style={styles.earningsAmount}>{formatRupiah(wallet)}</Text>
              </View>

              <TouchableOpacity
                style={styles.actionCard}
                // --- UBAH BARIS INI ---
                onPress={() => router.push('/set-schedule')}
              >
                <Ionicons name="calendar-outline" size={28} color="#0d1b2a" />
                <Text style={styles.actionCardText}>Atur Jadwal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => Alert.alert("Coming Soon", "Fitur withdraw akan segera hadir!")}
              >
                 <Ionicons name="wallet-outline" size={28} color="#0d1b2a" />
                <Text style={styles.actionCardText}>Withdraw</Text>
              </TouchableOpacity>
              
              <Text style={styles.logsTitle}>Logs</Text>
            </>
          }
          ListEmptyComponent={
            <Text style={styles.emptyLogsText}>Tidak ada riwayat chat/order.</Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}
