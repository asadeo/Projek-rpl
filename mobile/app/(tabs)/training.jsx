
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { styles } from '../../assets/styles/training.styles';

// Data lengkap untuk semua kategori latihan
const trainingCategories = [
  { id: '1', title: 'Chest', image: require('../../assets/images/chest-workout.png') },
  { id: '2', title: 'Tricep', image: require('../../assets/images/tricep-workout.png') },
  { id: '3', title: 'Bicep', image: require('../../assets/images/bicep-workout.png') },
  { id: '4', title: 'Leg', image: require('../../assets/images/leg-workout.png') },
  { id: '5', title: 'Back', image: require('../../assets/images/back-workout.png') },
];

const CategoryCard = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.card}>
    <Image source={item.image} style={styles.cardImage} />
    <View style={styles.cardOverlay} />
    <Text style={styles.cardTitle}>{item.title}</Text>
  </TouchableOpacity>
);

export default function TrainingPage() {
  const router = useRouter();

  const handlePress = (item) => {
    if (item.id === '1') {
      // Hanya navigasi untuk 'Chest' yang aktif
      router.push('/training/chest');
    } else {
      // Tampilkan pesan untuk kategori lainnya
      Alert.alert("Segera Hadir", `Halaman untuk ${item.title} belum tersedia.`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Train Yourself With The Right Movements</Text>
      </View>
      <FlatList
        data={trainingCategories}
        renderItem={({ item }) => <CategoryCard item={item} onPress={() => handlePress(item)} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}


