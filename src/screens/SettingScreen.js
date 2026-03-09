import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUserAuth } from '../context/UserAuthContext';

export default function SettingScreen({ navigation }) {
  const { user, logOut } = useUserAuth();

  const displayName =
    user?.displayName?.trim() ||
    user?.email?.split('@')?.[0] ||
    'ผู้ใช้งาน PNVC';

  const email = user?.email || 'ยังไม่ได้เข้าสู่ระบบ';

  const handleLogout = async () => {
    try {
      await logOut();

      Alert.alert('ออกจากระบบ', 'ออกจากระบบเรียบร้อยแล้ว');

      let rootNav = navigation;
      while (rootNav && rootNav.getParent && rootNav.getParent() != null) {
        rootNav = rootNav.getParent();
      }

      if (rootNav && rootNav.reset) {
        rootNav.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        navigation.navigate('Login');
      }
    } catch (err) {
      console.log('Logout error:', err);
      Alert.alert('Error', 'ไม่สามารถออกจากระบบได้');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>ตั้งค่า</Text>
        <Text style={styles.subtitle}>จัดการข้อมูลผู้ใช้และการเข้าสู่ระบบ</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {displayName?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{email}</Text>

            <View style={styles.statusBadge}>
              <MaterialIcons name="verified-user" size={16} color="#16A34A" />
              <Text style={styles.statusText}>เข้าสู่ระบบแล้ว</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>บัญชีผู้ใช้</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={20} color="#2563EB" />
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoLabel}>อีเมล</Text>
              <Text style={styles.infoValue}>{email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={20} color="#2563EB" />
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoLabel}>ชื่อผู้ใช้</Text>
              <Text style={styles.infoValue}>{displayName}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={22} color="#fff" />
          <Text style={styles.logoutText}>ออกจากระบบ</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>ทั่วไป</Text>

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuRow}>
            <MaterialIcons name="info-outline" size={22} color="#2563EB" />
            <Text style={styles.menuText}>เกี่ยวกับแอป</Text>
            <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuRow}>
            <MaterialIcons name="shield" size={22} color="#2563EB" />
            <Text style={styles.menuText}>ความเป็นส่วนตัว</Text>
            <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
          </TouchableOpacity>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
  },
  profileCard: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2563EB',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  email: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  infoTextWrap: {
    marginLeft: 14,
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  infoValue: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  logoutButton: {
    marginTop: 18,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  logoutText: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  menuRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});