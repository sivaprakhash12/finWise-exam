import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../theme';
import { tabScreenOptions } from './TabBar';
import DrawerContent from './DrawerContent';

import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import CustomersScreen from '../screens/admin/CustomersScreen';
import CustomerDetailScreen from '../screens/admin/CustomerDetailScreen';
import AnalysisScreen from '../screens/shared/AnalysisScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import AboutScreen from '../screens/shared/AboutScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CustomersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: COLORS.primary } }}>
      <Stack.Screen name="CustomerList" component={CustomersScreen} />
      <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} />
    </Stack.Navigator>
  );
}

const ICONS = { DashboardTab: 'home-outline', AnalysisTab: 'stats-chart-outline', CustomersTab: 'people-outline' };

function AdminTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator screenOptions={tabScreenOptions(ICONS, insets.bottom)}>
      <Tab.Screen name="DashboardTab" component={AdminDashboardScreen} />
      <Tab.Screen name="AnalysisTab" component={AnalysisScreen} />
      <Tab.Screen name="CustomersTab" component={CustomersStack} />
    </Tab.Navigator>
  );
}

const MENU = [
  { label: 'Dashboard', icon: 'home-outline', route: 'AdminTabs', tab: 'DashboardTab' },
  { label: 'Analysis', icon: 'stats-chart-outline', route: 'AdminTabs', tab: 'AnalysisTab' },
  { label: 'Customers', icon: 'people-outline', route: 'AdminTabs', tab: 'CustomersTab' },
  { label: 'Notifications', icon: 'notifications-outline', route: 'Notifications' },
  { label: 'About App', icon: 'information-circle-outline', route: 'About' },
];

export default function AdminNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} items={MENU} />}
      screenOptions={{ headerShown: false, drawerType: 'front', drawerStyle: { width: 290, backgroundColor: COLORS.honeydew } }}
    >
      <Drawer.Screen name="AdminTabs" component={AdminTabs} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
    </Drawer.Navigator>
  );
}
