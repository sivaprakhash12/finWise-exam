import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import { EmptyState, T } from '../../components/UI';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../theme';
import { formatTime, formatDate } from '../../utils/format';
import { sectionTitleForDay } from '../../utils/reports';

export default function NotificationsScreen() {
  const { notifications, markAllRead, clearNotifications } = useApp();

  // mark as read when leaving the screen so "new" dots are visible while reading
  useEffect(() => () => markAllRead(), []);

  const groups = ['Today', 'Yesterday', 'This Week', 'Earlier']
    .map((g) => ({ title: g, data: notifications.filter((n) => sectionTitleForDay(n.date) === g) }))
    .filter((g) => g.data.length);

  return (
    <Screen header={{ title: 'Notification', right: null }}>
      {notifications.length ? (
        <TouchableOpacity onPress={clearNotifications} style={{ alignSelf: 'flex-end', marginBottom: 6 }}>
          <T weight="semibold" style={{ color: COLORS.blue, fontSize: 13 }}>Clear all</T>
        </TouchableOpacity>
      ) : null}
      {groups.length === 0 ? <EmptyState icon="notifications-off-outline" text="You're all caught up. Alerts about your transactions show up here." /> : null}
      {groups.map((g) => (
        <View key={g.title}>
          <T weight="medium" style={{ fontSize: 14, marginBottom: 12, marginTop: 4 }}>{g.title}</T>
          {g.data.map((n) => (
            <View key={n.id} style={styles.item}>
              <View style={styles.icon}><Ionicons name="notifications-outline" size={22} color={COLORS.white} /></View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <T weight="medium" style={{ fontSize: 14, flex: 1 }}>{n.title}</T>
                  {!n.read ? <View style={styles.dot} /> : null}
                </View>
                <T style={{ fontSize: 12 }}>{n.message}</T>
                <T style={styles.time}>{formatTime(n.date)} - {formatDate(n.date)}</T>
              </View>
            </View>
          ))}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', paddingBottom: 14, marginBottom: 14, borderBottomWidth: 1, borderColor: COLORS.primary },
  icon: { width: 40, height: 40, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.blue },
  time: { fontSize: 11, color: COLORS.blue, textAlign: 'right', marginTop: 4 },
});
