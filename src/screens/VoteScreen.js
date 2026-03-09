import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  StatusBar,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  getDatabase,
  ref,
  onValue,
  push,
  update,
  remove,
} from "firebase/database";
import app from "../firebase";
import { useUserAuth } from "../context/UserAuthContext";

export default function VoteScreen({ navigation }) {
  const { user, role } = useUserAuth();
  const uid = user?.uid || "guest_user";

  const db = getDatabase(app);
  const votesRef = ref(db, "votes");

  const [votes, setVotes] = useState([]);
  const [voteHistory, setVoteHistory] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [titleInput, setTitleInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  useEffect(() => {
    const unsubVotes = onValue(votesRef, (snap) => {
      const data = snap.val() || {};
      const list = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setVotes(list);
    });

    const historyRef = ref(db, `voteHistory/${uid}`);
    const unsubHistory = onValue(historyRef, (snap) => {
      setVoteHistory(snap.val() || {});
    });

    return () => {
      unsubVotes();
      unsubHistory();
    };
  }, [uid]);

  const openAdd = () => {
    setEditingItem(null);
    setTitleInput("");
    setDateInput("");
    setDescriptionInput("");
    setImageInput("");
    setModalVisible(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setTitleInput(item.title || "");
    setDateInput(item.date || "");
    setDescriptionInput(item.description || "");
    setImageInput(item.image || "");
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!titleInput.trim()) {
      return Alert.alert("ข้อผิดพลาด", "กรุณาใส่ชื่อรายการ");
    }

    try {
      const payload = {
        title: titleInput,
        date: dateInput,
        description: descriptionInput || "",
        image: imageInput || "",
        createdAt: Date.now(),
      };

      if (editingItem) {
        delete payload.createdAt;
        await update(ref(db, `votes/${editingItem.id}`), payload);
      } else {
        const newVoteRef = await push(votesRef, payload);

        await push(ref(db, "announcements"), {
          title: `มีโหวตใหม่: ${titleInput}`,
          date: dateInput || "ไม่ระบุวันที่",
          detail: descriptionInput || "มีรายการโหวตใหม่ในระบบ",
          type: "vote",
          relatedId: newVoteRef.key,
          createdAt: Date.now(),
        });
      }

      setModalVisible(false);
      setEditingItem(null);
      setTitleInput("");
      setDateInput("");
      setDescriptionInput("");
      setImageInput("");
    } catch (err) {
      Alert.alert("Error", err.message || "บันทึกไม่สำเร็จ");
    }
  };

  const handleDelete = (id) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const ok = window.confirm("ต้องการลบรายการนี้หรือไม่?");
      if (!ok) return;

      (async () => {
        try {
          await remove(ref(db, `votes/${id}`));
          Alert.alert("ลบแล้ว", "รายการถูกลบเรียบร้อย");
        } catch (err) {
          Alert.alert("Error", err.message || "เกิดข้อผิดพลาด");
        }
      })();
      return;
    }

    Alert.alert("ลบรายการ", "ต้องการลบรายการนี้หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        style: "destructive",
        onPress: async () => {
          try {
            await remove(ref(db, `votes/${id}`));
            Alert.alert("ลบแล้ว", "รายการถูกลบเรียบร้อย");
          } catch (err) {
            Alert.alert("Error", err.message || "เกิดข้อผิดพลาด");
          }
        },
      },
    ]);
  };

  const getVoteStatusText = (voteId) => {
    return voteHistory[voteId] ? "โหวตแล้ว" : "รอการโหวต";
  };

  const getVoteStatusStyle = (voteId) => {
    return voteHistory[voteId] ? styles.badgeSuccess : styles.badgeWarning;
  };

  const renderItem = ({ item }) => {
    const voted = !!voteHistory[item.id];

    return (
      <View style={styles.cardRow}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("VoteDetail", { id: item.id })}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="how-to-vote" size={22} color="#2563EB" />
            </View>

            <View style={styles.textWrap}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{item.date || "-"}</Text>

              {role === "member" && (
                <View style={[styles.badge, getVoteStatusStyle(item.id)]}>
                  <Text
                    style={[
                      styles.badgeText,
                      voted ? styles.badgeTextSuccess : styles.badgeTextWarning,
                    ]}
                  >
                    {getVoteStatusText(item.id)}
                  </Text>
                </View>
              )}
            </View>

            <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
          </View>
        </TouchableOpacity>

        {role === "admin" && (
          <View style={styles.adminActions}>
            <TouchableOpacity
              onPress={() => openEdit(item)}
              style={styles.actionBtn}
            >
              <MaterialIcons name="edit" size={18} color="#2563EB" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.actionBtn}
            >
              <MaterialIcons name="delete" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
        >
          <MaterialIcons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Vote</Text>

        <View style={styles.headerRight}>
          {role === "member" && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate("VoteHistory")}
            >
              <MaterialIcons name="history" size={20} color="#374151" />
            </TouchableOpacity>
          )}

          {role === "admin" && (
            <TouchableOpacity style={styles.addButton} onPress={openAdd}>
              <MaterialIcons name="add" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={votes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconCircle}>
              <MaterialIcons name="ballot" size={34} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>ยังไม่มีรายการโหวต</Text>
            <Text style={styles.emptySub}>
              เมื่อมีรายการโหวตใหม่ ระบบจะแสดงที่หน้านี้
            </Text>
          </View>
        }
      />

      {role === "admin" && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {editingItem ? "แก้ไขรายการโหวต" : "เพิ่มรายการโหวต"}
              </Text>

              <TextInput
                placeholder="ชื่อรายการ"
                style={styles.input}
                value={titleInput}
                onChangeText={setTitleInput}
              />

              <TextInput
                placeholder="วันที่ / เวลา"
                style={styles.input}
                value={dateInput}
                onChangeText={setDateInput}
              />

              <TextInput
                placeholder="รายละเอียด"
                style={[styles.input, { height: 90 }]}
                value={descriptionInput}
                onChangeText={setDescriptionInput}
                multiline
              />

              <TextInput
                placeholder="Image URL (optional)"
                style={styles.input}
                value={imageInput}
                onChangeText={setImageInput}
              />

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelText}>ยกเลิก</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, styles.saveBtn]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveText}>บันทึก</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF4FF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 60,
    backgroundColor: "#EEF4FF",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  headerRight: {
    minWidth: 40,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginLeft: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginLeft: 8,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 24,
    paddingTop: 6,
  },
  cardRow: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EAF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 22,
  },
  date: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 10,
  },
  badgeSuccess: {
    backgroundColor: "#ECFDF5",
  },
  badgeWarning: {
    backgroundColor: "#FFF7ED",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  badgeTextSuccess: {
    color: "#16A34A",
  },
  badgeTextWarning: {
    color: "#D97706",
  },
  adminActions: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: [{ translateY: -18 }],
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  emptyWrap: {
    marginTop: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  emptySub: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    backgroundColor: "#fff",
  },
  modalBtnRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  modalBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    backgroundColor: "#eee",
    marginRight: 8,
  },
  saveBtn: {
    backgroundColor: "#2563EB",
  },
  cancelText: {
    color: "#444",
    fontWeight: "600",
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
  },
});