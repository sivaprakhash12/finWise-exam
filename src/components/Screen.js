import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { COLORS } from '../theme';
import { T } from './UI';
import { useApp } from '../context/AppContext';

/**
 * Green header (back / menu, title, bell)
 * left: 'menu' | 'back' | null      right: 'bell' | null      align: 'center' | 'left'
 */
export function Header({ title, subtitle, left = 'menu', right = 'bell', align = 'center', large }) {
  const navigation = useNavigation();
  const app = useApp();
  const unread = app?.unreadCount || 0;

  const onLeft = () => {
    if (left === 'back') navigation.goBack();
    else navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.header}>
      {left ? (
        <TouchableOpacity onPress={onLeft} style={styles.side} hitSlop={10}>
          <Ionicons name={left === 'back' ? 'arrow-back' : 'menu-outline'} size={22} color={COLORS.white} />
        </TouchableOpacity>
      ) : <View style={styles.sidePlaceholder} />}

      <View style={{ flex: 1, alignItems: align === 'left' ? 'flex-start' : 'center', paddingHorizontal: 8 }}>
        <T weight={align === 'left' ? 'bold' : 'bold'} style={[styles.title, large && styles.large]} numberOfLines={1}>
          {title}
        </T>
        {subtitle ? <T style={styles.subtitle}>{subtitle}</T> : null}
      </View>

      {right === 'bell' ? (
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.bell}>
          <Ionicons name="notifications-outline" size={19} color={COLORS.primary} />
          {unread > 0 ? (
            <View style={styles.badge}><T weight="bold" style={styles.badgeText}>{unread > 9 ? '9+' : unread}</T></View>
          ) : null}
        </TouchableOpacity>
      ) : <View style={styles.sidePlaceholder} />}
    </View>
  );
}

/**
 * Executive FinTech Layout: Deep Midnight Emerald header canvas with crisp White Sheet
 */
export default function Screen({ header, top, children, scroll = true, contentStyle, footer, floating }) {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']}>
        <Header {...header} />
        {top ? <View style={styles.top}>{top}</View> : <View style={{ height: 14 }} />}
      </SafeAreaView>

      <View style={{ flex: 1 }}>
        <View style={styles.sheet}>
          {scroll ? (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
              <ScrollView
                contentContainerStyle={[styles.content, contentStyle]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            </KeyboardAvoidingView>
          ) : (
            <View style={[styles.content, { flex: 1, paddingBottom: 0 }, contentStyle]}>{children}</View>
          )}
          {footer}
        </View>
        {floating ? <View style={styles.floating} pointerEvents="box-none">{floating}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.headerBg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 6, minHeight: 56 },
  side: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.headerCard, borderWidth: 1, borderColor: COLORS.headerBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  sidePlaceholder: { width: 40, height: 40 },
  title: { fontSize: 20, color: COLORS.headerText, letterSpacing: -0.3 },
  large: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 13, color: COLORS.headerMuted, marginTop: 1 },
  bell: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.headerCard, borderWidth: 1, borderColor: COLORS.headerBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    position: 'absolute', top: -3, right: -3, minWidth: 18, height: 18, borderRadius: 9,
    backgroundColor: COLORS.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
    borderWidth: 1.5, borderColor: COLORS.headerBg,
  },
  badgeText: { color: COLORS.white, fontSize: 9, lineHeight: 12 },
  top: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 22 },
  sheet: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  content: { paddingHorizontal: 24, paddingTop: 26, paddingBottom: 40 },
  floating: { position: 'absolute', top: -52, left: 0, right: 0, alignItems: 'center' },
});
