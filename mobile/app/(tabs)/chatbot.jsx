import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from "@/assets/styles/chatbot.styles.js";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_MODEL = process.env.EXPO_PUBLIC_GROQ_MODEL;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export default function ChatbotPage() {
  const [name, setName] = useState('');
  const scrollViewRef = useRef();
  const [currentChat, setCurrentChat] = useState([
    { role: 'system', content: "Kamu adalah asisten untuk aplikasi gym trainer bernama 'FitBot'. Jawablah dengan sopan dan berikan saran fitness jika diminta." }
  ]);
  const [userInput, setUserInput] = useState('');

  const isNewChat = currentChat.length <= 1;

  const loadUser = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      router.replace('/(auth)/sign-in');
      return;
    }
  
    try {
      const res = await fetch(`http://192.168.1.49:3000/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) throw new Error("Gagal mengambil profil");
  
      const data = await res.json();
      setName(data.name || 'User');
    } catch (err) {
      console.error('Profile fetch error:', err);
      setName('User');
    }
  };
    useEffect(() => {
    loadUser();
  }, []);

  const sendMessage = async (messageText = userInput) => {
    if (!messageText.trim()) return;

    const newMessages = [...currentChat, { role: 'user', content: messageText }];
    setCurrentChat([...newMessages, { role: 'assistant', content: '...' }]);
    setUserInput(''); 

    try {
      const res = await axios.post(API_URL, {
        model: GROQ_MODEL,
        messages: newMessages, 
        temperature: 0.7,
        max_tokens: 512
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        }
      });

      const reply = res.data.choices[0].message.content.trim();
      const updatedChat = [...newMessages, { role: 'assistant', content: reply }];
      setCurrentChat(updatedChat);

    } catch (err) {
      const updatedChat = [...newMessages, { role: 'assistant', content: `Terjadi kesalahan: ${err.message}` }];
      setCurrentChat(updatedChat);
    }
  };


  const SuggestionChip = ({ icon, text }) => (
    <TouchableOpacity style={styles.suggestionChip} onPress={() => sendMessage(text)}>
      {icon}
      <Text style={styles.suggestionText}>{text}</Text>
    </TouchableOpacity>
  );
  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'android' ? 30 : 0} 
    >
      <View style={styles.container}>
        {/* Header Judul */}
        <View style={styles.titleHeader}>
          <Text style={styles.titleText}>Chat Bot</Text>
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#0A59CC" />
        </View>

        {/* Konten Utama */}
        {isNewChat ? (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Hello, {name}! How can I help you today? Please type whatever you want to ask me.
            </Text>
            <View style={styles.suggestionContainer}>
              <SuggestionChip text="Get Advice" icon={<MaterialCommunityIcons name="lightbulb-on-outline" size={18} color="orange" />} />
              <SuggestionChip text="Train" icon={<Ionicons name="barbell-outline" size={18} color="black" />} />
              <SuggestionChip text="Food" icon={<Ionicons name="fast-food-outline" size={18} color="green" />} />
              <SuggestionChip text="Plan" icon={<Ionicons name="calendar-outline" size={18} color="red" />} />
            </View>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            style={styles.chatContainer}
          >
             {currentChat.slice(1).map((msg, index) => (
                <View key={index} style={[styles.message, msg.role === 'user' ? styles.user : styles.bot]}>
                  <Text style={styles.messageText}>{msg.content}</Text>
                </View>
              ))}
          </ScrollView>
        )}

        {/* Area Input */}
        <View style={styles.inputContainer}>
          <TextInput
              style={styles.input}
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Ask anything"
              placeholderTextColor="#9E9E9E"
              onSubmitEditing={() => sendMessage()}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={() => sendMessage()} style={styles.sendButton}>
              <Ionicons name="send-outline" size={26} color="#2D2D2D" />
            </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}