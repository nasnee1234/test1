import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUserAuth } from '../context/UserAuthContext';

export default function CardRightScreen({ navigation }) {
  const { user } = useUserAuth();

  const displayName =
    user?.displayName?.trim() ||
    user?.email?.split('@')?.[0] ||
    'ผู้ใช้งาน PNVC';

  const email = user?.email || 'ยังไม่ได้เข้าสู่ระบบ';
  const userId = user?.uid ? user.uid.slice(0, 10).toUpperCase() : 'PNVC-GUEST';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>บัตร / สิทธิ์</Text>

        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageSubtitle}>ข้อมูลสิทธิ์การใช้งานของผู้ใช้</Text>

        <View style={styles.mainCard}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="badge" size={34} color="#2563EB" />
          </View>

          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.badge}>
            <MaterialIcons name="verified-user" size={18} color="#16A34A" />
            <Text style={styles.badgeText}>
              {user ? 'ผู้ใช้งานที่เข้าสู่ระบบแล้ว' : 'ผู้เยี่ยมชม'}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={20} color="#2563EB" />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>ชื่อผู้ใช้</Text>
              <Text style={styles.infoValue}>{displayName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={20} color="#2563EB" />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>อีเมล</Text>
              <Text style={styles.infoValue}>{email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialIcons name="vpn-key" size={20} color="#2563EB" />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>รหัสผู้ใช้งาน</Text>
              <Text style={styles.infoValue}>{userId}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialIcons name="workspace-premium" size={20} color="#2563EB" />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoLabel}>สิทธิ์</Text>
              <Text style={styles.infoValue}>
                {user ? 'สมาชิกวิทยาลัย' : 'Guest'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  pageSubtitle: {
    marginBottom: 16,
    fontSize: 14,
    color: '#6B7280',
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  email: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
  },
  badge: {
    marginTop: 14,
    backgroundColor: '#F0FDF4',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  infoTextBox: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  infoValue: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
});