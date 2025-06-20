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
    paddingTop: 10,
    borderBottomWidth: 1,
    borderColor: '#E9E9E9',
  },
  backButton: {
    padding: 10,
    marginRight: 8,
  },
    headerInfo: { // New style to group back button, image, and name
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allow this group to take up available space
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
    backgroundColor: '#DCF8C6', // Warna hijau muda khas pesan terkirim (contoh)
    // Atau jika ingin mirip gambar "Oke", bisa gunakan: '#E0E0E0' atau '#D8D8D8'
    // Mari kita pakai '#E0E0E0' untuk menyamakan dengan gambar "Oke"
    // Tapi jika ingin beda dari received, '#DCF8C6' adalah pilihan umum
    // Berdasarkan gambar, "Oke" terlihat seperti `#E0E0E0` atau sejenisnya
    backgroundColor: '#E0E0E0',
    alignSelf: 'flex-end',
    borderWidth: 0, // Hapus border jika ingin terlihat menyatu seperti di gambar
    // borderColor: '#E0E0E0', // Tidak perlu jika borderWidth 0
  },
  received: {
    backgroundColor: '#FFFFFF', // Tetap putih sesuai gambar "Halo"
    alignSelf: 'flex-start',
    borderWidth: 0, // Hapus border
    // borderColor: '#E0E0E0', // Tidak perlu jika borderWidth 0
  },
  messageText: {
    fontSize: 16,
    color: '#000', // Warna teks default
    // Pastikan warna teks untuk dikirim dan diterima tidak terlalu berbeda jika background sama
    // Jika background berbeda, sentText/receivedText bisa disesuaikan
  },
  // Tombol Order & Input
  bottomContainer: {
    padding: 10,
    backgroundColor: '#E9E9E9',
  },
  orderButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#123459',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  orderButtonText: {
    color: '#fff',
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
  headerIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto', // PUSH to the rightmost end
    gap: 20, // Menggunakan gap lagi, karena ini lebih modern. Jika tidak berfungsi, kembali ke marginRight.
  },
});