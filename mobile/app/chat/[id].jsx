import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../assets/styles/chat.styles';

const API_URL = 'http://192.168.1.104:3000'; // Pastikan IP sesuai

export default function ChatPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id: trainerId, name, profile_picture_url, price } = params;
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [userId, setUserId] = useState(null);
  const flatListRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('user_id'); // Mengambil user_id
        if (!token || !storedUserId) {
          router.replace('/(auth)/sign-in');
          return;
        }
        setUserId(parseInt(storedUserId, 10));
        
        const response = await fetch(`${API_URL}/auth/messages/${trainerId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        setMessages(data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
      } catch (error) {
        console.error("Fetch Messages Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [trainerId]);
  
  const handleSend = async () => {
    if (text.trim().length === 0) return;
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(`${API_URL}/auth/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver_id: trainerId, content: text }),
      });
      setText('');
      // Refresh pesan setelah mengirim
      const response = await fetch(`${API_URL}/auth/messages/${trainerId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setMessages(data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));

    } catch (error) {
      console.error("Send Message Error:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} size="large" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerAction}>
            <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Image source={{ uri: `${API_URL}${profile_picture_url}` }} style={styles.headerImage} />
        <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{name}</Text>
            <TouchableOpacity 
              onPress={() => router.push({ pathname: `/order/${trainerId}`, params: { name, profile_picture_url, price } })} 
              style={styles.orderButton}
            >
              <Ionicons name="calendar-outline" size={16} color="#0d1b2a" />
              <Text style={styles.orderButtonText}>Order</Text>
            </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messageContainer}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: false })}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender_id === userId ? styles.sent : styles.received]}>
            <Text style={[styles.messageText, item.sender_id === userId ? styles.sentText : styles.receivedText]}>
              {item.content}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Ketik pesan..." />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#0d1b2a" />
        </TouchableOpacity>
      </View>
    </View>
  );
}