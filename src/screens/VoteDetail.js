import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function VoteDetail({ navigation }) {
  const [choice, setChoice] = useState(null); // 'join' | 'not'
  const [modalVisible, setModalVisible] = useState(false);
  const modalTimeoutRef = useRef(null);

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
    navigation.navigate('Vote');
  };
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
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmoL_gruMInRo6PWJAKJSwEOAqhogfWUY--g&s' }}
          style={styles.banner}
          resizeMode="cover"
        />

        <Text style={styles.title}>โครงการช่วยเปิดปิดนักศึกษาฝึกงาน ปีการศึกษา 2568</Text>
        <Text style={styles.date}>02 Mar 2026 (00:00) - 15 Mar 2026 (23:59)</Text>

        <Text style={styles.sectionHeader}>รายละเอียด</Text>
        <Text style={styles.description}>
          รายละเอียดของโครงการตัวอย่างนี้เป็นข้อความตัวอย่าง เพื่อแสดงเลย์เอาต์ของหน้ารายละเอียดการโหวต
          — คุณสามารถแทนที่ด้วยข้อมูลจริงได้ตามต้องการ
        </Text>

        <Text style={[styles.sectionHeader, { marginTop: 18 }]}>เข้าร่วมการโหวต</Text>
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
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.voteButton, !choice && styles.voteButtonDisabled]}
          onPress={() => {
            if (!choice) return;
            setModalVisible(true);
            modalTimeoutRef.current = setTimeout(() => {
              setModalVisible(false);
              navigation.navigate('Vote');
            }, 1400);
          }}
          activeOpacity={choice ? 0.8 : 1}
        >
          <Text style={styles.voteButtonText}>Vote</Text>
        </TouchableOpacity>
      </View>
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.modalClose} onPress={handleCloseModal}>
              <MaterialIcons name="close" size={20} color="#444" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>ยินดีด้วยนะ!!</Text>
            <Text style={styles.modalSubtitle}>คุณได้โหวตลงคะแนนเสร็จเรียบร้อยแล้ว </Text>
            <View style={styles.modalGraphic}>
              <View style={styles.giftBox}>
                <View style={styles.ribbonHorizontal} />
                <View style={styles.ribbonVertical} />
                <View style={styles.ribbonKnot} />
              </View>
            </View>
            <Text style={styles.modalEarn}>ได้รับ 20 คะแนน</Text>
            <Text style={styles.modalProject}>โครงการช่วยเปิดปิดนักศึกษาฝึกงาน ปีการศึกษา 2568</Text>
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { width: '80%', backgroundColor: '#fff', borderRadius: 12, padding: 18, alignItems: 'center' },
  modalClose: { position: 'absolute', right: 10, top: 8 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginTop: 6 },
  modalSubtitle: { fontSize: 13, color: '#666', textAlign: 'center', marginTop: 6 },
  modalGraphic: { marginTop: 12, marginBottom: 8 },
  modalEarn: { fontSize: 14, fontWeight: '700', marginTop: 6 },
  modalProject: { marginTop: 6, fontSize: 12, color: '#666', textAlign: 'center' },
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
});
