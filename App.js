import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import NotificationScreen from './screens/NotificationScreen'; 
import ProfileScreen from './screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';



const Tab = createBottomTabNavigator(); 

export default function App() { 
 return (
     <NavigationContainer> 
     <Tab.Navigator 
        screenOptions={({ route }) => ({  
           tabBarIcon: ({ color, size }) => { 
             let iconName;
                if (route.name === 'Home') iconName = 'home-outline'; 
       else if (route.name === 'Search') iconName = 'search-outline';
       else if (route.name === 'Notifications') iconName = 'notifications-outline';
       else if (route.name === 'Profile') iconName = 'person-outline';
              return <Ionicons name={iconName} size={size} color={color} />; 
         },
         tabBarActiveTintColor: '#ff6600', 
         tabBarInactiveTintColor: 'gray',  
         headerShown: false, 
       })}
     >
       <Tab.Screen name="Home" component={HomeScreen} /> 
       <Tab.Screen name="Search" component={SearchScreen} />
       <Tab.Screen name="Notifications" component={NotificationScreen} />
       <Tab.Screen name="Profile" component={ProfileScreen} />
     </Tab.Navigator>
   </NavigationContainer>
 );
}