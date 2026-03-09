import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function LocationScreen({ navigation }) {
  const places = [
    {
      id: 1,
      title: 'อาคารเรียนหลัก',
      subtitle: 'อาคารสำหรับเรียนการสอน',
      mapUrl: 'https://maps.google.com/?q=วิทยาลัยอาชีวศึกษาปัตตานี',
      icon: 'school',
    },
    {
      id: 2,
      title: 'ห้องสมุด',
      subtitle: 'พื้นที่อ่านหนังสือและค้นคว้า',
      mapUrl: 'https://maps.google.com/?q=วิทยาลัยอาชีวศึกษาปัตตานี',
      icon: 'local-library',
    },
    {
      id: 3,
      title: 'โรงอาหาร',
      subtitle: 'จุดจำหน่ายอาหารและเครื่องดื่ม',
      mapUrl: 'https://maps.google.com/?q=วิทยาลัยอาชีวศึกษาปัตตานี',
      icon: 'restaurant',
    },
  ];

  const openMap = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert('ไม่สามารถเปิดแผนที่ได้');
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเปิดแผนที่ได้');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>สถานที่</Text>

        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageSubtitle}>สถานที่สำคัญภายในวิทยาลัย</Text>

        {places.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => openMap(item.mapUrl)}
          >
            <View style={styles.iconCircle}>
              <MaterialIcons name={item.icon} size={24} color="#2563EB" />
            </View>

            <View style={styles.textWrap}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>

            <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
});