import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderColor: '#E9E9E9',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Konten
  content: {
    flex: 1,
    backgroundColor: '#E9E9E9',
    paddingHorizontal: 10,
  },
  listContainer: {
    paddingVertical: 10,
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%',
  },
  sent: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  received: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  // Tombol Order & Input
  bottomContainer: {
    padding: 10,
    backgroundColor: '#E9E9E9',
  },
  orderButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  orderButtonText: {
    color: '#0d1b2a',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
  },
});