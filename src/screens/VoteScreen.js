import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getDatabase, ref, onValue, push, update, remove } from 'firebase/database';
import app from '../firebase';

export default function VoteScreen({ navigation }) {
  const [votes, setVotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const db = getDatabase(app);
  const votesRef = ref(db, 'votes');

  useEffect(() => {
    const unsub = onValue(votesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setVotes(list);
    });
    return () => unsub();
  }, []);

  const openAdd = () => {
    setEditingItem(null);
    setTitleInput('');
    setDateInput('');
    setDescriptionInput('');
    setImageInput('');
    setModalVisible(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setTitleInput(item.title || '');
    setDateInput(item.date || '');
    setDescriptionInput(item.description || '');
    setImageInput(item.image || '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!titleInput.trim()) {
      return Alert.alert('ข้อผิดพลาด', 'กรุณาใส่ชื่อรายการ');
    }

    try {
      const payload = {
        title: titleInput,
        date: dateInput,
        description: descriptionInput || '',
        image: imageInput || '',
        createdAt: Date.now(),
      };

      if (editingItem) {
        delete payload.createdAt;
        await update(ref(db, `votes/${editingItem.id}`), payload);
      } else {
        const newVoteRef = await push(votesRef, payload);

        await push(ref(db, 'announcements'), {
          title: `มีโหวตใหม่: ${titleInput}`,
          date: dateInput || 'ไม่ระบุวันที่',
          detail: descriptionInput || 'มีรายการโหวตใหม่ในระบบ',
          type: 'vote',
          relatedId: newVoteRef.key,
          createdAt: Date.now(),
        });
      }

      setModalVisible(false);
      setTitleInput('');
      setDateInput('');
      setEditingItem(null);
      setDescriptionInput('');
      setImageInput('');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDelete = (id) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const ok = window.confirm('ต้องการลบรายการนี้หรือไม่?');
      if (!ok) return;

      (async () => {
        try {
          await remove(ref(db, `votes/${id}`));
          Alert.alert('ลบแล้ว', 'รายการถูกลบเรียบร้อย');
        } catch (err) {
          Alert.alert('Error', err.message || 'เกิดข้อผิดพลาด');
        }
      })();
      return;
    }

    Alert.alert('ลบรายการ', 'ต้องการลบรายการนี้หรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ลบ',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(ref(db, `votes/${id}`));
            Alert.alert('ลบแล้ว', 'รายการถูกลบเรียบร้อย');
          } catch (err) {
            Alert.alert('Error', err.message || 'เกิดข้อผิดพลาด');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItemRow}>
      <TouchableOpacity
        style={styles.listItemTouchable}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('VoteDetail', { id: item.id })}
      >
        <View style={styles.listTextWrap}>
          <Text style={styles.listTitle}>{item.title}</Text>
          <Text style={styles.listDate}>{item.date}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={20} color="#999" />
      </TouchableOpacity>

      <View style={styles.actionsAbsolute} pointerEvents="box-none">
        <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionButton}>
          <MaterialIcons name="edit" size={18} color="#0b4fe6" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
          <MaterialIcons name="delete" size={18} color="#e23b3b" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
          <MaterialIcons name="arrow-back" size={22} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vote</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={styles.refreshButton}>
            <MaterialIcons name="refresh" size={18} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={openAdd}>
            <MaterialIcons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listRoot}>
        <FlatList
          data={votes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{ color: '#777' }}>ไม่มีรายการ</Text>}
        />
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingItem ? 'แก้ไขรายการ' : 'เพิ่มรายการ'}</Text>

            <TextInput
              placeholder="ชื่อรายการ"
              style={styles.input}
              value={titleInput}
              onChangeText={setTitleInput}
            />
            <TextInput
              placeholder="วันที่ / เวลา"
              style={styles.input}
              value={dateInput}
              onChangeText={setDateInput}
            />
            <TextInput
              placeholder="รายละเอียด"
              style={[styles.input, { height: 80 }]}
              value={descriptionInput}
              onChangeText={setDescriptionInput}
              multiline
            />
            <TextInput
              placeholder="Image URL (optional)"
              style={styles.input}
              value={imageInput}
              onChangeText={setImageInput}
            />

            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <TouchableOpacity
                style={[styles.modalBtn, { marginRight: 8 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: '#444' }}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#0b4fe6' }]}
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
  refreshButton: {
    width: 44,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  listRoot: { padding: 12 },
  listTextWrap: { flex: 1, paddingRight: 8 },
  listTitle: { fontSize: 14, color: '#222' },
  listDate: { marginTop: 6, fontSize: 12, color: '#777' },
  listItemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  listItemTouchable: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 80,
  },
  actionsAbsolute: {
    position: 'absolute',
    right: 12,
    top: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  actionButton: { padding: 8 },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0b4fe6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { width: '88%', backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 8, padding: 10, marginTop: 8 },
  modalBtn: { flex: 1, height: 40, borderRadius: 8, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' },
});