import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../theme';
import { tabScreenOptions } from './TabBar';
import DrawerContent from './DrawerContent';

import HomeScreen from '../screens/customer/HomeScreen';
import AnalysisScreen from '../screens/shared/AnalysisScreen';
import TransactionsScreen from '../screens/customer/TransactionsScreen';
import AddTransactionScreen from '../screens/customer/AddTransactionScreen';
import CategoriesScreen from '../screens/customer/CategoriesScreen';
import CategoryDetailScreen from '../screens/customer/CategoryDetailScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import EditProfileScreen from '../screens/customer/EditProfileScreen';
import SecurityScreen from '../screens/customer/SecurityScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import AboutScreen from '../screens/shared/AboutScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const TxStack = createNativeStackNavigator();
const CatStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const stackOptions = { headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: COLORS.primary } };

// ---- Stack navigators (inside tabs) ----
function TransactionsStack() {
  return (
    <TxStack.Navigator screenOptions={stackOptions}>
      <TxStack.Screen name="Transactions" component={TransactionsScreen} />
      <TxStack.Screen name="AddTransaction" component={AddTransactionScreen} />
    </TxStack.Navigator>
  );
}

function CategoriesStack() {
  return (
    <CatStack.Navigator screenOptions={stackOptions}>
      <CatStack.Screen name="Categories" component={CategoriesScreen} />
      <CatStack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
      <CatStack.Screen name="AddTransaction" component={AddTransactionScreen} />
    </CatStack.Navigator>
  );
}

function ProfileStackNav() {
  return (
    <ProfileStack.Navigator screenOptions={stackOptions}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="Security" component={SecurityScreen} />
    </ProfileStack.Navigator>
  );
}

// ---- Bottom tabs ----
const ICONS = {
  HomeTab: 'home-outline',
  AnalysisTab: 'stats-chart-outline',
  TransactionsTab: 'swap-horizontal-outline',
  CategoriesTab: 'layers-outline',
  ProfileTab: 'person-outline',
};

function CustomerTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator screenOptions={tabScreenOptions(ICONS, insets.bottom)}>
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="AnalysisTab" component={AnalysisScreen} options={{ title: 'Analysis' }} />
      <Tab.Screen name="TransactionsTab" component={TransactionsStack} options={{ title: 'Transactions' }} />
      <Tab.Screen name="CategoriesTab" component={CategoriesStack} options={{ title: 'Categories' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNav} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// ---- Drawer (root of the customer area) ----
const MENU = [
  { label: 'Home', icon: 'home-outline', route: 'MainTabs', tab: 'HomeTab' },
  { label: 'Analysis', icon: 'stats-chart-outline', route: 'MainTabs', tab: 'AnalysisTab' },
  { label: 'Transactions', icon: 'swap-horizontal-outline', route: 'MainTabs', tab: 'TransactionsTab' },
  { label: 'Categories', icon: 'layers-outline', route: 'MainTabs', tab: 'CategoriesTab' },
  { label: 'Profile', icon: 'person-outline', route: 'MainTabs', tab: 'ProfileTab' },
  { label: 'Notifications', icon: 'notifications-outline', route: 'Notifications' },
  { label: 'About App', icon: 'information-circle-outline', route: 'About' },
];

export default function CustomerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} items={MENU} />}
      screenOptions={{ headerShown: false, drawerType: 'front', drawerStyle: { width: 290, backgroundColor: COLORS.honeydew } }}
    >
      <Drawer.Screen name="MainTabs" component={CustomerTabs} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
    </Drawer.Navigator>
  );
}
