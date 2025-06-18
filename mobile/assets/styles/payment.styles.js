import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    padding: 20,
  },
  consultationInfo: {
    marginBottom: 24,
  },
  consultationText: {
    fontSize: 16,
    color: '#666',
  },
  consultationDate: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  summaryContainer: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    paddingTop: 16,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  paymentMethodContainer: {
    marginBottom: 24,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#eee',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  selectedOption: {
    borderColor: '#0d1b2a',
    backgroundColor: '#eef2f9',
  },
  paymentLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 16,
  },
  paymentName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: '#0d1b2a',
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#0d1b2a',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  confirmButton: {
    backgroundColor: '#0d1b2a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});