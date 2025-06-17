// assets/styles/chatbot.styles.js

import { StyleSheet } from 'react-native';

const colors = {
  background: '#F7F7F8', // Latar belakang utama (putih keabuan)
  textPrimary: '#2D2D2D',  // Warna teks utama
  textSecondary: '#6E6E6E', // Warna teks abu-abu
  userBubble: '#E7F1FF',   // Gelembung chat dari user (biru muda)
  botBubble: '#FFFFFF',    // Gelembung chat dari bot (putih)
  chip: '#FFFFFF',         // Warna chip saran
  border: '#E0E0E0',       // Warna border
};

export const styles = StyleSheet.create({
  // --- Wadah Utama ---
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // --- Header Judul ---
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginRight: 8,
  },
  
  // --- Tampilan Awal (Welcome & Saran) ---
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: -50, // Tarik sedikit ke atas
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  suggestionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12, // Jarak antar chip
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.chip,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 6,
  },

  // --- Area Chat (setelah percakapan dimulai) ---
  chatContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  message: {
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    maxWidth: '85%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  user: {
    backgroundColor: colors.userBubble,
    alignSelf: 'flex-end',
  },
  bot: {
    backgroundColor: colors.botBubble,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  
  // --- Area Input ---
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: colors.botBubble,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    marginLeft: 10,
    padding: 5,
  },
});