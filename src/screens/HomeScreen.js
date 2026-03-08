import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUserAuth } from '../context/UserAuthContext';
import { getDatabase, ref, onValue } from 'firebase/database';
import app from '../firebase';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [votesCount, setVotesCount] = useState(0);
  const { logOut, user } = useUserAuth();

  // ===== Banner โฆษณา / ประชาสัมพันธ์ =====
  // เปลี่ยน image และ link ได้ตามต้องการ
  const newsBanners = [
    {
      id: 1,
      title: 'โครงการอาชีวะจิตอาสา ร่วมด้วยช่วยประชาชน 28-11-67',
      subtitle: 'วิทยาลัยอาชีวศึกษาปัตตานี...',
      image:
        'https://pnvc.ac.th/wp-content/uploads/2024/11/468724628_1138307451423972_3486055832625578998_n-1024x577.jpg',
      link: 'https://pnvc.ac.th/2024/11/29/%e0%b9%82%e0%b8%84%e0%b8%a3%e0%b8%87%e0%b8%81%e0%b8%b2%e0%b8%a3%e0%b8%ad%e0%b8%b2%e0%b8%8a%e0%b8%b5%e0%b8%a7%e0%b8%b0%e0%b8%88%e0%b8%b4%e0%b8%95%e0%b8%ad%e0%b8%b2%e0%b8%aa%e0%b8%b2-%e0%b8%a3%e0%b9%88/',
    },
    {
      id: 2,
      title: 'การนิเทศนักศึกษาเข้าเรียนและฝึกอาชีพในสถานประกอบการ (22-24-11-67)',
      subtitle: 'คณะครูแผนกวิชาการโรงแรม...',
      image:
        'https://pnvc.ac.th/wp-content/uploads/2024/11/468248116_1136214144966636_5825431092961081691_n-1024x768.jpg',
      link: 'https://pnvc.ac.th/2024/11/27/%e0%b8%81%e0%b8%b2%e0%b8%a3%e0%b8%99%e0%b8%b4%e0%b9%80%e0%b8%97%e0%b8%a8%e0%b8%99%e0%b8%b1%e0%b8%81%e0%b8%a8%e0%b8%b6%e0%b8%81%e0%b8%a9%e0%b8%b2%e0%b9%80%e0%b8%82%e0%b9%89%e0%b8%b2%e0%b9%80%e0%b8%a3/',
    },
    {
      id: 3,
      title: 'โครงการ Diana Beach Clean up ทะเลตานี ต้องไม่มีขยะ',
      subtitle: 'ครู พร้อมด้วยนักเรียน นักศึกษา...',
      image:
        'https://pnvc.ac.th/wp-content/uploads/2024/11/467872172_1132878358633548_2096919041289393854_n-1024x768.jpg',
      link: 'https://pnvc.ac.th/2024/11/27/%e0%b9%82%e0%b8%84%e0%b8%a3%e0%b8%87%e0%b8%81%e0%b8%b2%e0%b8%a3-diana-beach-clean-up-%e0%b8%97%e0%b8%b0%e0%b9%80%e0%b8%a5%e0%b8%95%e0%b8%b2%e0%b8%99-%e0%b8%95%e0%b8%ad%e0%b8%87%e0%b9%84%e0%b8%a1/',
    },
  ];

  useEffect(() => {
    const db = getDatabase(app);
    const votesRef = ref(db, 'votes');

    const unsub = onValue(votesRef, (snap) => {
      const data = snap.val() || {};
      const count = Object.keys(data).reduce((sum, k) => {
        const v = data[k];
        return sum + (v && v.votesCount ? Number(v.votesCount) : 0);
      }, 0);

      setVotesCount(count);
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();

      let rootNav = navigation;
      while (rootNav && rootNav.getParent && rootNav.getParent() != null) {
        rootNav = rootNav.getParent();
      }

      if (rootNav && rootNav.reset) {
        rootNav.reset({ index: 0, routes: [{ name: 'Login' }] });
      } else if (rootNav && rootNav.navigate) {
        rootNav.navigate('Login');
      } else {
        navigation.navigate('Login');
      }
    } catch (err) {
      console.error('Logout error:', err);
      Alert.alert('Error', 'ไม่สามารถออกจากระบบได้');
    }
  };

  const openBannerLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('ไม่สามารถเปิดลิงก์ได้', url);
      }
    } catch (error) {
      console.error('Open link error:', error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเปิดลิงก์ได้');
    }
  };

  const services = [
    { label: 'แบบฟอร์ม', icon: 'edit-note', action: () => Alert.alert('เมนูแบบฟอร์ม') },
    { label: 'โหวต', icon: 'how-to-vote', action: () => navigation.navigate('Vote') },
    { label: 'บัตร/สิทธิ์', icon: 'badge', action: () => Alert.alert('เมนูบัตร/สิทธิ์') },
    { label: 'ปฏิทิน', icon: 'calendar-month', action: () => Alert.alert('เมนูปฏิทิน') },
    { label: 'สถานที่', icon: 'place', action: () => Alert.alert('เมนูสถานที่') },
    { label: 'กิจกรรม', icon: 'event-available', action: () => Alert.alert('เมนูกิจกรรม') },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          {user ? (
            user.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarIcon]}>
                <MaterialIcons name="person" size={28} color="#4b5563" />
              </View>
            )
          ) : (
            <View style={[styles.avatar, styles.avatarIcon]}>
              <MaterialIcons name="person" size={28} color="#4b5563" />
            </View>
          )}

          <View style={styles.welcomeBox}>
            <Text style={styles.welcomeText}>ยินดีต้อนรับ</Text>
            <Text style={styles.userNameText}>
              {user?.displayName || 'ผู้ใช้งาน PNVC'}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.topActionBtn}
            onPress={() => navigation.navigate('Search')}>
            <MaterialIcons name="search" size={22} color="#2563EB" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="notifications-none" size={20} color="#1e3a8a" />
          </TouchableOpacity>

          {user ? (
            <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
              <MaterialIcons name="logout" size={20} color="#b91c1c" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ===== โลโก้ / แบนเนอร์สถาบัน ===== */}
        <View style={styles.topBanner}>
          <View style={styles.topBannerTextBox}>
            <Text style={styles.topBannerSmall}>วิทยาลัยอาชีวศึกษา</Text>
            <Text style={styles.topBannerTitle}>PNVC COLLEGE PAGE</Text>
            <Text style={styles.topBannerDesc}>
              ระบบข่าวสาร ประชาสัมพันธ์ กิจกรรม และบริการสำหรับนักเรียน นักศึกษา
            </Text>
          </View>
          
        </View>

        {/* ===== ข่าวสาร / โฆษณา ===== */}
        <Text style={styles.sectionTitle}>ประชาสัมพันธ์</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
          contentContainerStyle={{ paddingRight: 8 }}
        >
          {newsBanners.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              style={styles.bannerCard}
              onPress={() => openBannerLink(item.link)}
            >
              <Image source={{ uri: item.image }} style={styles.bannerImage} />
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerTitle}>{item.title}</Text>
                <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ===== เมนูบริการ ===== */}
        <Text style={styles.sectionTitle}>บริการ</Text>
        <View style={styles.servicesGrid}>
          {services.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.serviceItem}
              activeOpacity={0.85}
              onPress={item.action}
            >
              <View style={styles.serviceIcon}>
                <MaterialIcons name={item.icon} size={28} color="#0f4fcf" />
              </View>
              <Text style={styles.serviceText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ===== นัดหมาย / ประกาศ ===== */}
        <Text style={styles.sectionTitle}>ประกาศ / นัดหมาย</Text>
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentRow}>
            <View style={styles.appointmentIconBox}>
              <MaterialIcons name="campaign" size={24} color="#0f4fcf" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.appointTitle}>ยังไม่มีนัดหมายล่าสุด</Text>
              <Text style={styles.appointSubtitle}>
                เมื่อมีประกาศหรือการนัดหมายใหม่ ระบบจะแสดงในส่วนนี้
              </Text>
            </View>
          </View>
        </View>

        {/* ===== สถิติโหวต ===== */}
        <Text style={styles.sectionTitle}>สถิติการโหวต</Text>
        <View style={styles.voteStatCard}>
          <View style={styles.voteIconCircle}>
            <MaterialIcons name="poll" size={30} color="#ffffff" />
          </View>

          <Text style={styles.voteStatTitle}>จำนวนโหวตทั้งหมด</Text>
          <Text style={styles.voteStatCount}>{votesCount}</Text>
          <Text style={styles.voteStatSub}>รวมคะแนนโหวตจากทุกกิจกรรม</Text>

          <TouchableOpacity
            style={styles.voteStatBtn}
            onPress={() => navigation.navigate('Vote')}
          >
            <Text style={styles.voteStatBtnText}>ดูรายการโหวต</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#eef4ff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eef4ff',
  },

  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#dbeafe',
  },

  avatarIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  welcomeBox: {
    marginLeft: 12,
    flex: 1,
  },

  welcomeText: {
    fontSize: 12,
    color: '#64748b',
  },

  userNameText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },

  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  topBanner: {
    marginTop: 10,
    backgroundColor: '#0f4fcf',
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  topBannerTextBox: {
    flex: 1,
    paddingRight: 12,
  },

  topBannerSmall: {
    fontSize: 12,
    color: '#dbeafe',
    marginBottom: 4,
  },

  topBannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },

  topBannerDesc: {
    marginTop: 8,
    fontSize: 13,
    color: '#e0ecff',
    lineHeight: 19,
  },

  schoolLogo: {
    width: 88,
    height: 88,
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 20,
    marginBottom: 10,
  },

  carousel: {
    marginBottom: 4,
  },

  bannerCard: {
    width: Math.round(width * 0.78),
    height: 170,
    borderRadius: 18,
    marginRight: 14,
    overflow: 'hidden',
    backgroundColor: '#cbd5e1',
  },

  bannerImage: {
    width: '100%',
    height: '100%',
  },

  bannerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  bannerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  bannerSubtitle: {
    color: '#f1f5f9',
    fontSize: 12,
    marginTop: 4,
  },

  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  serviceItem: {
    width: '31%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  serviceIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#eaf2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  serviceText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },

  appointmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  appointmentIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#eaf2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  appointTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },

  appointSubtitle: {
    marginTop: 6,
    color: '#64748b',
    fontSize: 13,
    lineHeight: 18,
  },

  voteStatCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    marginTop: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  voteIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0f4fcf',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  voteStatTitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },

  voteStatCount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 6,
  },

  voteStatSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 6,
  },

  voteStatBtn: {
    marginTop: 14,
    backgroundColor: '#0f4fcf',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },

  voteStatBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});