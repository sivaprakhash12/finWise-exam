import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

// Executive Floating Bottom Dock
export const tabScreenOptions = (icons, bottomInset = 0) => ({ route }) => ({
  headerShown: false,
  tabBarShowLabel: false,
  tabBarHideOnKeyboard: true,
  tabBarStyle: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: 72 + bottomInset,
    paddingTop: 10,
    paddingBottom: bottomInset + 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  tabBarIcon: ({ focused }) => (
    <View style={{
      width: 50,
      height: 44,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: focused ? COLORS.primary : 'transparent',
      shadowColor: focused ? COLORS.primary : 'transparent',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: focused ? 0.35 : 0,
      shadowRadius: 8,
      elevation: focused ? 4 : 0,
    }}>
      <Ionicons
        name={icons[route.name]}
        size={23}
        color={focused ? COLORS.void : COLORS.lightGrey}
      />
    </View>
  ),
});
