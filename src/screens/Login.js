import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserAuth } from '../context/UserAuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUserAuth();
  const navigation = useNavigation();
  const topOffset = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 10;

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigation.navigate('Main');
    } catch (err) {
      const msg = err && err.message ? err.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { top: topOffset }]}>
        <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.backButton}>
          <Text style={styles.backText}>‹ ย้อนกลับ</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>เข้าสู่ระบบ</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="อีเมล"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="รหัสผ่าน"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonWrap}>
        <Button title={loading ? 'กำลังเข้า...' : 'เข้าสู่ระบบ'} onPress={handleLogin} disabled={loading} />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
        <Text style={styles.linkText}>ยังไม่มีบัญชี? สมัครสมาชิก</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 },
  buttonWrap: { marginTop: 8 },
  error: { color: '#c00', marginBottom: 12, textAlign: 'center' },
  registerLink: { marginTop: 12, alignItems: 'center' },
  linkText: { color: '#0766f7' },
  header: { position: 'absolute', top: 10, left: 10 },
  backButton: { padding: 8 },
  backText: { color: '#0766f7', fontSize: 16 },
});

export default Login;