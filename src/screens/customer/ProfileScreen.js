import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import { ConfirmModal, T } from '../../components/UI';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme';
import { initials } from '../../utils/format';

export function Avatar({ name, size = 110 }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <T weight="bold" style={{ fontSize: size * 0.34, color: COLORS.white }}>{initials(name)}</T>
    </View>
  );
}

// Part I – 3. Profile screen (customer only)
export default function ProfileScreen({ navigation }) {
  const { currentUser, logout } = useApp();
  const [confirm, setConfirm] = useState(false);

  const items = [
    { icon: 'person-outline', label: 'Edit Profile', onPress: () => navigation.navigate('EditProfile') },
    { icon: 'shield-checkmark-outline', label: 'Security', onPress: () => navigation.navigate('Security') },
    { icon: 'settings-outline', label: 'Setting', onPress: () => navigation.navigate('EditProfile') },
    { icon: 'help-circle-outline', label: 'Help', onPress: () => Alert.alert('Help', 'Add transactions from the Transaction or Categories tab. Tap a row to edit, long press to delete. Reports are on the Home screen.') },
    { icon: 'log-out-outline', label: 'Logout', onPress: () => setConfirm(true) },
  ];

  return (
    <Screen header={{ title: 'Profile' }} top={<View style={{ height: 50 }} />} floating={<Avatar name={currentUser.name} />}
      contentStyle={{ paddingTop: 66 }}>
      <T weight="bold" style={{ fontSize: 20, textAlign: 'center' }}>{currentUser.name}</T>
      <T style={{ fontSize: 13, textAlign: 'center' }}><T weight="semibold" style={{ fontSize: 13 }}>ID: </T>{currentUser.id}</T>
      <View style={{ marginTop: 24 }}>
        {items.map((i) => (
          <TouchableOpacity key={i.label} style={styles.item} onPress={i.onPress}>
            <View style={styles.icon}><Ionicons name={i.icon} size={24} color={COLORS.white} /></View>
            <T weight="medium" style={{ fontSize: 15, marginLeft: 16, flex: 1 }}>{i.label}</T>
            <Ionicons name="chevron-forward" size={18} color={COLORS.grey} />
          </TouchableOpacity>
        ))}
      </View>
      <ConfirmModal visible={confirm} title="End Session" message="Are you sure you want to log out?"
        confirmText="Yes, End Session" onCancel={() => setConfirm(false)} onConfirm={() => { setConfirm(false); logout(); }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: { backgroundColor: COLORS.void, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: COLORS.honeydew },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  icon: { width: 56, height: 52, borderRadius: 22, backgroundColor: COLORS.lightBlue, alignItems: 'center', justifyContent: 'center' },
});
