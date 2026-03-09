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

export default function AnnouncementAdminScreen({ navigation }) {
  const db = getDatabase(app);

  const [announcements, setAnnouncements] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [titleInput, setTitleInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [detailInput, setDetailInput] = useState('');

  useEffect(() => {
    const annRef = ref(db, 'announcements');

    const unsub = onValue(annRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));

      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setAnnouncements(list);
    });

    return () => unsub();
  }, []);

  const resetForm = () => {
    setTitleInput('');
    setDateInput('');
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
    setDetailInput(item.detail || '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!titleInput.trim()) {
      Alert.alert('ข้อผิดพลาด', 'กรุณาใส่หัวข้อประกาศ');
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

        await update(
          ref(db, `announcements/${editingItem.id}`),
          payload
        );
      } else {
        await push(ref(db, 'announcements'), payload);
      }

      setModalVisible(false);
      resetForm();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('ลบประกาศ', 'ต้องการลบประกาศนี้หรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ลบ',
        style: 'destructive',
        onPress: async () => {
          await remove(ref(db, `announcements/${id}`));
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.detail}>{item.detail}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => openEdit(item)}>
          <MaterialIcons name="edit" size={20} color="#2563EB" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <MaterialIcons name="delete" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>จัดการประกาศ</Text>

        <TouchableOpacity style={styles.addButton} onPress={openAdd}>
          <MaterialIcons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'แก้ไขประกาศ' : 'เพิ่มประกาศ'}
            </Text>

            <TextInput
              placeholder="หัวข้อประกาศ"
              style={styles.input}
              value={titleInput}
              onChangeText={setTitleInput}
            />

            <TextInput
              placeholder="วันที่"
              style={styles.input}
              value={dateInput}
              onChangeText={setDateInput}
            />

            <TextInput
              placeholder="รายละเอียด"
              style={[styles.input, { height: 80 }]}
              multiline
              value={detailInput}
              onChangeText={setDetailInput}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text>ยกเลิก</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
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
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  header: {
    height: 56,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },

  addButton: {
    backgroundColor: '#2563EB',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
  },

  title: {
    fontWeight: '700',
    fontSize: 15,
  },

  date: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },

  detail: {
    marginTop: 6,
    fontSize: 13,
  },

  actions: {
    justifyContent: 'space-between',
    marginLeft: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },

  modalButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: '#eee',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },

  saveBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});