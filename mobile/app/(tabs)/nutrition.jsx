import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../assets/styles/nutrition.styles';

const nutritionData = [
  { id: '1', image: require('../../assets/images/asa-steakhouse.png'), tags: ['High Protein', 'Low Calorie'], title: 'Asa SteakHouse', rating: 4.8, items: 5, location: 'Sekaran, Semarang', },
  { id: '2', image: require('../../assets/images/salad-hambali.png'), tags: ['Low Calorie'], title: 'Salad Hambali', rating: 4.5, items: 7, location: 'Tembalang, Semarang', },
  { id: '3', image: require('../../assets/images/taichan-mas-fuad.png'), tags: ['High Protein'], title: 'Taichan Mas Fuad', rating: 4.5, items: 2, location: 'Gunung Pati, Semarang', },
  { id: '4', image: require('../../assets/images/healthyhouse-adriana.png'), tags: ['High Protein', 'Low Calorie'], title: 'HealthyHouse Adriana', rating: 4.5, items: 9, location: 'Pandanaran, Semarang', },
  { id: '5', image: require('../../assets/images/nutribite.png'), tags: ['High Protein', 'Low Calorie'], title: 'NutriBite', rating: 4.5, items: 1, location: 'Patemon, Semarang', },
  { id: '6', image: require('../../assets/images/herbivore-house.png'), tags: ['Low Calorie'], title: 'Herbivore House', rating: 4.5, items: 15, location: 'Kalisegoro, Semarang', },
  { id: '7', image: require('../../assets/images/berrylicious-kitchen.png'), tags: ['Low Calorie'], title: 'Berrylicious Kitchen', rating: 4.5, items: 15, location: 'Banaran, Semarang', },
  { id: '8', image: require('../../assets/images/tropimeat.png'), tags: ['High Protein', 'Low Calorie'], title: 'TropiMeat', rating: 4.5, items: 10, location: 'Simpang Lima, Semarang', },
];

const NutritionCard = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.card}>{/*
    */}<Image source={item.image} style={styles.cardImage} />{/*
    */}<View style={styles.cardContent}>{/*
      */}<View style={styles.tagsContainer}>{/*
        */}{item.tags.map((tag, index) => (/*
          */<Text key={index} style={styles.tag}>{tag}</Text>/*
        */))}{/*
      */}</View>{/*
      */}<Text style={styles.cardTitleText}>{item.title}</Text>{/*
      */}<View style={styles.infoContainer}>{/*
        */}<Ionicons name="star" size={16} color="#FFD700" />{/*
        */}<Text style={styles.rating}>{item.rating}</Text>{/*
        */}<Text style={styles.items}> - {item.items} Item</Text>{/*
      */}</View>{/*
      */}<Text style={styles.location}>{item.location}</Text>{/*
    */}</View>{/*
  */}</TouchableOpacity>
);

export default function NutritionPage() {
  const router = useRouter(); 
  const insets = useSafeAreaInsets(); 
  const [foods] = useState(nutritionData);
  const [searchQuery, setSearchQuery] = useState(''); 

  const filteredFoods = foods.filter(food =>
    food.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCardPress = (item) => {
    if (item.id === '2') { 
      router.push('/salad-hambali');
    } else {
      Alert.alert('Info', `Anda mengklik ${item.title}`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={"top"}>
      <View style={styles.header}>{/*
        */}<View style={styles.searchContainer}>{/*
          */}<Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />{/*
          */}<TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />{/*
          */}<TouchableOpacity onPress={() => Alert.alert('Filter', 'Fitur filter akan datang!')} style={styles.filterIcon}>{/*
            */}<Ionicons name="filter" size={24} color="#333" />{/*
          */}</TouchableOpacity>{/*
        */}</View>{/*
        */}<TouchableOpacity onPress={() => router.push('/cart')} style={styles.cartIcon}>{/*
          */<Ionicons name="cart-outline" size={24} color="#333" />/*
        */}</TouchableOpacity>{/*
        */}<TouchableOpacity onPress={() => Alert.alert('Menu', 'Fitur menu akan datang!')} style={styles.menuIcon}>{/*
          */<Ionicons name="menu-outline" size={24} color="#333" />/*
        */}</TouchableOpacity>{/*
      */}</View>

      <FlatList
        data={filteredFoods}
        renderItem={({ item }) => <NutritionCard item={item} onPress={() => handleCardPress(item)} />}
        keyExtractor={(item) => item.id}
        numColumns={2} 
        columnWrapperStyle={styles.row} 
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Tidak ada makanan ditemukan.</Text>
        }
      />
    </SafeAreaView>
  );
}