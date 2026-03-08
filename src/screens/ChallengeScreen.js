import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ChallengeScreen({ navigation }) {
  const challenges = [
    {
      id: '1',
      title: 'เก็บขยะ',
      date: '6/4/2026 09:00น.',
      points: 30,
      type: 'รอบภารกิจ',
    },
    {
      id: '2',
      title: 'ปลูกต้นไม้',
      date: '8/4/2026 13:30น.',
      points: 50,
      type: 'กิจกรรมพิเศษ',
    },
    {
      id: '3',
      title: 'ประหยัดพลังงาน',
      date: '10/4/2026 10:00น.',
      points: 20,
      type: 'สะสมคะแนน',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Challenge</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="refresh" size={22} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn}>
            <MaterialIcons name="add" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {challenges.map((item) => (
          <View key={item.id} style={styles.row}>
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('ChallengeDetail', {
                  challenge: item,
                })
              }
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>
                <Text style={styles.cardPoint}>
                  {item.type} • {item.points} คะแนน
                </Text>
              </View>

              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </TouchableOpacity>

            <View style={styles.actionBox}>
              <TouchableOpacity style={styles.actionBtn}>
                <MaterialIcons name="edit" size={22} color="#2563eb" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn}>
                <MaterialIcons name="delete" size={22} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e5e5',
  },
  header: {
    height: 60,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginRight: 12,
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 96,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#555',
  },
  cardDate: {
    marginTop: 6,
    fontSize: 14,
    color: '#6b7280',
  },
  cardPoint: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  actionBox: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 6,
    marginVertical: 4,
  },
});