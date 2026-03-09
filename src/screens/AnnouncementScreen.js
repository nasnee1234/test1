import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getDatabase, ref, onValue } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import app from '../firebase';
import { useUserAuth } from '../context/UserAuthContext';

export default function AnnouncementScreen({ navigation }) {
  const db = getDatabase(app);
  const { user } = useUserAuth();
  const uid = user?.uid || 'guest_user';
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const annRef = ref(db, 'announcements');
    const unsub = onValue(annRef, async (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));

      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setAnnouncements(list);

      await AsyncStorage.setItem(
        `announcement_seen_at_${uid}`,
        String(Date.now())
      );
    });

    return () => unsub();
  }, [db, uid]);

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemTop}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="campaign" size={20} color="#2563EB" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>{item.title || 'ไม่มีหัวข้อ'}</Text>
          <Text style={styles.itemDate}>
            {item.date || 'ไม่ระบุวันที่'}
          </Text>
        </View>
      </View>

      <Text style={styles.itemDetail}>
        {item.detail || 'ไม่มีรายละเอียด'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>ประกาศ / แจ้งเตือน</Text>

        <View style={styles.headerBtn} />
      </View>

      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <MaterialIcons name="notifications-off" size={46} color="#9CA3AF" />
            <Text style={styles.emptyText}>ยังไม่มีประกาศ</Text>
          </View>
        }
      />
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
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  itemTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  itemDate: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  itemDetail: {
    marginTop: 12,
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
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
});