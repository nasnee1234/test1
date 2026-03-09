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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getDatabase, ref, onValue, push, update, remove } from 'firebase/database';
import app from '../firebase';
import { useUserAuth } from '../context/UserAuthContext';

export default function CalendarScreen({ navigation }) {
  const db = getDatabase(app);
  const { user } = useUserAuth();
  const uid = user?.uid || 'guest_user';

  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [titleInput, setTitleInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [detailInput, setDetailInput] = useState('');

  useEffect(() => {
    const itemsRef = ref(db, `calendarItems/${uid}`);
    const unsub = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setItems(list);
    });
    return () => unsub();
  }, [db, uid]);

  const resetForm = () => {
    setTitleInput('');
    setDateInput('');
    setTimeInput('');
    setDetailInput('');
    setEditingItem(null);
  };

  const openAdd = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setTitleInput(item.title || '');
    setDateInput(item.date || '');
    setTimeInput(item.time || '');
    setDetailInput(item.detail || '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!titleInput.trim()) {
      Alert.alert('ข้อผิดพลาด', 'กรุณาใส่ชื่อนัดหมาย');
      return;
    }

    try {
      const payload = {
        title: titleInput,
        date: dateInput,
        time: timeInput,
        detail: detailInput,
        createdAt: Date.now(),
      };

      if (editingItem) {
        delete payload.createdAt;
        await update(ref(db, `calendarItems/${uid}/${editingItem.id}`), payload);
      } else {
        await push(ref(db, `calendarItems/${uid}`), payload);
      }
        await push(ref(db, 'announcements'), {
          title: `มีนัดหมายใหม่: ${titleInput}`,
          date: dateInput || 'ไม่ระบุวันที่',
          detail: detailInput || 'มีการเพิ่มนัดหมายใหม่ในระบบ',
          type: 'calendar',
          createdAt: Date.now(),
        });

      setModalVisible(false);
      resetForm();
    } catch (err) {
      Alert.alert('Error', err.message || 'บันทึกไม่สำเร็จ');
    }
  };

  const handleDelete = (id) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const ok = window.confirm('ต้องการลบนัดหมายนี้หรือไม่?');
      if (!ok) return;
      (async () => {
        try {
          await remove(ref(db, `calendarItems/${uid}/${id}`));
          Alert.alert('ลบแล้ว', 'ลบนัดหมายเรียบร้อย');
        } catch (err) {
          Alert.alert('Error', err.message || 'เกิดข้อผิดพลาด');
        }
      })();
      return;
    }

    Alert.alert('ลบนัดหมาย', 'ต้องการลบนัดหมายนี้หรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ลบ',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(ref(db, `calendarItems/${uid}/${id}`));
            Alert.alert('ลบแล้ว', 'ลบนัดหมายเรียบร้อย');
          } catch (err) {
            Alert.alert('Error', err.message || 'เกิดข้อผิดพลาด');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemCard}>
        <View style={styles.itemLeft}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="calendar-month" size={22} color="#2563EB" />
          </View>
          <View style={styles.itemTextBox}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemSub}>
              {item.date || '-'} {item.time ? `${item.time}น.` : ''}
            </Text>
            {!!item.detail && <Text style={styles.itemDetail}>{item.detail}</Text>}
          </View>
        </View>

        <View style={styles.itemActions}>
          <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
            <MaterialIcons name="edit" size={18} color="#2563EB" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
            <MaterialIcons name="delete" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>ปฏิทิน</Text>

        <TouchableOpacity style={styles.addButton} onPress={openAdd}>
          <MaterialIcons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <MaterialIcons name="event-busy" size={46} color="#9CA3AF" />
            <Text style={styles.emptyText}>ยังไม่มีนัดหมาย</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'แก้ไขนัดหมาย' : 'เพิ่มนัดหมาย'}
            </Text>

            <TextInput
              placeholder="ชื่อนัดหมาย"
              style={styles.input}
              value={titleInput}
              onChangeText={setTitleInput}
            />
            <TextInput
              placeholder="วันที่ เช่น 12/03/2026"
              style={styles.input}
              value={dateInput}
              onChangeText={setDateInput}
            />
            <TextInput
              placeholder="เวลา เช่น 09:00"
              style={styles.input}
              value={timeInput}
              onChangeText={setTimeInput}
            />
            <TextInput
              placeholder="รายละเอียด"
              style={[styles.input, { height: 80 }]}
              value={detailInput}
              onChangeText={setDetailInput}
              multiline
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { marginRight: 8 }]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={{ color: '#444' }}>ยกเลิก</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#2563EB' }]}
                onPress={handleSave}
              >
                <Text style={{ color: '#fff' }}>บันทึก</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 56,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemRow: {
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemTextBox: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  itemSub: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  itemDetail: {
    marginTop: 6,
    fontSize: 12,
    color: '#4B5563',
  },
  itemActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionBtn: {
    padding: 8,
  },
  emptyWrap: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
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
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  modalBtnRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  modalBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
});