import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { UserAuthContextProvider } from './src/context/UserAuthContext';

import HomeScreen from './src/screens/HomeScreen';
import VoteScreen from './src/screens/VoteScreen';
import VoteDetail from './src/screens/VoteDetail';
import CardScreen from './src/screens/CardScreen';
import CameraScreen from './src/screens/CameraScreen';
import ChallengeScreen from './src/screens/ChallengeScreen';
import SettingScreen from './src/screens/SettingScreen';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import ChallengeDetailScreen from './src/screens/ChallengeDetailScreen';
import SearchScreen from './src/screens/SearchScreen';
import FormScreen from './src/screens/FormScreen';
import CardRightScreen from './src/screens/CardRightScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import LocationScreen from './src/screens/LocationScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import AnnouncementScreen from './src/screens/AnnouncementScreen';
import AnnouncementAdminScreen from './src/screens/AnnouncementAdminScreen';
import VoteHistoryScreen from "./src/screens/VoteHistoryScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#0766f7',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 2,
        },
        tabBarStyle: {
          height: 64,
          backgroundColor: '#fff',
          borderTopWidth: 0.5,
          borderColor: '#eee',
          elevation: 0,
          paddingBottom: Platform.OS === 'android' ? 8 : 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: 'center' }}>
              <MaterialIcons name="home" size={20} color={color} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Card"
        component={CardScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: 'center' }}>
              <MaterialIcons name="credit-card" size={20} color={color} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              onPress={props.onPress}
              style={styles.cameraButtonWrap}
              activeOpacity={0.85}
            >
              <View style={styles.fab}>
                <MaterialIcons name="photo-camera" size={28} color="#fff" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen
        name="Challenge"
        component={ChallengeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: 'center' }}>
              <MaterialIcons name="emoji-events" size={20} color={color} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: 'center' }}>
              <MaterialIcons name="settings" size={20} color={color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <UserAuthContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Vote" component={VoteScreen} />
          <Stack.Screen name="VoteDetail" component={VoteDetail} />
          <Stack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Form" component={FormScreen} />
          <Stack.Screen name="CardRight" component={CardRightScreen} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="Activity" component={ActivityScreen} />
          <Stack.Screen name="Announcements" component={AnnouncementScreen} />
          <Stack.Screen name="AnnouncementAdmin" component={AnnouncementAdminScreen} />
          <Stack.Screen name="VoteHistory" component={VoteHistoryScreen}/>
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </UserAuthContextProvider>
  );
}

const styles = StyleSheet.create({
  cameraButtonWrap: {
    top: -28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0766f7',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});