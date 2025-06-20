import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Background utama
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Untuk memisahkan elemen di header
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#E9E9E9',
  },
  searchContainer: { // Container untuk search bar dan filter icon
    flex: 1, // Memungkinkan search bar mengambil ruang
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Warna background search bar
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 10,
    marginRight: 10, // Jarak ke ikon keranjang
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1, // Agar input field mengisi sisa ruang di container pencarian
    fontSize: 16,
    color: '#333',
    paddingVertical: 0, // Hapus padding vertikal default
  },
  filterIcon: {
    marginLeft: 8, // Jarak dari input ke filter icon
    padding: 5,
  },
  cartIcon: {
    padding: 5,
    marginLeft: 10, // Jarak dari filter ke cart icon
  },
  menuIcon: { // Untuk ikon menu di paling kanan
    padding: 5,
    marginLeft: 10, // Jarak dari cart ke menu icon
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingVertical: 10, // Tambahkan padding vertikal
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10, // Jarak antar baris kartu
  },
  card: {
    flex: 1,
    marginHorizontal: 5, // Disesuaikan untuk 2 kolom
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden', // Penting untuk gambar melengkung
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 10, // Jarak bawah antar card
  },
  cardImage: {
    width: '100%',
    height: 120, // Tinggi gambar
    resizeMode: 'cover', // Pastikan gambar menutupi area
  },
  cardContent: {
    padding: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  tag: {
    fontSize: 10,
    color: '#888',
    marginRight: 4,
    backgroundColor: '#f0f0f0', // Background untuk tag
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  cardTitleText: { // Mengubah nama agar tidak konflik dengan 'title' umum
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    color: '#333',
  },
  items: {
    fontSize: 12,
    color: '#333',
  },
  location: {
    fontSize: 12,
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});