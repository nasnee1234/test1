import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getDatabase, ref, onValue, push, update, remove } from 'firebase/database';
import app from '../firebase';
import { useUserAuth } from '../context/UserAuthContext';

export default function ActivityScreen({ navigation }) {
  const db = getDatabase(app);
  const { user, role } = useUserAuth();
  const uid = user?.uid || 'guest_user';

  const [activities, setActivities] = useState([]);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [titleInput, setTitleInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [detailInput, setDetailInput] = useState('');

  useEffect(() => {
    const activityRef = ref(db, `activities/${uid}`);
    const unsub = onValue(activityRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setActivities(list);
    });

    return () => unsub();
  }, [uid]);

  const resetForm = () => {
    setTitleInput('');
    setDateInput('');
    setDetailInput('');
    setEditingItem(null);
  };

  const openAdd = () => {
    resetForm();
    setFormModalVisible(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setTitleInput(item.title || '');
    setDateInput(item.date || '');
    setDetailInput(item.detail || '');
    setFormModalVisible(true);
  };

  const openDetail = (item) => {
    setSelectedItem(item);
    setDetailModalVisible(true);
  };

  const handleSave = async () => {
    if (!titleInput.trim()) {
      Alert.alert('ข้อผิดพลาด', 'กรุณาใส่ชื่อกิจกรรม');
      return;
    }

    try {
      const payload = {
        title: titleInput,
        date: dateInput,
        detail: detailInput,
        createdAt: Date.now(),
      };

      if (editingItem) {
        delete payload.createdAt;
        await update(ref(db, `activities/${uid}/${editingItem.id}`), payload);
      } else {
        const newActivityRef = await push(ref(db, `activities/${uid}`), payload);

        await push(ref(db, 'announcements'), {
          title: `มีกิจกรรมใหม่: ${titleInput}`,
          date: dateInput || 'ไม่ระบุวันที่',
          detail: detailInput || 'มีกิจกรรมใหม่ในระบบ',
          type: 'activity',
          relatedId: newActivityRef.key,
          createdAt: Date.now(),
        });
      }

      setFormModalVisible(false);
      resetForm();
    } catch (err) {
      Alert.alert('Error', err.message || 'บันทึกไม่สำเร็จ');
    }
  };

  const handleDelete = (id) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const ok = window.confirm('ต้องการลบกิจกรรมนี้หรือไม่?');
      if (!ok) return;

      (async () => {
        try {
          await remove(ref(db, `activities/${uid}/${id}`));
          Alert.alert('ลบแล้ว', 'ลบกิจกรรมเรียบร้อย');
        } catch (err) {
          Alert.alert('Error', err.message || 'เกิดข้อผิดพลาด');
        }
      })();
      return;
    }

    Alert.alert('ลบกิจกรรม', 'ต้องการลบกิจกรรมนี้หรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ลบ',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(ref(db, `activities/${uid}/${id}`));
            Alert.alert('ลบแล้ว', 'ลบกิจกรรมเรียบร้อย');
          } catch (err) {
            Alert.alert('Error', err.message || 'เกิดข้อผิดพลาด');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardRow}>
      <TouchableOpacity
        activeOpacity={0.92}
        style={styles.newsCard}
        onPress={() => openDetail(item)}
      >
        <View style={styles.newsTop}>
          <View style={styles.iconWrap}>
            <MaterialIcons name="event-available" size={28} color="#2563EB" />
          </View>

          <View style={styles.newsTextWrap}>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsMeta}>{item.date || '-'}</Text>
            {!!item.detail && (
              <Text style={styles.newsExcerpt} numberOfLines={3}>
                {item.detail}
              </Text>
            )}
          </View>

          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </View>
      </TouchableOpacity>

      {role === 'admin' && (
        <View style={styles.adminActions}>
          <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
            <MaterialIcons name="edit" size={18} color="#2563EB" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
            <MaterialIcons name="delete" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>กิจกรรม</Text>

        <View style={styles.headerRight}>
          {role === 'admin' && (
            <TouchableOpacity style={styles.addButton} onPress={openAdd}>
              <MaterialIcons name="add" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <MaterialIcons name="event-busy" size={46} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>ยังไม่มีกิจกรรม</Text>
            <Text style={styles.emptySub}>ข่าวกิจกรรมจะถูกแสดงที่หน้านี้</Text>
          </View>
        }
      />

      <Modal visible={formModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'แก้ไขข่าวกิจกรรม' : 'เพิ่มข่าวกิจกรรม'}
            </Text>

            <TextInput
              placeholder="ชื่อกิจกรรม"
              style={styles.input}
              value={titleInput}
              onChangeText={setTitleInput}
            />

            <TextInput
              placeholder="วันที่จัดกิจกรรม"
              style={styles.input}
              value={dateInput}
              onChangeText={setDateInput}
            />

            <TextInput
              placeholder="รายละเอียด"
              style={[styles.input, { height: 110 }]}
              value={detailInput}
              onChangeText={setDetailInput}
              multiline
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => {
                  setFormModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.cancelText}>ยกเลิก</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleSave}
              >
                <Text style={styles.saveText}>บันทึก</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={detailModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '80%' }]}>
            <View style={styles.detailHeader}>
              <Text style={styles.modalTitle}>รายละเอียดกิจกรรม</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <MaterialIcons name="close" size={22} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.detailHero}>
                <MaterialIcons name="event-available" size={34} color="#2563EB" />
              </View>

              <Text style={styles.detailTitle}>{selectedItem?.title || '-'}</Text>
              <Text style={styles.detailMeta}>{selectedItem?.date || '-'}</Text>
              <Text style={styles.detailBody}>
                {selectedItem?.detail || 'ไม่มีรายละเอียดเพิ่มเติม'}
              </Text>
            </ScrollView>
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
    paddingHorizontal: 14,
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
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  headerRight: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 24,
    paddingTop: 6,
  },
  cardRow: {
    marginBottom: 14,
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    elevation: 2,
  },
  newsTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  newsTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 28,
  },
  newsMeta: {
    marginTop: 8,
    fontSize: 13,
    color: '#6B7280',
  },
  newsExcerpt: {
    marginTop: 10,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  adminActions: {
    position: 'absolute',
    right: 16,
    top: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    elevation: 2,
  },
  emptyWrap: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  emptySub: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 13,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    backgroundColor: '#fff',
  },
  modalBtnRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  modalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: '#eee',
    marginRight: 8,
  },
  saveBtn: {
    backgroundColor: '#2563EB',
  },
  cancelText: {
    color: '#444',
    fontWeight: '600',
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailHero: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 18,
    alignSelf: 'center',
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 32,
  },
  detailMeta: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  detailBody: {
    marginTop: 18,
    fontSize: 15,
    color: '#374151',
    lineHeight: 25,
  },
});