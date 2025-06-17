import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';

export default function BenchPressPage() {
  const router = useRouter();
  const video = React.useRef(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bench Press</Text>
      </View>
      <View style={styles.videoContainer}>
        <Video
          ref={video}
          style={styles.video}
          // --- MODIFIKASI: Menggunakan video dari aset lokal ---
          source={require('../../assets/videos/bench-press-tutorial.mp4')}
          useNativeControls
          resizeMode="contain"
          isLooping
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.descriptionTitle}>Tutorial</Text>
        <Text style={styles.descriptionText}>
          1. Lie flat on your back on a bench.
          {'\n'}2. Grip the bar with hands just wider than shoulder-width apart.
          {'\n'}3. Bring the bar slowly down to your chest.
          {'\n'}4. Push the bar up until you've fully extended your arms.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
    },
    video: {
        alignSelf: 'center',
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        padding: 24,
    },
    descriptionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
    },
});