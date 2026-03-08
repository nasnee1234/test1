import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ChallengeDetailScreen({ route, navigation }) {
  const challenge = route.params?.challenge;

  const handleAcceptChallenge = () => {
    Alert.alert('สำเร็จ', `คุณรับ Challenge "${challenge?.title}" แล้ว`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>รายละเอียด Challenge</Text>

        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{challenge?.title || 'ไม่มีชื่อกิจกรรม'}</Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="event" size={20} color="#2563eb" />
            <Text style={styles.infoText}>
              วันที่: {challenge?.date || '-'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="emoji-events" size={20} color="#f59e0b" />
            <Text style={styles.infoText}>
              คะแนน: {challenge?.points || 0} คะแนน
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="category" size={20} color="#10b981" />
            <Text style={styles.infoText}>
              ประเภท: {challenge?.type || '-'}
            </Text>
          </View>

          <Text style={styles.desc}>
            หน้านี้ใช้สำหรับแสดงรายละเอียดของ Challenge และให้ผู้ใช้กดรับภารกิจได้
          </Text>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={handleAcceptChallenge}
          >
            <Text style={styles.acceptButtonText}>รับ Challenge</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>กลับ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    height: 60,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#374151',
  },
  desc: {
    marginTop: 10,
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 22,
  },
  acceptButton: {
    marginTop: 24,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  backButton: {
    marginTop: 12,
    backgroundColor: '#d1d5db',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
});