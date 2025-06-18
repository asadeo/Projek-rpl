import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 50, // Sesuaikan untuk status bar
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerImage: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 18, fontWeight: 'bold' },
  headerAction: { padding: 8 },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2f9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  orderButtonText: { marginLeft: 6, color: '#0d1b2a', fontWeight: 'bold' },
  messageContainer: { padding: 8 },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
    maxWidth: '80%',
  },
  sent: {
    backgroundColor: '#0d1b2a',
    alignSelf: 'flex-end',
  },
  received: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  messageText: { fontSize: 16 },
  sentText: { color: '#fff' },
  receivedText: { color: '#000' },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  sendButton: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
});