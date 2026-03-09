import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import app from '../firebase';
import { useUserAuth } from '../context/UserAuthContext';

export default function ChallengeDetailScreen({ route, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const modalTimeoutRef = useRef(null);
  const [modalProject, setModalProject] = useState('');
  const [modalPoints, setModalPoints] = useState(null);

  const { user, role } = useUserAuth();
  const uid = user?.uid || 'guest_user';
  const challengeId = route.params?.id || route.params?.challenge?.id;

  useEffect(() => {
    return () => {
      if (modalTimeoutRef.current) clearTimeout(modalTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!challengeId) return;

    const db = getDatabase(app);

    const challengeRef = ref(db, `challengeTable/${challengeId}`);
    const historyRef = ref(db, `challengeHistory/${uid}/${challengeId}`);

    const unsubChallenge = onValue(challengeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setChallenge({ id: challengeId, ...data });
      }
    });

    const unsubHistory = onValue(historyRef, (snapshot) => {
      setAccepted(!!snapshot.val());
    });

    return () => {
      unsubChallenge();
      unsubHistory();
    };
  }, [challengeId, uid]);

  const handleCloseModal = () => {
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = null;
    }
    setModalVisible(false);
    setModalProject('');
    setModalPoints(null);
    navigation.goBack();
  };

  const handleAcceptChallenge = async () => {
    if (!challenge || accepted) return;

    try {
      const db = getDatabase(app);

      await set(ref(db, `challengeHistory/${uid}/${challengeId}`), {
        title: challenge.title || '',
        date: challenge.date || '',
        time: challenge.time || '',
        points: challenge.points || 0,
        acceptedAt: Date.now(),
      });

      setModalProject(challenge?.title || '');
      setModalPoints(challenge?.points || 0);
      setModalVisible(true);

      modalTimeoutRef.current = setTimeout(() => {
        setModalVisible(false);
        setModalProject('');
        setModalPoints(null);
        navigation.goBack();
      }, 1400);
    } catch (error) {
      console.log(error);
    }
  };

  if (!challenge) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerWrap}>
          <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>รายละเอียด Challenge</Text>

        <View style={styles.headerBtn} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.heroIcon}>
            <MaterialIcons name="emoji-events" size={34} color="#2563EB" />
          </View>

          <Text style={styles.title}>{challenge?.title || 'ไม่มีชื่อกิจกรรม'}</Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="event" size={20} color="#2563EB" />
            <Text style={styles.infoText}>
              วันที่: {challenge?.date || '-'} {challenge?.time ? `${challenge.time}น.` : ''}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="stars" size={20} color="#F59E0B" />
            <Text style={styles.infoText}>
              คะแนน: {challenge?.points || 0} คะแนน
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="category" size={20} color="#10B981" />
            <Text style={styles.infoText}>
              ประเภท: {challenge?.status || '-'}
            </Text>
          </View>

          <Text style={styles.desc}>
            หน้านี้ใช้สำหรับแสดงรายละเอียดของ Challenge และให้ผู้ใช้กดรับภารกิจได้
          </Text>

          {role === 'member' ? (
            accepted ? (
              <View style={styles.acceptedBox}>
                <Text style={styles.acceptedText}>รับ Challenge แล้ว</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptChallenge}>
                <Text style={styles.acceptButtonText}>รับ Challenge</Text>
              </TouchableOpacity>
            )
          ) : (
            <View style={styles.adminBox}>
              <Text style={styles.adminText}>บัญชีนี้เป็น admin สำหรับดูรายละเอียด Challenge</Text>
            </View>
          )}

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
    backgroundColor: '#EEF4FF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 60,
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  heroIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 32,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#374151',
    flex: 1,
  },
  desc: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  acceptButton: {
    marginTop: 24,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  acceptedBox: {
    marginTop: 24,
    backgroundColor: '#ECFDF5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  acceptedText: {
    color: '#16A34A',
    fontSize: 15,
    fontWeight: '700',
  },
  adminBox: {
    marginTop: 24,
    backgroundColor: '#EFF6FF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  adminText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 12,
    backgroundColor: '#E5E7EB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
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
    borderRadius: 16,
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
    backgroundColor: '#6FD46F',
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
    backgroundColor: '#F5D75D',
  },
  ribbonVertical: {
    position: 'absolute',
    width: 18,
    height: '100%',
    backgroundColor: '#F5D75D',
    left: '50%',
    transform: [{ translateX: -9 }],
  },
  ribbonKnot: {
    position: 'absolute',
    width: 28,
    height: 20,
    backgroundColor: '#F5D75D',
    top: 8,
    left: '50%',
    transform: [{ translateX: -14 }, { rotate: '20deg' }],
    borderRadius: 4,
  },
});