import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../assets/styles/salad-hambali.styles';
import { useRouter } from 'expo-router';

const menuItems = [
  {
    id: '1',
    title: 'Salad Mix',
    description: 'Deskripsi salad mix',
    price: '45.000',
    image: require('../assets/images/salad-mix.png'),
  },
  {
    id: '2',
    title: 'Caesar Salad',
    description: 'Deskripsi Caesar salad',
    price: '50.000',
    image: require('../assets/images/caesar-salad.png'),
  },
  {
    id: '3',
    title: 'Greek Salad',
    description: 'Deskripsi greek salad',
    price: '55.000',
    image: require('../assets/images/greek-salad.png'),
  },
  {
    id: '4',
    title: 'Garden Salad',
    description: 'Deskripsi garden salad',
    price: '35.000',
    image: require('../assets/images/garden-salad.png'),
  },
  {
    id: '5',
    title: 'Waldorf Salad',
    description: 'Deskripsi waldorf',
    price: '40.000',
    image: require('../assets/images/waldorf-salad.png'),
  },
  {
    id: '6',
    title: 'Cobb Salad',
    description: 'Deskripsi cobb salad',
    price: '55.000',
    image: require('../assets/images/cobb-salad.png'),
  },
];

const MenuItem = ({ item }) => (
  <View style={styles.menuItem}>
    <View style={styles.menuItemDetails}>
      <Text style={styles.menuItemTitle}>{item.title}</Text>
      <Text style={styles.menuItemDescription}>{item.description}</Text>
      <Text style={styles.menuItemPrice}>{item.price}</Text>
    </View>
    <View>
      <Image source={item.image} style={styles.menuItemImage} />
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Tambah</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function SaladHambaliPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                 <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            {/* MODIFIKASI: Tambahkan onPress untuk navigasi ke keranjang */}
            <TouchableOpacity onPress={() => router.push('/cart')} style={styles.cartButton}>
                <Ionicons name="cart-outline" size={28} color="white" />
            </TouchableOpacity>
        </View>
        <Image
          source={require('../assets/images/salad-hambali-banner.png')}
          style={styles.headerImage}
        />
        <View style={styles.headerContent}>
          <Text style={styles.title}>Salad Hambali</Text>
          <Text style={styles.subtitle}>Salad</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>4.8 (500+ ratings)</Text>
          </View>
        </View>

        <View style={styles.promoContainer}>
          <Text style={styles.promoTitle}>Promo Menu</Text>
        </View>
        
        <View style={styles.menuList}>
          {menuItems.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}