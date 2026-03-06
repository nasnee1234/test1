import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function VoteScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
          <MaterialIcons name="arrow-back" size={22} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vote</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={() => {}}>
          <MaterialIcons name="refresh" size={18} color="#222" />
        </TouchableOpacity>
      </View>

      <View style={styles.listRoot}>
        <TouchableOpacity
          style={styles.listItem}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('VoteDetail')}
        >
          <View style={styles.listTextWrap}>
            <Text style={styles.listTitle}>โครงการช่วยเปิดปิดนักศึกษาฝึกงาน ปีการศึกษา 2568</Text>
            <Text style={styles.listDate}>02 Mar 2026 (00:00) - 15 Mar 2026 (23:59)</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
      </View>
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
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 0,
  },
  listTextWrap: { flex: 1, paddingRight: 8 },
  listTitle: { fontSize: 14, color: '#222' },
  listDate: { marginTop: 6, fontSize: 12, color: '#777' },
});
