import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getDatabase, ref, onValue } from 'firebase/database';
import app from '../firebase';
import { useUserAuth } from '../context/UserAuthContext';

export default function VoteHistoryScreen({ navigation }) {
  const [historyList, setHistoryList] = useState([]);
  const db = getDatabase(app);
  const { user, role } = useUserAuth();
  const uid = user?.uid || 'guest_user';

  useEffect(() => {
    if (role !== 'member') return;

    const historyRef = ref(db, `voteHistory/${uid}`);
    const unsub = onValue(historyRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      list.sort((a, b) => (b.votedAt || 0) - (a.votedAt || 0));
      setHistoryList(list);
    });

    return () => unsub();
  }, [uid, role]);

  if (role !== 'member') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>หน้านี้สำหรับ member เท่านั้น</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.title}>{item.title || 'ไม่มีชื่อรายการ'}</Text>
      <Text style={styles.date}>{item.date || '-'}</Text>
      <Text style={styles.choice}>
        ผลการโหวต: {item.choice === 'join' ? 'เข้าร่วม' : 'ไม่เข้าร่วม'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>ประวัติการโหวต</Text>

        <View style={styles.headerBtn} />
      </View>

      <FlatList
        data={historyList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>ยังไม่มีประวัติการโหวต</Text>
        }
      />
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
    height: 56,
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 12,
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
    fontWeight: '700',
    color: '#111827',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  date: {
    marginTop: 6,
    fontSize: 12,
    color: '#6B7280',
  },
  choice: {
    marginTop: 8,
    fontSize: 13,
    color: '#16A34A',
    fontWeight: '700',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#777',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
});