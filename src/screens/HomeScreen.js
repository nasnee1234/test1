import React from 'react';
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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const iconMap = {
    Fill: 'edit',
    Vote: 'how-to-vote',
    Redeem: 'card-giftcard',
    'My Calendar': 'calendar-today',
    Place: 'place',
    Reservation: 'event',
  };
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/44' }}
          style={styles.avatar}
        />
        <Image
          source={{ uri: 'https://via.placeholder.com/80x28?text=Logo' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="search" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="notifications-none" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>What's New</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          <View style={styles.cardSmall} />
          <View style={[styles.cardSmall, { backgroundColor: '#cde' }]} />
          <View style={[styles.cardSmall, { backgroundColor: '#dec' }]} />
        </ScrollView>

        <Text style={styles.sectionTitle}>Service</Text>
        <View style={styles.servicesGrid}>
          {['Fill', 'Vote', 'Redeem', 'My Calendar', 'Place', 'Reservation'].map((s, i) => (
            <TouchableOpacity
              key={i}
              style={styles.serviceItem}
              onPress={() => {
                if (s === 'Vote') navigation.navigate('Vote');
              }}
            >
              <View style={styles.serviceIcon}>
                <MaterialIcons name={iconMap[s]} size={28} color="#0766f7" />
              </View>
              <Text style={styles.serviceText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Upcoming Appointment</Text>
        <View style={styles.appointmentCard}>
          <Text style={styles.appointTitle}>No appointment</Text>
          <Text style={styles.appointSubtitle}>You have no upcoming appointments.</Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f6f8fb', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: {
    height: 72,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#eee' },
  logo: { width: 100, height: 28 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconPlaceholder: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#e6eef8', marginLeft: 8 },
  iconBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#e6eef8', marginLeft: 8, alignItems: 'center', justifyContent: 'center' },

  content: { paddingHorizontal: 16, paddingBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 8, marginBottom: 8 },
  carousel: { marginBottom: 12 },
  cardSmall: {
    width: Math.round(width * 0.7),
    height: 120,
    borderRadius: 12,
    backgroundColor: '#d8eef0',
    marginRight: 12,
  },

  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceItem: { width: '30%', alignItems: 'center', marginVertical: 10 },
  serviceIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff', elevation: 2, alignItems: 'center', justifyContent: 'center' },
  serviceText: { marginTop: 8, textAlign: 'center', fontSize: 12 },

  appointmentCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginTop: 8 },
  appointTitle: { fontSize: 16, fontWeight: '700' },
  appointSubtitle: { marginTop: 6, color: '#666' },

  fab: {
    position: 'absolute',
    bottom: 42,
    left: (width - 64) / 2,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0766f7',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },

  bottomNav: {
    height: 64,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, color: '#333' },
});