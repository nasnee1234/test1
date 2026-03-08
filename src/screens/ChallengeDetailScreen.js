import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ChallengeDetailScreen({ route, navigation }) {
  const challenge = route.params?.challenge;

  const [modalVisible, setModalVisible] = useState(false);
  const modalTimeoutRef = useRef(null);
  const [modalProject, setModalProject] = useState('');
  const [modalPoints, setModalPoints] = useState(null);

  useEffect(() => {
    return () => {
      if (modalTimeoutRef.current) clearTimeout(modalTimeoutRef.current);
    };
  }, []);

  const handleCloseModal = () => {
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = null;
    }
    setModalVisible(false);
    setModalProject('');
    setModalPoints(null);
    navigation.navigate('Challenge');
  };

  const handleAcceptChallenge = () => {
    setModalProject(challenge?.title || '');
    setModalPoints(challenge?.points || 0);
    setModalVisible(true);

    modalTimeoutRef.current = setTimeout(() => {
      setModalVisible(false);
      setModalProject('');
      setModalPoints(null);
      navigation.navigate('Challenge');
    }, 1400);
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

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.modalClose} onPress={handleCloseModal}>
              <MaterialIcons name="close" size={20} color="#444" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Congrats!</Text>
            <Text style={styles.modalSubtitle}>
              You have successfully completed the challenge
            </Text>
            <View style={styles.modalGraphic}>
              <View style={styles.giftBox}>
                <View style={styles.ribbonHorizontal} />
                <View style={styles.ribbonVertical} />
                <View style={styles.ribbonKnot} />
              </View>
            </View>
            <Text style={styles.modalEarn}>
              {modalPoints != null ? `Earned ${modalPoints} Points` : 'Earned 0 Points'}
            </Text>
            <Text style={styles.modalProject}>
              {modalProject || challenge?.title || 'กิจกรรมตัวอย่าง'}
            </Text>
          </View>
        </View>
      </Modal>
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 6,
  },
  modalGraphic: {
    marginTop: 12,
    marginBottom: 8,
  },
  modalEarn: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
  modalProject: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  giftBox: {
    width: 120,
    height: 80,
    backgroundColor: '#6fd46f',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ribbonHorizontal: {
    position: 'absolute',
    top: '42%',
    left: 0,
    right: 0,
    height: 16,
    backgroundColor: '#f5d75d',
  },
  ribbonVertical: {
    position: 'absolute',
    width: 18,
    height: '100%',
    backgroundColor: '#f5d75d',
    left: '50%',
    transform: [{ translateX: -9 }],
  },
  ribbonKnot: {
    position: 'absolute',
    width: 28,
    height: 20,
    backgroundColor: '#f5d75d',
    top: 8,
    left: '50%',
    transform: [{ translateX: -14 }, { rotate: '20deg' }],
    borderRadius: 4,
  },
});