import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5' },
    header: {
        backgroundColor: '#0d1b2a',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    backButton: { padding: 5 },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    formContainer: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4a5568',
        marginBottom: 8,
        marginTop: 16,
    },
    inputButton: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    inputText: {
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#0d1b2a',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});