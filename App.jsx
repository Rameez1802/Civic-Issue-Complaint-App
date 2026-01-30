// App.jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

// Pages / navigators
import Navigation from './src/navigations/Navigation'; // your nested Home stack
import PendingReports from './src/Pages/PendingReports';
import ResolvedReports from './src/Pages/ResolvedReports';
import ProfilePage from './src/Pages/ProfilePage';


import SignupNavigation from './src/navigations/SignupNavigation'; // your signup/login stack
import ProfileNavigation from './src/navigations/ProfileNavigations'
// icons
import FeatherIcon from 'react-native-vector-icons/Feather';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarLabelStyle: { fontSize: 15 },
        tabBarStyle: { height: 85, backgroundColor: "#BCDEFF", paddingTop: 6, borderRadius: 15 },
        headerStyle: { backgroundColor: "#155DA4", height: 106 },
        headerTitleAlign: "center",
        headerTitleStyle: { fontSize: 25, color: "white" }
      }}
    >
      <Tab.Screen
        name="Home"
        component={Navigation}
        options={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => <FeatherIcon name="home" size={25} color={color} />,
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";
            if (routeName === "ReportIssue") {
              return { display: "none" };
            }
            return { height: 85, backgroundColor: "#BCDEFF", paddingTop: 6, borderRadius: 15 };
          })(route),
        })}
      />

      <Tab.Screen
        name="Pending"
        component={PendingReports}
        options={{
          headerTitle: "Pending Reports",
          tabBarIcon: ({ color }) => <EntypoIcon name="back-in-time" size={25} color={color} />
        }}
      />

      <Tab.Screen
        name="Resolved"
        component={ResolvedReports}
        options={{
          headerTitle: "Resolved Reports",
          tabBarIcon: ({ color }) => <FeatherIcon name="check-circle" size={25} color={color} />
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileNavigation}
        options={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => <FeatherIcon name="user" size={25} color={color} />,
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";
            if (routeName === "Notifications" || routeName === "Help") {
              return { display: "none" };
            }
            return { height: 85, backgroundColor: "#BCDEFF", paddingTop: 6, borderRadius: 15 };
          })(route),
        })}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
      
        <RootStack.Screen name="Auth" component={SignupNavigation} />
        <RootStack.Screen name="Main" component={MyTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
