import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  getDatabase,
  ref,
  onValue,
  runTransaction,
  set,
} from 'firebase/database';
import app from '../firebase';
import { useUserAuth } from '../context/UserAuthContext';

export default function VoteDetail({ navigation, route }) {
  const [choice, setChoice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [item, setItem] = useState(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [myChoice, setMyChoice] = useState('');
  const modalTimeoutRef = useRef(null);

  const { user, role } = useUserAuth();
  const uid = user?.uid || 'guest_user';
  const voteId = route?.params?.id;

  useEffect(() => {
    return () => {
      if (modalTimeoutRef.current) clearTimeout(modalTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!voteId) return;

    const db = getDatabase(app);
    const voteRef = ref(db, `votes/${voteId}`);
    const historyRef = ref(db, `voteHistory/${uid}/${voteId}`);

    const unsubVote = onValue(voteRef, (snapshot) => {
      setItem(snapshot.val() || null);
    });

    const unsubHistory = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAlreadyVoted(true);
        setMyChoice(data.choice || '');
      } else {
        setAlreadyVoted(false);
        setMyChoice('');
      }
    });

    return () => {
      unsubVote();
      unsubHistory();
    };
  }, [voteId, uid]);

  const handleCloseModal = () => {
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = null;
    }
    setModalVisible(false);
    navigation.goBack();
  };

  const handleVote = async () => {
    if (!choice) return;
    if (alreadyVoted) {
      Alert.alert('แจ้งเตือน', 'คุณโหวตรายการนี้แล้ว');
      return;
    }

    try {
      const db = getDatabase(app);

      await runTransaction(ref(db, `votes/${voteId}/votesCount`), (current) => {
        return (current || 0) + 1;
      });

      if (choice === 'join') {
        await runTransaction(ref(db, `votes/${voteId}/joinCount`), (current) => {
          return (current || 0) + 1;
        });
      } else {
        await runTransaction(ref(db, `votes/${voteId}/notJoinCount`), (current) => {
          return (current || 0) + 1;
        });
      }

      await set(ref(db, `voteHistory/${uid}/${voteId}`), {
        choice,
        title: item?.title || '',
        date: item?.date || '',
        votedAt: Date.now(),
      });

      setModalVisible(true);

      modalTimeoutRef.current = setTimeout(() => {
        setModalVisible(false);
        navigation.goBack();
      }, 1400);
    } catch (error) {
      Alert.alert('Error', error.message || 'โหวตไม่สำเร็จ');
    }
  };

  if (!voteId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>ไม่พบรหัสรายการโหวต</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerBox}>
          <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
          <MaterialIcons name="arrow-back" size={22} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vote</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={{ uri: item?.image || 'https://via.placeholder.com/350x140' }}
          style={styles.banner}
          resizeMode="cover"
        />

        <Text style={styles.title}>{item?.title || 'ไม่มีชื่อรายการ'}</Text>
        <Text style={styles.date}>{item?.date || '-'}</Text>

        <Text style={styles.sectionHeader}>รายละเอียด</Text>
        <Text style={styles.description}>{item?.description || 'ไม่มีรายละเอียด'}</Text>

        {role === 'member' && (
          <>
            <Text style={[styles.sectionHeader, { marginTop: 18 }]}>เข้าร่วมการโหวต</Text>

            {alreadyVoted ? (
              <View style={styles.votedBox}>
                <Text style={styles.votedText}>
                  โหวตแล้ว ({myChoice === 'join' ? 'เข้าร่วม' : 'ไม่เข้าร่วม'})
                </Text>
              </View>
            ) : (
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => setChoice('join')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radioOuter, choice === 'join' && styles.radioChecked]}>
                    {choice === 'join' && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.optionText}>เข้าร่วม</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.option}
                  onPress={() => setChoice('not')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radioOuter, choice === 'not' && styles.radioChecked]}>
                    {choice === 'not' && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.optionText}>ไม่เข้าร่วม</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {role === 'admin' && (
          <View style={styles.adminBox}>
            <Text style={styles.adminText}>บัญชีนี้เป็น admin ดูรายละเอียดรายการโหวตได้</Text>
          </View>
        )}
      </ScrollView>

      {role === 'member' && !alreadyVoted && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.voteButton, !choice && styles.voteButtonDisabled]}
            onPress={handleVote}
            activeOpacity={choice ? 0.8 : 1}
          >
            <Text style={styles.voteButtonText}>Vote</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.modalClose} onPress={handleCloseModal}>
              <MaterialIcons name="close" size={20} color="#444" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Congrats!</Text>
            <Text style={styles.modalSubtitle}>You have successfully completed the vote</Text>
            <Text style={styles.modalProject}>{item?.title || 'โครงการตัวอย่าง'}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f3f5', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderColor: '#e3e3e3',
  },
  headerLeft: { width: 44, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700' },
  content: { padding: 12, paddingBottom: 100 },
  banner: { width: '100%', height: 160, borderRadius: 8, backgroundColor: '#ddd' },
  title: { fontSize: 16, fontWeight: '700', marginTop: 12 },
  date: { marginTop: 6, fontSize: 12, color: '#777' },
  sectionHeader: { marginTop: 14, fontSize: 14, fontWeight: '700' },
  description: { marginTop: 8, fontSize: 13, color: '#444', lineHeight: 20 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: 'transparent',
  },
  voteButton: {
    height: 44,
    borderRadius: 6,
    backgroundColor: '#0b4fe6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteButtonText: { color: '#fff', fontWeight: '700' },
  voteButtonDisabled: { backgroundColor: '#8aa6ff' },
  optionsRow: { flexDirection: 'row', marginTop: 8, justifyContent: 'flex-start' },
  option: { flexDirection: 'row', alignItems: 'center', marginRight: 18 },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#bbb',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  radioInner: { width: 10, height: 10, backgroundColor: '#0b4fe6', borderRadius: 5 },
  radioChecked: { borderColor: '#0b4fe6' },
  optionText: { marginLeft: 8, fontSize: 14, color: '#222' },
  votedBox: {
    marginTop: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 12,
  },
  votedText: {
    color: '#166534',
    fontWeight: '700',
  },
  adminBox: {
    marginTop: 18,
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 10,
  },
  adminText: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '700',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { width: '80%', backgroundColor: '#fff', borderRadius: 12, padding: 18, alignItems: 'center' },
  modalClose: { position: 'absolute', right: 10, top: 8 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginTop: 6 },
  modalSubtitle: { fontSize: 13, color: '#666', textAlign: 'center', marginTop: 6 },
  modalProject: { marginTop: 10, fontSize: 12, color: '#666', textAlign: 'center' },
});