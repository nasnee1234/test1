import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUserAuth } from '../context/UserAuthContext';

export default function SettingScreen() {
  const navigation = useNavigation();
  const { user, logout, logOut } = useUserAuth();

  const handleLogout = async () => {
    try {
      const logoutFn = logout || logOut;
      if (!logoutFn) {
        Alert.alert('ผิดพลาด', 'ไม่พบฟังก์ชันออกจากระบบ');
        return;
      }

      await logoutFn();
      Alert.alert('ออกจากระบบ', 'ออกจากระบบเรียบร้อยแล้ว');

      let rootNav = navigation;
      while (rootNav && rootNav.getParent && rootNav.getParent() != null) {
        rootNav = rootNav.getParent();
      }

      if (rootNav && rootNav.reset) {
        rootNav.reset({ index: 0, routes: [{ name: 'Login' }] });
        return;
      }

      if (rootNav && rootNav.navigate) {
        rootNav.navigate('Login');
        return;
      }

      navigation.navigate('Login');
    } catch (err) {
      console.error('Logout error:', err);
      Alert.alert('Error', 'ไม่สามารถออกจากระบบได้');
    }
  };

  const goToLogin = () => {
    const parentNav = navigation.getParent?.();
    if (parentNav) {
      parentNav.navigate('Login');
    } else {
      navigation.navigate('Login');
    }
  };

  const goToRegister = () => {
    const parentNav = navigation.getParent?.();
    if (parentNav) {
      parentNav.navigate('Register');
    } else {
      navigation.navigate('Register');
    }
  };

  const displayName =
    user?.displayName?.trim() ||
    user?.email?.split('@')?.[0] ||
    'ผู้ใช้งาน';

  const email = user?.email || 'ยังไม่ได้เข้าสู่ระบบ';
  const initial = displayName?.charAt(0)?.toUpperCase() || 'U';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>ตั้งค่า</Text>
        <Text style={styles.headerSubtitle}>จัดการข้อมูลผู้ใช้และการเข้าสู่ระบบ</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileEmail}>{email}</Text>

            <View style={styles.statusBadge}>
              <MaterialIcons
                name={user ? 'verified-user' : 'person-outline'}
                size={16}
                color={user ? '#16A34A' : '#6B7280'}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: user ? '#16A34A' : '#6B7280' },
                ]}
              >
                {user ? 'เข้าสู่ระบบแล้ว' : 'ยังไม่ได้เข้าสู่ระบบ'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>บัญชีผู้ใช้</Text>

          {user ? (
            <>
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
                <MaterialIcons name="logout" size={20} color="#fff" />
                <Text style={styles.logoutButtonText}>ออกจากระบบ</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.guestCard}>
                <MaterialIcons name="lock-outline" size={34} color="#2563EB" />
                <Text style={styles.guestTitle}>ยังไม่ได้เข้าสู่ระบบ</Text>
                <Text style={styles.guestSubtitle}>
                  เข้าสู่ระบบหรือสมัครสมาชิกเพื่อใช้งานฟังก์ชันต่าง ๆ ของแอป
                </Text>
              </View>

              <TouchableOpacity style={styles.loginButton} onPress={goToLogin}>
                <MaterialIcons name="login" size={20} color="#fff" />
                <Text style={styles.loginButtonText}>เข้าสู่ระบบ</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.registerButton} onPress={goToRegister}>
                <MaterialIcons name="person-add" size={20} color="#2563EB" />
                <Text style={styles.registerButtonText}>สมัครสมาชิก</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ทั่วไป</Text>

          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => Alert.alert('ข้อมูลแอป', 'แอป PNVC สำหรับนักเรียนและนักศึกษา')}
            >
              <View style={styles.menuLeft}>
                <MaterialIcons name="info-outline" size={22} color="#2563EB" />
                <Text style={styles.menuText}>เกี่ยวกับแอป</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => Alert.alert('เวอร์ชัน', 'PNVC App Version 1.0.0')}
            >
              <View style={styles.menuLeft}>
                <MaterialIcons name="system-update" size={22} color="#2563EB" />
                <Text style={styles.menuText}>เวอร์ชันแอป</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => Alert.alert('ช่วยเหลือ', 'สามารถเพิ่มหน้าช่วยเหลือภายหลังได้')}
            >
              <View style={styles.menuLeft}>
                <MaterialIcons name="help-outline" size={22} color="#2563EB" />
                <Text style={styles.menuText}>ช่วยเหลือ</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
            </TouchableOpacity>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 18,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2563EB',
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  profileEmail: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F9FAFB',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  infoTextWrap: {
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
  guestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    marginBottom: 14,
  },
  guestTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  guestSubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    textAlign: 'center',
  },
  loginButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  registerButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    marginLeft: 8,
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
  },
  menuItem: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
});