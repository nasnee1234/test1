import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// ======= ปรับจำนวนข่าวด้านล่าง (อยากกี่ข่าว) =======
const NEWS_LIST_COUNT = 4;

// ======= แก้ URL รูป/หัวข้อข่าว/ลิงก์ข่าวตรงนี้ =======
const DEFAULT_NEWS = [
  {
    id: "1",
    image:
      "https://pnvc.ac.th/wp-content/uploads/2024/11/468724628_1138307451423972_3486055832625578998_n-1024x577.jpg",
    title: "โครงการอาชีวะจิตอาสา ร่วมด้วยช่วยประชาชน 28-11-67",
    url: "https://pnvc.ac.th/2024/11/29/%e0%b9%82%e0%b8%84%e0%b8%a3%e0%b8%87%e0%b8%81%e0%b8%b2%e0%b8%a3%e0%b8%ad%e0%b8%b2%e0%b8%8a%e0%b8%b5%e0%b8%a7%e0%b8%b0%e0%b8%88%e0%b8%b4%e0%b8%95%e0%b8%ad%e0%b8%b2%e0%b8%aa%e0%b8%b2-%e0%b8%a3%e0%b9%88/",
  },
  {
    id: "2",
    image:
      "https://pnvc.ac.th/wp-content/uploads/2024/11/468248116_1136214144966636_5825431092961081691_n-1024x768.jpg",
    title: "การนิเทศนักศึกษาเข้าเรียนและฝึกอาชีพในสถานประกอบการ (22-24-11-67)",
    url: "https://pnvc.ac.th/2024/11/27/%e0%b8%81%e0%b8%b2%e0%b8%a3%e0%b8%99%e0%b8%b4%e0%b9%80%e0%b8%97%e0%b8%a8%e0%b8%99%e0%b8%b1%e0%b8%81%e0%b8%a8%e0%b8%b6%e0%b8%81%e0%b8%a9%e0%b8%b2%e0%b9%80%e0%b8%82%e0%b9%89%e0%b8%b2%e0%b9%80%e0%b8%a3/",
  },
  {
    id: "3",
    image:
      "https://pnvc.ac.th/wp-content/uploads/2024/11/468361493_1136063811648336_4719445166775645091_n.jpg",
    title: "พิธีถวายราชสดุดี เนื่องใน “วันสมเด็จพระมหาธีรราชเจ้า” 67-11-25",
    url: "https://pnvc.ac.th/2024/11/27/%e0%b8%9e%e0%b8%b4%e0%b8%98%e0%b8%b5%e0%b8%96%e0%b8%a7%e0%b8%b2%e0%b8%a2%e0%b8%a3%e0%b8%b2%e0%b8%8a%e0%b8%aa%e0%b8%94%e0%b8%b8%e0%b8%94%e0%b8%b5-%e0%b9%80%e0%b8%99%e0%b8%b7%e0%b9%88%e0%b8%ad%e0%b8%87/",
  },
  {
    id: "4",
    image:
      "https://pnvc.ac.th/wp-content/uploads/2024/11/467872172_1132878358633548_2096919041289393854_n-1024x768.jpg",
    title: "โครงการ Diana Beach Clean up ทะเลตานี ต้องไม่มีขยะ",
    url: "https://pnvc.ac.th/2024/11/27/%e0%b9%82%e0%b8%84%e0%b8%a3%e0%b8%87%e0%b8%81%e0%b8%b2%e0%b8%a3-diana-beach-clean-up-%e0%b8%97%e0%b8%b0%e0%b9%80%e0%b8%a5%e0%b8%95%e0%b8%b2%e0%b8%99-%e0%b8%95%e0%b8%ad%e0%b8%87%e0%b9%84%e0%b8%a1/",
  },
  {
    id: "5",
    image:
      "https://pnvc.ac.th/wp-content/uploads/2024/08/456286521_1065571652030886_8161876107271057457_n-1024x683.jpg",
    title:
      "วิทยาลัยอาชีวศึกษาปัตตานี ดำเนินการประเมินคุณภาพการศึกษาของสถานศึกษา ตามมาตรฐานการบริหารโครงการพัฒนาศูนย์ความเป็นเลิศทางการอาชีวศึกษา Excellent Center สาขาวิชาอาหารและโภชนาการ ปีการศึกษา 2566",
    url: "https://pnvc.ac.th/2024/08/21/%e0%b8%a7%e0%b8%b4%e0%b8%97%e0%b8%a2%e0%b8%b2%e0%b8%a5%e0%b8%b1%e0%b8%a2%e0%b8%ad%e0%b8%b2%e0%b8%8a%e0%b8%b5%e0%b8%a7%e0%b8%a8%e0%b8%b6%e0%b8%81%e0%b8%a9%e0%b8%b2%e0%b8%9b%e0%b8%b1%e0%b8%95%e0%b8%95/",
  },
  {
    id: "6",
    image:
      "https://pnvc.ac.th/wp-content/uploads/2024/08/456381303_1066086095312775_6462305321626680365_n-1024x683.jpg",
    title:
      "กิจกรรม “เข้าแถวเคารพธงชาติ สร้างความจงรักภักดีต่อสถาบันชาติ ศาสนา และพระมหากษัตริย์”",
    url: "https://pnvc.ac.th/2024/08/21/%e0%b8%81%e0%b8%b4%e0%b8%88%e0%b8%81%e0%b8%a3%e0%b8%a3%e0%b8%a1-%e0%b9%80%e0%b8%82%e0%b9%89%e0%b8%b2%e0%b9%81%e0%b8%96%e0%b8%a7%e0%b9%80%e0%b8%84%e0%b8%b2%e0%b8%a3%e0%b8%9e%e0%b8%98%e0%b8%87/",
  },
];

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256&q=80";

