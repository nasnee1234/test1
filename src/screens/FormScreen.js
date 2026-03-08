import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getDatabase, ref, push } from 'firebase/database';
import app from '../firebase';
import { useUserAuth } from '../context/UserAuthContext';

export default function FormScreen({ navigation }) {
  const db = getDatabase(app);
  const { user } = useUserAuth();

  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      !fullName.trim() ||
      !studentId.trim() ||
      !department.trim() ||
      !phone.trim() ||
      !reason.trim()
    ) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    try {
      setLoading(true);

      const formRef = ref(db, 'forms');
      await push(formRef, {
        fullName: fullName.trim(),
        studentId: studentId.trim(),
        department: department.trim(),
        phone: phone.trim(),
        reason: reason.trim(),
        userEmail: user?.email || '',
        userUid: user?.uid || '',
        createdAt: Date.now(),
      });

      Alert.alert('สำเร็จ', 'บันทึกแบบฟอร์มเรียบร้อยแล้ว');

      setFullName('');
      setStudentId('');
      setDepartment('');
      setPhone('');
      setReason('');
    } catch (error) {
      console.log('FORM SAVE ERROR:', error);
      Alert.alert('ผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>แบบฟอร์ม</Text>

        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topCard}>
          <View style={styles.iconWrap}>
            <MaterialIcons name="description" size={30} color="#2563EB" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.topTitle}>แบบฟอร์มขอเข้าร่วมกิจกรรม</Text>
            <Text style={styles.topSubtitle}>
              กรุณากรอกข้อมูลให้ครบถ้วนก่อนส่งแบบฟอร์ม
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>ชื่อ-นามสกุล</Text>
          <TextInput
            style={styles.input}
            placeholder="กรอกชื่อ-นามสกุล"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>รหัสนักศึกษา</Text>
          <TextInput
            style={styles.input}
            placeholder="กรอกรหัสนักศึกษา"
            value={studentId}
            onChangeText={setStudentId}
          />

          <Text style={styles.label}>แผนก / สาขา</Text>
          <TextInput
            style={styles.input}
            placeholder="กรอกแผนกหรือสาขา"
            value={department}
            onChangeText={setDepartment}
          />

          <Text style={styles.label}>เบอร์โทรศัพท์</Text>
          <TextInput
            style={styles.input}
            placeholder="กรอกเบอร์โทรศัพท์"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>เหตุผลที่สมัคร</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="กรอกเหตุผล"
            value={reason}
            onChangeText={setReason}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <MaterialIcons name="save" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>
              {loading ? 'กำลังบันทึก...' : 'บันทึกแบบฟอร์ม'}
            </Text>
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
  header: {
    height: 56,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
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
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  topCard: {
    backgroundColor: '#DBEAFE',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  topSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  textarea: {
    height: 110,
    paddingTop: 12,
  },
  submitButton: {
    marginTop: 22,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});