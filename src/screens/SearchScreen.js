import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, onValue } from 'firebase/database';
import app from '../firebase';
import { useUserAuth } from '../context/UserAuthContext';

const SEARCH_HISTORY_KEY = 'pnvc_search_history';

export default function SearchScreen({ navigation }) {
  const db = getDatabase(app);
  const { user } = useUserAuth();
  const uid = user?.uid || 'guest_user';

  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [votes, setVotes] = useState([]);
  const [challenges, setChallenges] = useState([]);

  const serviceItems = [
    { id: 'service-home', type: 'service', title: 'หน้าแรก', subtitle: 'เมนูพื้นฐาน' },
    { id: 'service-card', type: 'service', title: 'การ์ด', subtitle: 'เมนูพื้นฐาน' },
    { id: 'service-camera', type: 'service', title: 'กล้อง', subtitle: 'เมนูพื้นฐาน' },
    { id: 'service-challenge', type: 'service', title: 'ชาเลนจ์', subtitle: 'เมนูพื้นฐาน' },
    { id: 'service-setting', type: 'service', title: 'ตั้งค่า', subtitle: 'เมนูพื้นฐาน' },
    { id: 'service-form', type: 'service', title: 'แบบฟอร์ม', subtitle: 'เมนูบริการ' },
    { id: 'service-vote', type: 'service', title: 'โหวต', subtitle: 'เมนูบริการ' },
    { id: 'service-card-right', type: 'service', title: 'บัตร/สิทธิ์', subtitle: 'เมนูบริการ' },
    { id: 'service-calendar', type: 'service', title: 'ปฏิทิน', subtitle: 'เมนูบริการ' },
    { id: 'service-location', type: 'service', title: 'สถานที่', subtitle: 'เมนูบริการ' },
    { id: 'service-activity', type: 'service', title: 'กิจกรรม', subtitle: 'เมนูบริการ' },
  ];

  useEffect(() => {
    loadHistory();

    const votesRef = ref(db, 'votes');
    const unsubVotes = onValue(votesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({
        id: key,
        type: 'vote',
        title: data[key].title || '',
        subtitle: data[key].date || '',
        raw: data[key],
      }));
      setVotes(list);
    });

    const challengeRef = ref(db, `challengeTable/${uid}`);
    const unsubChallenges = onValue(challengeRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((key) => ({
        id: key,
        type: 'challenge',
        title: data[key].title || '',
        subtitle: `${data[key].date || ''} ${data[key].time || ''}`.trim(),
        raw: data[key],
      }));
      setChallenges(list);
    });

    return () => {
      unsubVotes();
      unsubChallenges();
    };
  }, [db, uid]);

  const allItems = useMemo(() => {
    return [...serviceItems, ...votes, ...challenges];
  }, [votes, challenges]);

  const normalizeText = (text) => {
    return String(text || '').toLowerCase().replace(/\s+/g, '').trim();
  };

  const loadHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.log('loadHistory error:', error);
    }
  };

  const saveHistory = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      const newHistory = [
        trimmed,
        ...history.filter((item) => normalizeText(item) !== normalizeText(trimmed)),
      ].slice(0, 10);

      setHistory(newHistory);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.log('saveHistory error:', error);
    }
  };

  const clearHistory = async () => {
    try {
      setHistory([]);
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.log('clearHistory error:', error);
    }
  };

  const removeHistoryItem = async (itemToRemove) => {
    try {
      const newHistory = history.filter((item) => item !== itemToRemove);
      setHistory(newHistory);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.log('removeHistoryItem error:', error);
    }
  };

  const filteredItems = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return [];

    const results = allItems.filter((item) => {
      const title = normalizeText(item.title);
      const subtitle = normalizeText(item.subtitle);
      return title.includes(q) || subtitle.includes(q);
    });

    return results.slice(0, 20);
  }, [allItems, query]);

  const navigateByServiceTitle = (title) => {
    if (title === 'หน้าแรก') {
      navigation.navigate('MainTabs', { screen: 'Home' });
    } else if (title === 'การ์ด' || title === 'บัตร/สิทธิ์') {
      navigation.navigate('MainTabs', { screen: 'Card' });
    } else if (title === 'กล้อง') {
      navigation.navigate('MainTabs', { screen: 'Camera' });
    } else if (title === 'ชาเลนจ์' || title === 'กิจกรรม') {
      navigation.navigate('MainTabs', { screen: 'Challenge' });
    } else if (title === 'ตั้งค่า') {
      navigation.navigate('MainTabs', { screen: 'Setting' });
    } else if (title === 'โหวต') {
      navigation.navigate('Vote');
    } else if (title === 'แบบฟอร์ม') {
      Alert.alert('เมนูแบบฟอร์ม', 'ยังไม่ได้สร้างหน้าแบบฟอร์ม');
    } else if (title === 'ปฏิทิน') {
      Alert.alert('เมนูปฏิทิน', 'ยังไม่ได้สร้างหน้าปฏิทิน');
    } else if (title === 'สถานที่') {
      Alert.alert('เมนูสถานที่', 'ยังไม่ได้สร้างหน้าสถานที่');
    } else {
      Alert.alert('ค้นหาแล้ว', `พบคำว่า "${title}"`);
    }
  };

  const handleItemPress = async (itemOrText) => {
    const isString = typeof itemOrText === 'string';
    const text = isString ? itemOrText : itemOrText.title || '';
    await saveHistory(text);

    if (isString) {
      const q = normalizeText(text);
      const foundItem = allItems.find((item) => {
        const title = normalizeText(item.title);
        const subtitle = normalizeText(item.subtitle);
        return title.includes(q) || subtitle.includes(q);
      });

      if (!foundItem) {
        Alert.alert('ไม่พบข้อมูล', 'ไม่พบรายการที่ค้นหา');
        return;
      }

      return handleItemPress(foundItem);
    }

    const item = itemOrText;

    if (item.type === 'vote') {
      navigation.navigate('VoteDetail', { id: item.id });
      return;
    }

    if (item.type === 'challenge') {
      navigation.navigate('ChallengeDetail', {
        challenge: { id: item.id, ...item.raw },
      });
      return;
    }

    navigateByServiceTitle(item.title);
  };

  const getIconName = (type, title) => {
    if (type === 'vote') return 'how-to-vote';
    if (type === 'challenge') return 'emoji-events';

    if (title === 'แบบฟอร์ม') return 'edit-note';
    if (title === 'โหวต') return 'how-to-vote';
    if (title === 'บัตร/สิทธิ์') return 'badge';
    if (title === 'ปฏิทิน') return 'calendar-month';
    if (title === 'สถานที่') return 'location-on';
    if (title === 'กิจกรรม') return 'event-note';
    if (title === 'หน้าแรก') return 'home';
    if (title === 'การ์ด') return 'credit-card';
    if (title === 'กล้อง') return 'photo-camera';
    if (title === 'ชาเลนจ์') return 'emoji-events';
    if (title === 'ตั้งค่า') return 'settings';

    return 'search';
  };

  const renderSearchItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      activeOpacity={0.8}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.resultMain}>
        <MaterialIcons name={getIconName(item.type, item.title)} size={20} color="#2563EB" />
        <View style={styles.resultTextWrap}>
          <Text style={styles.resultTitle}>{item.title}</Text>
          {!!item.subtitle && <Text style={styles.resultSubtitle}>{item.subtitle}</Text>}
        </View>
      </View>
      <MaterialIcons name="north-west" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <TouchableOpacity
        style={styles.historyMain}
        activeOpacity={0.8}
        onPress={() => {
          setQuery(item);
          handleItemPress(item);
        }}
      >
        <MaterialIcons name="history" size={20} color="#6B7280" />
        <Text style={styles.historyText}>{item}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => removeHistoryItem(item)}>
        <MaterialIcons name="close" size={18} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );

  const showResults = query.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#6B7280" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="ค้นหา"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => handleItemPress(query)}
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <MaterialIcons name="close" size={18} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.goBtn} onPress={() => handleItemPress(query)}>
          <MaterialIcons name="east" size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {!showResults ? (
        <>
          <View style={styles.historyHeaderRow}>
            <Text style={styles.historyHeaderText}>ประวัติการค้นหา</Text>
            {history.length > 0 && (
              <TouchableOpacity onPress={clearHistory}>
                <Text style={styles.clearText}>ล้างทั้งหมด</Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={history}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={renderHistoryItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <MaterialIcons name="history-toggle-off" size={46} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>ยังไม่มีประวัติการค้นหา</Text>
              </View>
            }
          />
        </>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          renderItem={renderSearchItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <MaterialIcons name="search-off" size={46} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>ไม่พบผลลัพธ์</Text>
            </View>
          }
        />
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#F3F4F6',
  },
  backBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flex: 1,
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginLeft: 6,
    borderWidth: 0,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#111827',
    fontSize: 15,
    borderWidth: 0,
    outlineWidth: 0,
    backgroundColor: 'transparent',
  },
  goBtn: {
    width: 40,
    height: 40,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyHeaderRow: {
    paddingHorizontal: 18,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyHeaderText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 30,
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  historyText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#111827',
  },
  resultItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  resultTextWrap: {
    marginLeft: 10,
    flex: 1,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  resultSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  emptyWrap: {
    marginTop: 90,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
});