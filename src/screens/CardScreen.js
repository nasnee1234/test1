import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUserAuth } from '../context/UserAuthContext';

export default function CardScreen() {
  const { user } = useUserAuth();

  const displayName =
    user?.displayName?.trim() ||
    user?.email?.split('@')?.[0] ||
    'PNVC Student';

  const email = user?.email || 'ยังไม่ได้เข้าสู่ระบบ';
  const initial = displayName?.charAt(0)?.toUpperCase() || 'P';

  const studentId = user?.uid
    ? user.uid.slice(0, 10).toUpperCase()
    : 'PNVC-00001';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Card</Text>
        <Text style={styles.headerSubtitle}>บัตรประจำตัวผู้ใช้งาน</Text>

        <View style={styles.cardWrap}>
          <View style={styles.topDecorCircle} />
          <View style={styles.bottomDecorCircle} />

          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.collegeLabel}>PNVC COLLEGE</Text>
              <Text style={styles.cardType}>Student Digital Card</Text>
            </View>

            <View style={styles.logoBadge}>
              <MaterialIcons name="school" size={24} color="#1D4ED8" />
            </View>
          </View>

          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>

            <View style={styles.profileTextWrap}>
              <Text style={styles.name}>{displayName}</Text>
              <Text style={styles.email}>{email}</Text>
              <Text style={styles.memberText}>Member ID: {studentId}</Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>สถานะ</Text>
              <Text style={styles.infoValue}>
                {user ? 'เข้าสู่ระบบแล้ว' : 'Guest'}
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>ประเภท</Text>
              <Text style={styles.infoValue}>นักศึกษา</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.footerLabel}>Issued by</Text>
              <Text style={styles.footerValue}>PNVC App System</Text>
            </View>

            <View style={styles.qrBox}>
              <MaterialIcons name="qr-code" size={52} color="#111827" />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ข้อมูลบัตร</Text>

          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <MaterialIcons name="badge" size={20} color="#2563EB" />
              <View style={styles.detailTextWrap}>
                <Text style={styles.detailLabel}>รหัสบัตร</Text>
                <Text style={styles.detailValue}>{studentId}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <MaterialIcons name="email" size={20} color="#2563EB" />
              <View style={styles.detailTextWrap}>
                <Text style={styles.detailLabel}>อีเมล</Text>
                <Text style={styles.detailValue}>{email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <MaterialIcons name="verified-user" size={20} color="#2563EB" />
              <View style={styles.detailTextWrap}>
                <Text style={styles.detailLabel}>สิทธิ์การใช้งาน</Text>
                <Text style={styles.detailValue}>
                  {user ? 'ผู้ใช้งานระบบปกติ' : 'ผู้เยี่ยมชม'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.noteCard}>
          <MaterialIcons name="info-outline" size={20} color="#2563EB" />
          <Text style={styles.noteText}>
            บัตรนี้เป็นบัตรดิจิทัลสำหรับแอปวิทยาลัย ใช้แสดงข้อมูลผู้ใช้งานที่เข้าสู่ระบบ
          </Text>
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
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    marginTop: 4,
    marginBottom: 18,
    fontSize: 14,
    color: '#6B7280',
  },

  cardWrap: {
    backgroundColor: '#2563EB',
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    marginBottom: 22,
    position: 'relative',
  },
  topDecorCircle: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  bottomDecorCircle: {
    position: 'absolute',
    bottom: -40,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collegeLabel: {
    fontSize: 13,
    color: '#DBEAFE',
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardType: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  profileTextWrap: {
    marginLeft: 14,
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  email: {
    marginTop: 4,
    fontSize: 13,
    color: '#DBEAFE',
  },
  memberText: {
    marginTop: 8,
    fontSize: 13,
    color: '#E0E7FF',
    fontWeight: '600',
  },
  infoGrid: {
    flexDirection: 'row',
    marginTop: 20,
  },
  infoBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#DBEAFE',
  },
  infoValue: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  cardFooter: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLabel: {
    fontSize: 12,
    color: '#DBEAFE',
  },
  footerValue: {
    marginTop: 4,
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
  qrBox: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  detailTextWrap: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  detailValue: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  noteCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  noteText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    color: '#1E3A8A',
    lineHeight: 22,
  },
});