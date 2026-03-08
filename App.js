import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Platform, Text } from 'react-native';
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


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#0766f7',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 11, marginTop: 2 },
        tabBarStyle: { height: 64, backgroundColor: '#fff', borderTopWidth: 0.5, borderColor: '#eee', elevation: 0, paddingBottom: Platform.OS === 'android' ? 8 : 12 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, siz}) => (
            <View style={{ alignItems: 'center' }}>
                <MaterialIcons name="home" size={20} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Card"
        component={CardScreen}
        options={{
          tabBarIcon: ({ color, size}) => (
            <View style={{ alignItems: 'center' }}>
              <MaterialIcons name="credit-card" size={20}  />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarButton: (props) => {
            return (
              <TouchableOpacity
                onPress={props.onPress}
                style={{ top: -28, justifyContent: 'center', alignItems: 'center' }}
              >
                <View style={styles.fab}>
                  <MaterialIcons name="photo-camera" size={28} color="#fff" />
                </View>
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tab.Screen
        name="Challenge"
        component={ChallengeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ alignItems: 'center' }}>
                <MaterialIcons name="emoji-events" size={20} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarIcon: ({ color, size}) => (
            <View style={{ alignItems: 'center' }}>
                <MaterialIcons name="settings" size={20} />
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
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </UserAuthContextProvider>
  );
}

const styles = StyleSheet.create({
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
  centerLabel: { marginTop: 6, fontSize: 11 },
});
