import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../assets/styles/cart.styles';

const cartItems = [
  { id: '1', title: 'Caesar Salad', price: 'Rp. 50.000', quantity: 1 },
  { id: '2', title: 'Greek Salad', price: 'Rp. 55.000', quantity: 2 },
];

const CartItem = ({ item }) => (
  <View style={styles.cartItem}>
    <View style={styles.itemDetails}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <View style={styles.quantityControl}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="remove-circle-outline" size={24} color="#FF6347" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="add-circle" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.itemPriceContainer}>
        <Text style={styles.itemPrice}>{item.price}</Text>
        <TouchableOpacity style={styles.deleteButton}>
             <Ionicons name="trash-bin-outline" size={24} color="#FF6347" />
        </TouchableOpacity>
    </View>
  </View>
);

export default function CartPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/nutrition')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Keranjang</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {cartItems.map(item => <CartItem key={item.id} item={item} />)}
        
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Ringkasan Pesanan</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Subtotal</Text>
            <Text style={styles.summaryText}>Rp. 160.000</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Biaya Pengiriman</Text>
            <Text style={styles.summaryText}>Rp. 15.000</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalText}>Total Pesanan</Text>
            <Text style={styles.totalText}>Rp. 175.000</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}