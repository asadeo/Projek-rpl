import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5' },
    header: {
        backgroundColor: '#123459',
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
    earningsCard: {
        backgroundColor: '#123459',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 16,
        marginTop: 16,
    },
    earningsLabel: {
        color: '#fff',
        fontSize: 16,
    },
    earningsAmount: {
        color: 'white',
        fontSize: 34,
        fontWeight: 'bold',
        marginTop: 8,
    },
    // Style untuk tombol aksi
    actionCard: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    actionCardText: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 15,
        color: '#0d1b2a',
    },
    logsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 16,
        marginTop: 24,
        marginBottom: 10,
    },
    logItem: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 8,
    },
    logAvatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        marginRight: 15,
        backgroundColor: '#e2e8f0'
    },
    logTextContainer: {
        flex: 1,
    },
    logName: {
        fontSize: 16,
        fontWeight: '600',
    },
    logDetail: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    emptyLogsText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
});