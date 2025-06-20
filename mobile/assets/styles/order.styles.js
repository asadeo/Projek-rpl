import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  header: { // TIDAK DIUBAH sesuai permintaan
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#123459',
    paddingBottom: 5,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // --- START: Perubahan untuk "satu background putih" dan "garis pinggir tebal" ---
  mainContentCard: { // Gaya baru untuk membungkus trainerCard dan FlatList
    flex: 1,
    backgroundColor: 'white', // Background putih untuk keseluruhan blok
    marginHorizontal: 5, // Memberi sedikit margin dari pinggir layar
    marginTop: 10, // Memberi jarak dari header
    borderRadius: 5, // Sudut membulat untuk keseluruhan blok
    shadowColor: "#000", // Menambahkan shadow agar terlihat seperti 'card' besar
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden', // Penting untuk memastikan borderRadius bekerja
  },
  listContentContainer: { // Gaya untuk contentContainerStyle FlatList, berada di dalam mainContentCard
    paddingHorizontal: 15, // Padding horizontal untuk konten di dalam card
    paddingTop: 15, // Padding atas
    paddingBottom: 15, // Padding bawah
  },
  trainerCard: {
    // backgroundColor, borderRadius, shadow, elevation dihapus karena ditangani oleh mainContentCard
    paddingBottom: 15, // Padding bawah untuk memisahkan dari item jadwal pertama
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1, // Garis pemisah antara trainer dan jadwal
    borderBottomColor: '#eee',
    marginBottom: 15, // Memberi jarak ke item jadwal pertama
  },
  trainerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#123459', // Menggunakan warna dari header lama
  },
  scheduleItem: {
    backgroundColor: '#fff', // Tetap putih agar jelas item terpisah
    padding: 14,
    borderRadius: 10,
    marginBottom: 10, // Disesuaikan untuk jarak antar item yang lebih rapat
    borderWidth: 2, // Garis pinggir tebal
    borderColor: '#123459', // Warna garis pinggir tebal (menggunakan warna dari header lama)
    // shadow dan elevation dihapus, karena shadow utama di mainContentCard
  },
  scheduleTime: {
    fontSize: 15,
    fontWeight: '600',
    color: '#123459', // Menggunakan warna dari header lama
  },
  scheduleStatus: {
    marginTop: 4,
    fontSize: 14,
  },
  statusBooked: {
    color: '#e74c3c', // TIDAK DIUBAH sesuai permintaan
    fontWeight: 'bold',
  },
  statusEmpty: {
    color: '#2ecc71', // TIDAK DIUBAH sesuai permintaan
    fontWeight: 'bold',
  },
  // --- END: Perubahan untuk "satu background putih" dan "garis pinggir tebal" ---
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  goBackButton: { // TIDAK DIUBAH sesuai permintaan
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#123459',
    borderRadius: 8,
  },
  goBackText: { // TIDAK DIUBAH sesuai permintaan
    color: '#fff',
    fontSize: 16,
  },
});