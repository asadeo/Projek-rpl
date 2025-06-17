import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../assets/styles/training.styles'; 

// --- MODIFIKASI: Menambahkan data latihan baru ---
const chestExercises = [
  { id: '1', title: 'Bench Press', image: require('../../assets/images/bench-press.png') },
  { id: '2', title: 'Chest Fly', image: require('../../assets/images/chest-fly.png') },
  { id: '3', title: 'Incline Chest Fly', image: require('../../assets/images/incline-chest-fly.png') },
  { id: '4', title: 'Cable Crossover', image: require('../../assets/images/cable-crossover.png') },
  { id: '5', title: 'Decline Dumbbell Press', image: require('../../assets/images/decline-dumbbell-press.png') },
];

const ExerciseCard = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardOverlay} />
      <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
);

export default function ChestPage() {
  const router = useRouter();

  const handlePress = (item) => {
    // Hanya item pertama (Bench Press) yang akan menavigasi
    if (item.id === '1') {
        router.push('/training/bench-press');
    } else {
        Alert.alert("Segera Hadir", `Halaman untuk ${item.title} belum tersedia.`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { flexDirection: 'row', alignItems: 'center' }]}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chest</Text>
      </View>
      <FlatList
        data={chestExercises}
        renderItem={({ item }) => <ExerciseCard item={item} onPress={() => handlePress(item)} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}