const DEFAULT_CREST =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Seal_of_a_university_%28example%29.svg/512px-Seal_of_a_university_%28example%29.svg.png";

export default function HomeScreen({
  navigation, // ✅ สำคัญ: รับ navigation มาจาก Stack
  news = DEFAULT_NEWS,
  avatarUrl = DEFAULT_AVATAR,
  crestUrl = DEFAULT_CREST,

  onPressLogout = () => console.log("logout"),
  onPressBell = () => console.log("bell"),
  onPressProfile = () => console.log("profile"),
}) {
  const listRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const services = useMemo(
    () => [
      { key: "vote", label: "ระบบโหวต", icon: "checkmark-done" },
      { key: "timetable", label: "ตารางเรียน", icon: "calendar" },
      { key: "mail", label: "อีเมล", icon: "mail" },
      { key: "gpa", label: "GPA", icon: "document-text" },
      { key: "pay", label: "ชำระเงิน", icon: "cash" },
      { key: "welfare", label: "สวัสดิการ", icon: "people" },
      { key: "contact", label: "Contact", icon: "call" },
      { key: "petition", label: "คำร้องเรียน\nออนไลน์", icon: "create" },
    ],
    []
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length) setActiveIndex(viewableItems[0].index ?? 0);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  // ✅ เปิดเว็บข่าว
  const openNewsUrl = async (item) => {
    const url = item?.url?.trim();
    if (!url) {
      Alert.alert("ยังไม่มีลิงก์ข่าว", "ข่าวนี้ยังไม่ได้ใส่ URL ของหน้าเว็บข่าว");
      return;
    }
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert("เปิดลิงก์ไม่ได้", url);
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถเปิดลิงก์ได้");
    }
  };

  // ✅ กด service แล้วไปหน้าอื่น
  const handleServicePress = (key) => {
    if (key === "vote") {
      navigation.navigate("Vote"); // ✅ ไป VoteScreen (อยู่ใน HomeStack แล้ว)
      return;
    }

    // เมนูอื่นค่อยทำต่อ
    Alert.alert("ยังไม่ทำเมนูนี้", `เมนู: ${key}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.bgTop} />
        <View style={styles.bgBottom} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ===== Header ===== */}
          <View style={styles.header}>
            <Pressable onPress={onPressProfile} style={styles.avatarWrap}>
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            </Pressable>

            <View style={styles.crestWrap}>
              <Image source={{ uri: crestUrl }} style={styles.crest} />
            </View>

            <View style={styles.headerRight}>
              <Pressable onPress={onPressLogout} style={styles.headerIconBtn}>
                <Ionicons name="log-out-outline" size={22} color="#ffffff" />
              </Pressable>
              <Pressable onPress={onPressBell} style={styles.headerIconBtn}>
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#ffffff"
                />
              </Pressable>
            </View>
          </View>

          {/* ===== News Carousel ===== */}
          <View style={styles.bannerOuter}>
            <View style={styles.bannerCard}>
              <FlatList
                ref={listRef}
                data={news}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.newsSlide}
                    onPress={() => openNewsUrl(item)}
                  >
                    <Image source={{ uri: item.image }} style={styles.bannerImage} />
                    <View style={styles.newsTitleBar}>
                      <Text numberOfLines={1} style={styles.newsTitle}>
                        {item.title}
                      </Text>
                    </View>
                    <View style={styles.newsBadge}>
                      <Ionicons name="newspaper" size={14} color="#0E3A57" />
                    </View>
                  </Pressable>
                )}
              />

              <View style={styles.dotsRow}>
                {news.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i === activeIndex ? styles.dotActive : styles.dotInactive,
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* ===== Service ===== */}
          <Text style={styles.sectionTitle}>Service</Text>

          <View style={styles.grid}>
            {services.map((s) => (
              <Pressable
                key={s.key}
                onPress={() => handleServicePress(s.key)} // ✅ สำคัญ
                style={styles.gridItem}
              >
                <View style={styles.circleIcon}>
                  <Ionicons name={s.icon} size={22} color="#0E3A57" />
                </View>
                <Text style={styles.gridLabel}>{s.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* ===== News List ===== */}
          <View style={styles.newsListWrap}>
            <View style={styles.newsListHeader}>
              <Text style={styles.newsListTitle}>ข่าวล่าสุด</Text>
              <Pressable onPress={() => console.log("see all")}>
                <Text style={styles.seeAllText}>ดูทั้งหมด</Text>
              </Pressable>
            </View>

            {news.slice(0, NEWS_LIST_COUNT).map((item) => (
              <Pressable
                key={item.id}
                style={styles.newsCard}
                onPress={() => openNewsUrl(item)}
              >
                <Image source={{ uri: item.image }} style={styles.newsThumb} />
                <View style={styles.newsTextWrap}>
                  <Text numberOfLines={2} style={styles.newsHeadline}>
                    {item.title}
                  </Text>
                  <View style={styles.newsMetaRow}>
                    <Ionicons name="time-outline" size={14} color="#5B7281" />
                    <Text style={styles.newsMetaText}>อ่านต่อบนเว็บไซต์</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#90A4AE" />
              </Pressable>
            ))}
          </View>

          <View style={{ height: 18 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B6FA4" },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 10 },

  bgTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 260,
    backgroundColor: "#0B6FA4",
  },
  bgBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 150,
    bottom: 0,
    backgroundColor: "#EAF7FF",
  },

  header: {
    height: 64,
    paddingHorizontal: 16,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  avatar: { width: "100%", height: "100%" },

  crestWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  crest: { width: 40, height: 40, resizeMode: "contain" },

  headerRight: { flexDirection: "row", gap: 10 },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  bannerOuter: { paddingHorizontal: 14, marginTop: 6 },
  bannerCard: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    elevation: 3,
  },
  newsSlide: { width: width - 28, height: 200 },
  bannerImage: { width: "100%", height: "100%", resizeMode: "cover" },
  newsTitleBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.38)",
  },
  newsTitle: { color: "#fff", fontSize: 14, fontWeight: "800" },
  newsBadge: {
    position: "absolute",
    left: 10,
    top: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  dotsRow: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: { width: 7, height: 7, borderRadius: 7 },
  dotActive: { backgroundColor: "#FFFFFF" },
  dotInactive: { backgroundColor: "rgba(255,255,255,0.55)" },

  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 18,
    fontSize: 22,
    fontWeight: "800",
    color: "#0E3A57",
  },
  grid: {
    paddingHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: { width: "25%", alignItems: "center", paddingVertical: 10 },
  circleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  gridLabel: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center",
    color: "#0E3A57",
    fontWeight: "700",
  },

  newsListWrap: { marginTop: 14, marginHorizontal: 14 },
  newsListHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  newsListTitle: { fontSize: 16, fontWeight: "900", color: "#0E3A57" },
  seeAllText: { fontSize: 12, fontWeight: "800", color: "#0B6FA4" },

  newsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
  },
  newsThumb: {
    width: 110,
    height: 74,
    borderRadius: 12,
    resizeMode: "cover",
    backgroundColor: "#E6EEF5",
  },
  newsTextWrap: { flex: 1, marginLeft: 10, marginRight: 8 },
  newsHeadline: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0E3A57",
    lineHeight: 18,
  },
  newsMetaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  newsMetaText: { fontSize: 11, color: "#5B7281", fontWeight: "700" },
});