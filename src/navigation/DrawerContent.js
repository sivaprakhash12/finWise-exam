import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { ConfirmModal, T } from '../components/UI';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme';
import { initials } from '../utils/format';

// Custom drawer: profile header + menu items that can jump into tabs
export default function DrawerContent({ navigation, state, items }) {
  const { currentUser, logout, unreadCount } = useApp();
  const [confirm, setConfirm] = useState(false);
  const current = state.routes[state.index];
  const currentTab = current.state ? current.state.routes[current.state.index]?.name : current.params?.screen;

  if (!currentUser) return null;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.honeydew }}>
      <DrawerContentScrollView contentContainerStyle={{ paddingTop: 0 }}>
        <TouchableOpacity
          style={styles.head}
          activeOpacity={0.8}
          onPress={() => {
            navigation.closeDrawer();
            if (currentUser.role === 'admin') {
              navigation.navigate('EditProfile');
            } else {
              navigation.navigate('MainTabs', { screen: 'ProfileTab', params: { screen: 'EditProfile' } });
            }
          }}
        >
          <View style={styles.avatar}><T weight="bold" style={{ color: COLORS.white, fontSize: 24 }}>{initials(currentUser.name)}</T></View>
          <T weight="bold" style={{ fontSize: 19, color: COLORS.white, marginTop: 12 }}>{currentUser.name}</T>
          <T style={{ fontSize: 12, color: COLORS.headerMuted, marginTop: 1 }}>{currentUser.email}</T>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <View style={styles.role}>
              <T weight="bold" style={{ fontSize: 11, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {currentUser.role === 'admin' ? 'Administrator' : 'Customer Account'}
              </T>
            </View>
            <View style={{ marginLeft: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
              <Ionicons name="create-outline" size={13} color={COLORS.white} />
              <T weight="semibold" style={{ fontSize: 11, color: COLORS.white, marginLeft: 4 }}>Edit</T>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ paddingHorizontal: 16, paddingTop: 18 }}>
          {items.map((it) => {
            const active = it.tab ? current.name === it.route && currentTab === it.tab : current.name === it.route;
            return (
              <TouchableOpacity key={it.label} style={[styles.item, active && styles.active]}
                onPress={() => {
                  navigation.closeDrawer();
                  if (it.screen && it.route) {
                    navigation.navigate(it.route, { screen: it.screen });
                  } else if (it.tab) {
                    navigation.navigate(it.route, { screen: it.tab });
                  } else {
                    navigation.navigate(it.route);
                  }
                }}>
                <Ionicons name={it.icon} size={21} color={active ? COLORS.primaryDark : COLORS.grey} />
                <T weight={active ? 'bold' : 'medium'} style={{ fontSize: 14, marginLeft: 14, flex: 1, color: active ? COLORS.primaryDark : COLORS.dark }}>
                  {it.label}
                </T>
                {it.route === 'Notifications' && unreadCount > 0 ? (
                  <View style={styles.badge}><T weight="bold" style={{ color: COLORS.white, fontSize: 10 }}>{unreadCount}</T></View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>
      <TouchableOpacity style={styles.logout} onPress={() => setConfirm(true)}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
        <T weight="bold" style={{ fontSize: 14, marginLeft: 12, color: COLORS.danger }}>End Session</T>
      </TouchableOpacity>
      <ConfirmModal visible={confirm} title="End Session" message="Are you sure you want to log out?" confirmText="Yes, Log Out"
        onCancel={() => setConfirm(false)} onConfirm={() => { setConfirm(false); logout(); }} />
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    backgroundColor: COLORS.headerBg,
    paddingTop: 54,
    paddingBottom: 24,
    paddingHorizontal: 22,
    borderBottomRightRadius: 36,
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COLORS.primaryDark, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: COLORS.primary,
  },
  role: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.headerCard,
    borderWidth: 1, borderColor: COLORS.headerBorder,
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3, marginTop: 8,
  },
  item: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 16, marginBottom: 4,
  },
  active: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1, borderColor: 'rgba(0, 208, 158, 0.25)',
  },
  badge: {
    backgroundColor: COLORS.danger, borderRadius: 10, minWidth: 20, height: 20,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5,
  },
  logout: {
    flexDirection: 'row', alignItems: 'center', padding: 22, paddingBottom: 34,
    borderTopWidth: 1, borderColor: '#E2E8F0', backgroundColor: COLORS.white,
  },
});
