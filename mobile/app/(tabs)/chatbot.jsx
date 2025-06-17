import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from "@/assets/styles/chatbot.styles.js";
import axios from 'axios';
import { GROQ_API_KEY, GROQ_MODEL } from '@env';

const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: 'system', content: "Kamu adalah asisten untuk aplikasi gym trainer. Jawablah dengan sopan dan berikan saran fitness jika diminta." }
  ]);
  const [userInput, setUserInput] = useState('');
  const scrollViewRef = useRef();

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: 'user', content: userInput }];
    setMessages([...newMessages, { role: 'assistant', content: '...' }]);
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
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: `Terjadi kesalahan: ${err.message}` }]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        style={styles.chatContainer}
      >
        {messages.slice(1).map((msg, index) => (
          <Text
            key={index}
            style={[styles.message, msg.role === 'user' ? styles.user : styles.bot]}
          >
            {msg.content}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Tulis pesan..."
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={{ color: 'white' }}>Kirim</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
