import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserAuth } from '../context/UserAuthContext';

export default function SettingScreen() {
  const navigation = useNavigation();
  const { user, logOut } = useUserAuth();

  const handleLogout = async () => {
    try {
      await logOut();
      Alert.alert('ออกจากระบบ', 'ออกจากระบบเรียบร้อยแล้ว');

      // reset to Login on the root navigator
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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>SettingScreen</Text>

      {user ? (
        <View style={styles.buttonRow}>
          <Text style={{ marginBottom: 8 }}>สวัสดี, {user.email}</Text>
          <View style={styles.button}>
            <Button title="ออกจากระบบ" onPress={handleLogout} />
          </View>
        </View>
      ) : (
        <View style={styles.buttonRow}>
          <View style={styles.button}>
            <Button
              title="เข้าสู่ระบบ"
              onPress={() => (navigation.getParent ? navigation.getParent().navigate('Login') : navigation.navigate('Login'))}
            />
          </View>

          <View style={styles.button}>
            <Button
              title="สมัครสมาชิก"
              onPress={() => (navigation.getParent ? navigation.getParent().navigate('Register') : navigation.navigate('Register'))}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  text: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  buttonRow: { width: '100%', alignItems: 'center' },
  button: { width: 200, marginVertical: 8 },
});