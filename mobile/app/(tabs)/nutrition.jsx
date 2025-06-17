import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../assets/styles/nutrition.styles';

const nutritionData = [
  {
    id: '1',
    image: require('../../assets/images/asa-steakhouse.png'),
    tags: ['High Protein', 'Low Calorie'],
    title: 'Asa SteakHouse',
    rating: 4.8,
    items: 5,
    location: 'Sekaran, Semarang',
  },
  {
    id: '2',
    image: require('../../assets/images/salad-hambali.png'),
    tags: ['Low Calorie'],
    title: 'Salad Hambali',
    rating: 4.5,
    items: 7,
    location: 'Tembalang, Semarang',
  },
  {
    id: '3',
    image: require('../../assets/images/taichan-mas-fuad.png'),
    tags: ['High Protein'],
    title: 'Taichan Mas Fuad',
    rating: 4.5,
    items: 2,
    location: 'Gunung Pati, Semarang',
  },
  {
    id: '4',
    image: require('../../assets/images/healthyhouse-adriana.png'),
    tags: ['High Protein', 'Low Calorie'],
    title: 'HealthyHouse Adriana',
    rating: 4.5,
    items: 9,
    location: 'Lokasi',
  },
  {
    id: '5',
    image: require('../../assets/images/nutribite.png'),
    tags: ['High Protein', 'Low Calorie'],
    title: 'NutriBite',
    rating: 4.5,
    items: 1,
    location: 'Patemon, Semarang',
  },
  {
    id: '6',
    image: require('../../assets/images/herbivore-house.png'),
    tags: ['Low Calorie'],
    title: 'Herbivore House',
    rating: 4.5,
    items: 15,
    location: 'Lokasi',
  },
  {
    id: '7',
    image: require('../../assets/images/berrylicious-kitchen.png'),
    tags: ['Low Calorie'],
    title: 'Berrylicious Kitchen',
    rating: 4.5,
    items: 15,
    location: 'Lokasi',
  },
  {
    id: '8',
    image: require('../../assets/images/tropimeat.png'),
    tags: ['High Protein', 'Low Calorie'],
    title: 'TropiMeat',
    rating: 4.5,
    items: 10,
    location: 'Lokasi',
  },
];

const NutritionCard = ({ item }) => (
  <View style={styles.card}>
    <Image source={item.image} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <View style={styles.tagsContainer}>
        {item.tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>{tag}</Text>
        ))}
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.infoContainer}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.rating}>{item.rating}</Text>
        <Text style={styles.items}> - {item.items} Item</Text>
      </View>
      <Text style={styles.location}>{item.location}</Text>
    </View>
  </View>
);

export default function NutritionPage() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={nutritionData}
        renderItem={({ item }) => <NutritionCard item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}