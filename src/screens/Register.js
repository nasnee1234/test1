import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserAuth } from '../context/UserAuthContext';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useUserAuth();
  const navigation = useNavigation();

  const handleRegister = async () => {
    setError('');

    if (!email || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    if (password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password);
      Alert.alert('สมัครสมาชิกสำเร็จ');
      navigation.navigate('Login');
    } catch (err) {
      const msg =
        err && err.message ? err.message : 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Main')}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹ ย้อนกลับ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.topSection}>
          <Image
            source={require('../assets/pnvc.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.collegeName}>วิทยาลัยอาชีวศึกษาปัตตานี</Text>
          <Text style={styles.subTitle}>Pattani Vocational College</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>สมัครสมาชิก</Text>
          <Text style={styles.desc}>
            สมัครสมาชิกเพื่อเข้าใช้งานระบบข่าวสาร โหวต กิจกรรม และบริการต่าง ๆ
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.inputWrap}>
            <Text style={styles.label}>อีเมล</Text>
            <TextInput
              style={styles.input}
              placeholder="กรอกอีเมล"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>รหัสผ่าน</Text>
            <TextInput
              style={styles.input}
              placeholder="กรอกรหัสผ่าน"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.linkWrap}
          >
            <Text style={styles.linkText}>มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EEF4FF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingBottom: 30,
  },
  header: {
    paddingTop: 6,
    paddingBottom: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
  topSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logo: {
    width: 92,
    height: 92,
    marginBottom: 12,
  },
  collegeName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  subTitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  desc: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 18,
  },
  error: {
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  inputWrap: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D7E0EA',
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#F8FBFF',
    fontSize: 15,
    color: '#111827',
  },
  primaryButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  linkWrap: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default Register;