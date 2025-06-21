import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../assets/styles/chat.styles'; 

const API_URL = 'http://192.168.1.49:3000'; 

export default function ChatPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id: trainerId, name, profile_picture_url, price } = params;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [userId, setUserId] = useState(null);
  const flatListRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const storedUserId = await AsyncStorage.getItem('user_id');
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

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [trainerId]);

  const handleSend = async () => {
    if (text.trim().length === 0) return;
    const messageContent = text;
    setText('');

    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(`${API_URL}/auth/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver_id: trainerId, content: messageContent }),
      });
      await fetchMessages();
    } catch (error) {
      console.error("Send Message Error:", error);
      Alert.alert("Gagal", "Pesan tidak terkirim.");
      setText(messageContent);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.sender_id === userId ? styles.sent : styles.received]}>
      <Text style={[styles.messageText, item.sender_id === userId ? styles.sentText : styles.receivedText]}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0} 
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.headerInfo}> 
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Image
              source={{ uri: `${API_URL}${profile_picture_url}` }}
              style={styles.headerImage}
            />
            <Text style={styles.headerName}>{name}</Text>
          </View>
          
          {/* Container untuk ikon telepon dan video call */}
          <View style={styles.headerIconsContainer}>
            <TouchableOpacity onPress={() => Alert.alert('Call', 'Memulai panggilan suara...')}>
              <Ionicons name="call-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Video Call', 'Memulai panggilan video...')}>
              <Ionicons name="videocam-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator style={{ flex: 1 }} size="large" />
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              renderItem={renderMessage}
              contentContainerStyle={styles.listContainer}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
            />
          )}
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.orderButton}
            onPress={() => router.push({
              pathname: `/order/${trainerId}`,
              params: { name, profile_picture_url, price }
            })}
          >
            <Text style={styles.orderButtonText}>Order Trainer</Text>
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Message"
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Ionicons name="send" size={24} color="#0d1b2a" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}