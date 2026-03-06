import React, { useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function VoteScreen({ navigation }) {
  // ✅ ตัวอย่างรายการโหวต (นายเปลี่ยนเป็นข้อมูลจริงได้)
  const data = useMemo(
    () => [
      {
        id: "1",
        title: "โครงการช่วยเปิดปิดนักศึกษาฝึกงาน ปีการศึกษา 2568",
        date: "02 Mar 2026 (00:00) - 15 Mar 2026 (23:59)",
        status: "เปิดโหวต",
      },
    ],
    []
  );

  const renderItem = ({ item }) => {
    const isOpen = item.status === "เปิดโหวต";

    return (
      <Pressable
        onPress={() => navigation.navigate("VoteDetail", { item })}
        style={({ pressed }) => [
          styles.card,
          pressed && { transform: [{ scale: 0.99 }], opacity: 0.95 },
        ]}
      >
        <View style={styles.cardLeft}>
          <View style={[styles.badge, isOpen ? styles.badgeOpen : styles.badgeClosed]}>
            <MaterialIcons
              name={isOpen ? "how-to-vote" : "event-busy"}
              size={16}
              color={isOpen ? "#0B6FA4" : "#6B7280"}
            />
            <Text style={[styles.badgeText, isOpen ? styles.badgeTextOpen : styles.badgeTextClosed]}>
              {item.status}
            </Text>
          </View>

          <Text numberOfLines={2} style={styles.title}>
            {item.title}
          </Text>

          <View style={styles.dateRow}>
            <MaterialIcons name="schedule" size={16} color="#64748B" />
            <Text numberOfLines={1} style={styles.date}>
              {item.date}
            </Text>
          </View>
        </View>

        <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* พื้นหลังแบบไล่สี (ทำด้วย 2 เลเยอร์) */}
        <View style={styles.bgTop} />
        <View style={styles.bgBottom} />

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <MaterialIcons name="arrow-back" size={22} color="#fff" />
          </Pressable>

          <Text style={styles.headerTitle}>Vote</Text>

          <View style={{ width: 40 }} />
        </View>

        {/* กล่องสรุปเล็ก ๆ */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>2</Text>
              <Text style={styles.summaryLabel}>เปิดโหวต</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>1</Text>
              <Text style={styles.summaryLabel}>ปิดโหวต</Text>
            </View>
          </View>
        </View>

        {/* List */}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0B6FA4",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1 },

  bgTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 220,
    backgroundColor: "#0B6FA4",
  },
  bgBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 130,
    bottom: 0,
    backgroundColor: "#EAF7FF",
  },

  header: {
    height: 56,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.3,
  },

  summaryCard: {
    marginHorizontal: 14,
    marginTop: 6,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 14,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  summaryItem: { alignItems: "center" },
  summaryNum: { fontSize: 20, fontWeight: "900", color: "#0E3A57" },
  summaryLabel: { marginTop: 2, fontSize: 12, fontWeight: "800", color: "#64748B" },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E2E8F0",
  },

  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 18,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
  },
  cardLeft: { flex: 1, paddingRight: 10 },

  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 8,
  },
  badgeOpen: { backgroundColor: "#E6F6FF" },
  badgeClosed: { backgroundColor: "#F1F5F9" },

  badgeText: { fontSize: 12, fontWeight: "900" },
  badgeTextOpen: { color: "#0B6FA4" },
  badgeTextClosed: { color: "#6B7280" },

  title: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0E3A57",
    lineHeight: 20,
  },
  dateRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  date: {
    flex: 1,
    fontSize: 12,
    color: "#64748B",
    fontWeight: "700",
  },
});