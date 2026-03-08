import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ref, push, set } from 'firebase/database';
import { db } from '../firebase';
import { useUserAuth } from '../context/UserAuthContext';

export default function CameraScreen({ navigation, route }) {
  const cameraRef = useRef(null);
  const { user } = useUserAuth();

  const [permission, requestPermission] = useCameraPermissions();
  const [isSaving, setIsSaving] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const uid = user?.uid || 'guest_user';
  const challengeId = route?.params?.challengeId || '';

  const captureAndSaveLog = async () => {
    try {
      if (!cameraRef.current) {
        Alert.alert('แจ้งเตือน', 'กล้องยังไม่พร้อม');
        return;
      }

      if (!isCameraReady) {
        Alert.alert('แจ้งเตือน', 'กรุณารอสักครู่ให้กล้องพร้อมก่อน');
        return;
      }

      setIsSaving(true);

      // ถ่ายรูปจริง
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        skipProcessing: false,
      });

      if (!photo?.uri) {
        throw new Error('ถ่ายรูปไม่สำเร็จ');
      }

      // เก็บเฉพาะข้อมูลวันเวลา ไม่อัปโหลดรูป
      const now = new Date();
      const newLogRef = push(ref(db, `/cameraLogs${uid}`));

      await set(newLogRef, {
        challengeId,
        userId: uid,
        userEmail: user?.email || '',
        capturedAt: now.toISOString(),
        capturedDate: now.toLocaleDateString('th-TH'),
        capturedTime: now.toLocaleTimeString('th-TH'),
        timestamp: Date.now(),
        platform: Platform.OS,
        localPhotoUri: photo.uri, // เก็บ uri ไว้ดูในเครื่องชั่วคราวได้
      });

      Alert.alert('สำเร็จ', 'บันทึกวันและเวลาที่ถ่ายรูปเรียบร้อยแล้ว');
    } catch (error) {
      console.log('CAMERA LOG ERROR:', error);
      Alert.alert('ผิดพลาด', error?.message || 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setIsSaving(false);
    }
  };

  if (!permission) {
    return <View style={styles.loadingContainer} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="camera-alt" size={64} color="#2563EB" />
        <Text style={styles.permissionTitle}>ต้องอนุญาตการใช้งานกล้องก่อน</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>อนุญาตกล้อง</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onCameraReady={() => setIsCameraReady(true)}
      />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isSaving}
        >
          <MaterialIcons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        {isSaving ? (
          <View style={styles.savingWrap}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.savingText}>กำลังบันทึกเวลา...</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.captureOuter}
            onPress={captureAndSaveLog}
            activeOpacity={0.85}
          >
            <View style={styles.captureInner}>
              <MaterialIcons name="photo-camera" size={34} color="#2563EB" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  permissionButton: {
    marginTop: 20,
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 45,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureOuter: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: 'rgba(255,255,255,0.28)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingWrap: {
    alignItems: 'center',
  },
  savingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});